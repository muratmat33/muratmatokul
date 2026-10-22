import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  INITIAL_LEFT_CATEGORIES,
  INITIAL_NOTES,
  INITIAL_GRADE_CONTENTS,
  INITIAL_EXTERNAL_GAMES,
  INITIAL_DUEL_QUESTIONS,
  INITIAL_STUDENTS_BY_CLASS,
  INITIAL_ANNUAL_PLANS,
  StudentAccount,
} from './src/data/initialData.ts';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'platform-store-v4.json');

interface PlatformStore {
  students: StudentAccount[];
  leftCategories: typeof INITIAL_LEFT_CATEGORIES;
  notes: typeof INITIAL_NOTES;
  gradeContents: typeof INITIAL_GRADE_CONTENTS;
  externalGames: typeof INITIAL_EXTERNAL_GAMES;
  duelQuestions: typeof INITIAL_DUEL_QUESTIONS;
  attendanceByClass: typeof INITIAL_STUDENTS_BY_CLASS;
  annualPlansById: typeof INITIAL_ANNUAL_PLANS;
}

function loadStore(): PlatformStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        students: parsed.students || [],
        leftCategories: parsed.leftCategories || INITIAL_LEFT_CATEGORIES,
        notes: parsed.notes || INITIAL_NOTES,
        gradeContents: parsed.gradeContents || INITIAL_GRADE_CONTENTS,
        externalGames: parsed.externalGames || INITIAL_EXTERNAL_GAMES,
        duelQuestions: parsed.duelQuestions || INITIAL_DUEL_QUESTIONS,
        attendanceByClass: parsed.attendanceByClass || INITIAL_STUDENTS_BY_CLASS,
        annualPlansById: parsed.annualPlansById || INITIAL_ANNUAL_PLANS,
      };
    }
  } catch (err) {
    console.error('Error loading platform store:', err);
  }
  return {
    students: [],
    leftCategories: INITIAL_LEFT_CATEGORIES,
    notes: INITIAL_NOTES,
    gradeContents: INITIAL_GRADE_CONTENTS,
    externalGames: INITIAL_EXTERNAL_GAMES,
    duelQuestions: INITIAL_DUEL_QUESTIONS,
    attendanceByClass: INITIAL_STUDENTS_BY_CLASS,
    annualPlansById: INITIAL_ANNUAL_PLANS,
  };
}

function saveStore(store: PlatformStore) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving platform store:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '2mb' }));

  // Get full platform state
  app.get('/api/state', (_req, res) => {
    const store = loadStore();
    res.json({
      leftCategories: store.leftCategories,
      notes: store.notes,
      gradeContents: store.gradeContents,
      externalGames: store.externalGames,
      duelQuestions: store.duelQuestions,
      attendanceByClass: store.attendanceByClass,
      annualPlansById: store.annualPlansById,
      studentCount: store.students.length,
      students: store.students.map((s) => ({
        id: s.id,
        username: s.username,
        registeredAt: s.registeredAt,
      })),
    });
  });

  // Update teacher-managed content
  app.post('/api/state', (req, res) => {
    const store = loadStore();
    const body = req.body || {};
    if (body.leftCategories) store.leftCategories = body.leftCategories;
    if (body.notes) store.notes = body.notes;
    if (body.gradeContents) store.gradeContents = body.gradeContents;
    if (body.externalGames) store.externalGames = body.externalGames;
    if (body.duelQuestions) store.duelQuestions = body.duelQuestions;
    if (body.attendanceByClass) store.attendanceByClass = body.attendanceByClass;
    if (body.annualPlansById) store.annualPlansById = body.annualPlansById;
    saveStore(store);
    res.json({ ok: true });
  });

  // Teacher & Student Login
  app.post('/api/auth/login', (req, res) => {
    const { role, username, password } = req.body || {};
    const cleanUser = String(username || '').trim();
    const cleanPass = String(password || '');

    if (role === 'teacher') {
      if (cleanUser === 'muratmat' && cleanPass === '123456') {
        return res.json({
          ok: true,
          user: { role: 'teacher', username: 'muratmat', displayName: 'Murat Öğretmen' },
        });
      }
      return res.status(401).json({
        ok: false,
        error: 'Öğretmen kullanıcı adı veya şifre hatalı.',
      });
    }

    // Student Login
    const store = loadStore();
    const found = store.students.find(
      (s) => s.username.toLowerCase() === cleanUser.toLowerCase() && s.password === cleanPass
    );
    if (!found) {
      return res.status(401).json({
        ok: false,
        error: 'Öğrenci bulunamadı veya şifre hatalı. Önce kayıt olduğunuzdan emin olun.',
      });
    }
    return res.json({
      ok: true,
      user: { role: 'student', username: found.username, displayName: found.username },
    });
  });

  // Student Registration (Username & Password only)
  app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body || {};
    const cleanUser = String(username || '').trim();
    const cleanPass = String(password || '');

    if (!cleanUser || !cleanPass) {
      return res.status(400).json({
        ok: false,
        error: 'Lütfen kullanıcı adı ve şifre girin.',
      });
    }

    if (cleanUser.toLowerCase() === 'muratmat') {
      return res.status(400).json({
        ok: false,
        error: 'Bu kullanıcı adı öğretmene aittir, lütfen farklı bir öğrenci kullanıcı adı seçin.',
      });
    }

    const store = loadStore();
    const exists = store.students.some(
      (s) => s.username.toLowerCase() === cleanUser.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({
        ok: false,
        error: 'Bu kullanıcı adı zaten kayıtlı. Giriş yapabilir veya başka bir ad seçebilirsiniz.',
      });
    }

    const newStudent: StudentAccount = {
      id: `stu-${Date.now()}`,
      username: cleanUser,
      password: cleanPass,
      registeredAt: new Date().toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    store.students.push(newStudent);
    saveStore(store);

    return res.json({
      ok: true,
      user: { role: 'student', username: newStudent.username, displayName: newStudent.username },
    });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
