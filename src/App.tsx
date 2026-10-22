import React, { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_LEFT_CATEGORIES,
  INITIAL_NOTES,
  INITIAL_GRADE_CONTENTS,
  INITIAL_EXTERNAL_GAMES,
  INITIAL_DUEL_QUESTIONS,
  INITIAL_STUDENTS_BY_CLASS,
  INITIAL_ANNUAL_PLANS,
  LeftSidebarCategory,
  TeacherLinkItem,
  TeacherNote,
  GradeContentItem,
  ExternalGameLink,
  DuelQuestion,
  StudentAttendanceRecord,
  StudentAccount,
  AnnualPlanWeekRow,
  GradeLevel,
} from './data/initialData';
import { MiniTetrisGame } from './components/MiniTetrisGame';
import { BilgiDuellosuGame } from './components/BilgiDuellosuGame';
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Plus,
  Pin,
  Trash2,
  Edit3,
  Search,
  X,
  Play,
  Pause,
  RotateCcw,
  Shuffle,
  BookOpen,
  ClipboardCheck,
  Link2,
  LogOut,
  Lock,
  UserCheck,
  GraduationCap,
  Users,
  Globe,
  Calendar,
} from 'lucide-react';

interface AuthenticatedUser {
  role: 'teacher' | 'student';
  username: string;
  displayName: string;
}

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => {
    const saved = sessionStorage.getItem('murat_active_user_v4');
    return saved ? JSON.parse(saved) : null;
  });
  const [authTab, setAuthTab] = useState<'teacher-login' | 'student-login' | 'student-register'>(
    'teacher-login'
  );
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);

  // Registered Students (localStorage + Server Sync)
  const [registeredStudents, setRegisteredStudents] = useState<StudentAccount[]>(() => {
    const saved = localStorage.getItem('murat_registered_students_v4');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistent Left Sidebar Categories & Links
  const [leftCategories, setLeftCategories] = useState<LeftSidebarCategory[]>(() => {
    const saved = localStorage.getItem('murat_left_categories_v4');
    return saved ? JSON.parse(saved) : INITIAL_LEFT_CATEGORIES;
  });

  // Persistent 36-Week Annual Plans
  const [annualPlansById, setAnnualPlansById] = useState<Record<string, AnnualPlanWeekRow[]>>(
    () => {
      const saved = localStorage.getItem('murat_annual_plans_v4');
      return saved ? JSON.parse(saved) : INITIAL_ANNUAL_PLANS;
    }
  );

  // Expanded Left Categories
  const [expandedCatIds, setExpandedCatIds] = useState<Record<string, boolean>>({
    'yillik-planlar': true,
    'sinif-yoklama': true,
    'notlarim-linkler': true,
  });

  // Persistent Teacher Notes
  const [notes, setNotes] = useState<TeacherNote[]>(() => {
    const saved = localStorage.getItem('murat_teacher_notes_v4');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  // Persistent 5, 6, 7, 8 Grade Contents (Right Sidebar - Maarif Modeli Matematik)
  const [gradeContents, setGradeContents] = useState<GradeContentItem[]>(() => {
    const saved = localStorage.getItem('murat_grade_contents_v4');
    return saved ? JSON.parse(saved) : INITIAL_GRADE_CONTENTS;
  });

  // Persistent External Game Links
  const [externalGames, setExternalGames] = useState<ExternalGameLink[]>(() => {
    const saved = localStorage.getItem('murat_external_games_v4');
    return saved ? JSON.parse(saved) : INITIAL_EXTERNAL_GAMES;
  });

  // Persistent Duel Questions
  const [duelQuestions, setDuelQuestions] = useState<DuelQuestion[]>(() => {
    const saved = localStorage.getItem('murat_duel_questions_v4');
    return saved ? JSON.parse(saved) : INITIAL_DUEL_QUESTIONS;
  });

  // Persistent Attendance Records
  const [attendanceByClass, setAttendanceByClass] = useState<
    Record<string, StudentAttendanceRecord[]>
  >(() => {
    const saved = localStorage.getItem('murat_attendance_v4');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS_BY_CLASS;
  });

  const isTeacher = currentUser?.role === 'teacher';

  // Fetch state from backend on mount & login so students always get teacher's latest shared content
  const fetchServerState = useCallback(async () => {
    try {
      const res = await fetch('/api/state');
      if (!res.ok) return;
      const data = await res.json();
      if (data.leftCategories) setLeftCategories(data.leftCategories);
      if (data.notes) setNotes(data.notes);
      if (data.gradeContents) setGradeContents(data.gradeContents);
      if (data.externalGames) setExternalGames(data.externalGames);
      if (data.duelQuestions) setDuelQuestions(data.duelQuestions);
      if (data.attendanceByClass) setAttendanceByClass(data.attendanceByClass);
      if (data.annualPlansById) setAnnualPlansById(data.annualPlansById);
    } catch {
      // Fallback to localStorage seamlessly
    }
  }, []);

  useEffect(() => {
    fetchServerState();
  }, [fetchServerState, currentUser]);

  // Sync teacher updates to backend + localStorage
  const syncTeacherStateToServer = useCallback(
    async (payload: {
      leftCategories?: LeftSidebarCategory[];
      notes?: TeacherNote[];
      gradeContents?: GradeContentItem[];
      externalGames?: ExternalGameLink[];
      duelQuestions?: DuelQuestion[];
      attendanceByClass?: Record<string, StudentAttendanceRecord[]>;
      annualPlansById?: Record<string, AnnualPlanWeekRow[]>;
    }) => {
      try {
        await fetch('/api/state', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch {
        // localStorage already updated
      }
    },
    []
  );

  useEffect(() => {
    localStorage.setItem('murat_left_categories_v4', JSON.stringify(leftCategories));
  }, [leftCategories]);

  useEffect(() => {
    localStorage.setItem('murat_annual_plans_v4', JSON.stringify(annualPlansById));
  }, [annualPlansById]);

  useEffect(() => {
    localStorage.setItem('murat_teacher_notes_v4', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('murat_grade_contents_v4', JSON.stringify(gradeContents));
  }, [gradeContents]);

  useEffect(() => {
    localStorage.setItem('murat_external_games_v4', JSON.stringify(externalGames));
  }, [externalGames]);

  useEffect(() => {
    localStorage.setItem('murat_duel_questions_v4', JSON.stringify(duelQuestions));
  }, [duelQuestions]);

  useEffect(() => {
    localStorage.setItem('murat_attendance_v4', JSON.stringify(attendanceByClass));
  }, [attendanceByClass]);

  useEffect(() => {
    localStorage.setItem('murat_registered_students_v4', JSON.stringify(registeredStudents));
  }, [registeredStudents]);

  // Right Sidebar Active Grade ('5' | '6' | '7' | '8')
  const [activeGrade, setActiveGrade] = useState<GradeLevel>('5');
  const [gradeTypeFilter, setGradeTypeFilter] = useState<string>('Tümü');

  // Center Active Game Tab
  const [activeGameTab, setActiveGameTab] = useState<'duello' | 'tetris' | 'zihin'>('duello');

  // Quick Math Reflex Mini-Game State
  const [mathA, setMathA] = useState(12);
  const [mathB, setMathB] = useState(15);
  const [mathOp, setMathOp] = useState<'+' | '-' | '×'>('×');
  const [mathInput, setMathInput] = useState('');
  const [mathScore, setMathScore] = useState(0);
  const [mathFeedback, setMathFeedback] = useState<string | null>(null);

  // Notes Filter & Composer State
  const [noteCategoryFilter, setNoteCategoryFilter] = useState<string>('Tümü');
  const [noteSearch, setNoteSearch] = useState('');
  const [showNoteComposer, setShowNoteComposer] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteUrl, setNoteUrl] = useState('');
  const [noteCategory, setNoteCategory] = useState<TeacherNote['category']>('Genel');
  const [notePinned, setNotePinned] = useState(false);
  const [noteShared, setNoteShared] = useState(true);

  // Classroom Quick Tools (Timer & Random Student Picker)
  const [timerSeconds, setTimerSeconds] = useState(2400); // 40 min lesson
  const [timerRunning, setTimerRunning] = useState(false);
  const [pickerClassId, setPickerClassId] = useState('yoklama-5a');
  const [pickedStudent, setPickedStudent] = useState<StudentAttendanceRecord | null>(null);

  // Active Left Item Modal (for viewing/editing links, attendance, or annual plan)
  const [selectedLeftItem, setSelectedLeftItem] = useState<{
    catId: string;
    item: TeacherLinkItem;
  } | null>(null);
  const [editingLinkUrl, setEditingLinkUrl] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentNumber, setNewStudentNumber] = useState('');

  // Annual Plan Term Filter & New Week Row Form inside Modal
  const [planTermFilter, setPlanTermFilter] = useState<'Tümü' | '1. Dönem' | '2. Dönem'>('Tümü');
  const [showAddPlanRow, setShowAddPlanRow] = useState(false);
  const [newPlanTerm, setNewPlanTerm] = useState<'1. Dönem' | '2. Dönem'>('1. Dönem');
  const [newPlanWeeks, setNewPlanWeeks] = useState('');
  const [newPlanMonth, setNewPlanMonth] = useState('');
  const [newPlanTheme, setNewPlanTheme] = useState('');
  const [newPlanCode, setNewPlanCode] = useState('');
  const [newPlanTopic, setNewPlanTopic] = useState('');
  const [newPlanAssessment, setNewPlanAssessment] = useState('');

  // Add New Link to Left Sidebar Category
  const [addingToCatId, setAddingToCatId] = useState<string | null>(null);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkSubtitle, setNewLinkSubtitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  // Add New Content to Right Sidebar (5, 6, 7, 8. Sınıf)
  const [showAddGradeContent, setShowAddGradeContent] = useState(false);
  const [newContentUnit, setNewContentUnit] = useState('Yeni Tema');
  const [newContentTitle, setNewContentTitle] = useState('');
  const [newContentType, setNewContentType] =
    useState<GradeContentItem['type']>('Konu Anlatımı');
  const [newContentWeek, setNewContentWeek] = useState('Güncel Hafta');
  const [newContentSummary, setNewContentSummary] = useState('');
  const [newContentUrl, setNewContentUrl] = useState('');

  // Selected Grade Content Detail / Link Modal
  const [selectedGradeItem, setSelectedGradeItem] = useState<GradeContentItem | null>(null);
  const [editingGradeItemUrl, setEditingGradeItemUrl] = useState('');

  // Add External Game Link Form
  const [showAddGameLink, setShowAddGameLink] = useState(false);
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameCategory, setNewGameCategory] = useState('');
  const [newGameDesc, setNewGameDesc] = useState('');
  const [newGameUrl, setNewGameUrl] = useState('');
  const [newGameGrade, setNewGameGrade] = useState('5, 6, 7 ve 8. Sınıf');

  // Handle Login / Registration
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    const cleanUser = authUsername.trim();
    const cleanPass = authPassword;

    if (!cleanUser || !cleanPass) {
      setAuthError('Lütfen kullanıcı adı ve şifrenizi girin.');
      return;
    }

    if (authTab === 'teacher-login') {
      if (cleanUser === 'muratmat' && cleanPass === '123456') {
        const userObj: AuthenticatedUser = {
          role: 'teacher',
          username: 'muratmat',
          displayName: 'Murat Öğretmen',
        };
        setCurrentUser(userObj);
        sessionStorage.setItem('murat_active_user_v4', JSON.stringify(userObj));
        setAuthUsername('');
        setAuthPassword('');
        return;
      } else {
        setAuthError('Öğretmen kullanıcı adı veya şifresi hatalı.');
        return;
      }
    }

    if (authTab === 'student-register') {
      if (cleanUser.toLowerCase() === 'muratmat') {
        setAuthError('Bu kullanıcı adı öğretmene aittir. Lütfen farklı bir kullanıcı adı seçin.');
        return;
      }

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUser, password: cleanPass }),
        });
        const data = await res.json();
        if (!res.ok && data.error) {
          setAuthError(data.error);
          return;
        }
      } catch {
        const exists = registeredStudents.some(
          (s) => s.username.toLowerCase() === cleanUser.toLowerCase()
        );
        if (exists) {
          setAuthError('Bu kullanıcı adı zaten kayıtlı. Öğrenci Girişi sekmesinden giriş yapabilirsiniz.');
          return;
        }
      }

      const newStu: StudentAccount = {
        id: `stu-${Date.now()}`,
        username: cleanUser,
        password: cleanPass,
        registeredAt: new Date().toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      };
      setRegisteredStudents((prev) => {
        const filtered = prev.filter((s) => s.username.toLowerCase() !== cleanUser.toLowerCase());
        return [...filtered, newStu];
      });

      const userObj: AuthenticatedUser = {
        role: 'student',
        username: cleanUser,
        displayName: cleanUser,
      };
      setCurrentUser(userObj);
      sessionStorage.setItem('murat_active_user_v4', JSON.stringify(userObj));
      setAuthUsername('');
      setAuthPassword('');
      return;
    }

    if (authTab === 'student-login') {
      let loggedIn = false;
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: 'student', username: cleanUser, password: cleanPass }),
        });
        if (res.ok) {
          loggedIn = true;
        }
      } catch {
        // Fallback below
      }

      if (!loggedIn) {
        const localMatch = registeredStudents.find(
          (s) => s.username.toLowerCase() === cleanUser.toLowerCase() && s.password === cleanPass
        );
        if (localMatch) {
          loggedIn = true;
        }
      }

      if (!loggedIn) {
        setAuthError(
          'Öğrenci kaydı bulunamadı veya şifre hatalı. Lütfen önce "Öğrenci Kayıt Ol" sekmesinden kayıt olun.'
        );
        return;
      }

      const userObj: AuthenticatedUser = {
        role: 'student',
        username: cleanUser,
        displayName: cleanUser,
      };
      setCurrentUser(userObj);
      sessionStorage.setItem('murat_active_user_v4', JSON.stringify(userObj));
      setAuthUsername('');
      setAuthPassword('');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('murat_active_user_v4');
    setSelectedLeftItem(null);
    setSelectedGradeItem(null);
  };

  // Lesson Timer Effect
  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handlePickRandomStudent = () => {
    const list = (attendanceByClass[pickerClassId] || []).filter((s) => s.status !== 'Yok');
    if (list.length === 0) return;
    const random = list[Math.floor(Math.random() * list.length)];
    setPickedStudent(random);
  };

  const generateNextMathQuestion = () => {
    const ops: ('+' | '-' | '×')[] = ['+', '-', '×'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = op === '×' ? Math.floor(Math.random() * 12) + 3 : Math.floor(Math.random() * 45) + 12;
    const b = op === '×' ? Math.floor(Math.random() * 11) + 2 : Math.floor(Math.random() * 30) + 5;
    setMathA(Math.max(a, b));
    setMathB(Math.min(a, b));
    setMathOp(op);
    setMathInput('');
  };

  const handleCheckMath = (e: React.FormEvent) => {
    e.preventDefault();
    const expected =
      mathOp === '+' ? mathA + mathB : mathOp === '-' ? mathA - mathB : mathA * mathB;
    if (parseInt(mathInput.trim(), 10) === expected) {
      setMathScore((s) => s + 25);
      setMathFeedback('Doğru! +25 Puan');
      generateNextMathQuestion();
    } else {
      setMathFeedback(`Tekrar Dene! (${mathA} ${mathOp} ${mathB})`);
    }
  };

  // Left Sidebar Item Click Handler
  const handleLeftItemClick = (catId: string, item: TeacherLinkItem) => {
    if (!isTeacher) {
      if (item.url) {
        const targetUrl = item.url.startsWith('http') ? item.url : `https://${item.url}`;
        window.open(targetUrl, '_blank', 'noopener,noreferrer');
      }
      return;
    }
    setSelectedLeftItem({ catId, item });
    setEditingLinkUrl(item.url || '');
    setPlanTermFilter('Tümü');
    setShowAddPlanRow(false);
  };

  const handleSaveLeftItemUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher || !selectedLeftItem) return;
    const trimmed = editingLinkUrl.trim();
    const nextCategories = leftCategories.map((cat) =>
      cat.id === selectedLeftItem.catId
        ? {
            ...cat,
            items: cat.items.map((it) =>
              it.id === selectedLeftItem.item.id
                ? { ...it, url: trimmed, updatedAt: 'Güncellendi' }
                : it
            ),
          }
        : cat
    );
    setLeftCategories(nextCategories);
    syncTeacherStateToServer({ leftCategories: nextCategories });
    setSelectedLeftItem((prev) =>
      prev ? { ...prev, item: { ...prev.item, url: trimmed } } : null
    );
  };

  const handleAddPlanRow = (e: React.FormEvent, planId: string) => {
    e.preventDefault();
    if (!isTeacher || !newPlanTopic.trim()) return;
    const created: AnnualPlanWeekRow = {
      id: `pr-${Date.now()}`,
      term: newPlanTerm,
      weeks: newPlanWeeks.trim() || 'Ek Hafta',
      month: newPlanMonth.trim() || 'Güncel Ay',
      hours: '5 Saat',
      themeOrUnit: newPlanTheme.trim() || 'Tema / Ünite',
      learningOutcomeCode: newPlanCode.trim() || 'MAT',
      topicAndOutcome: newPlanTopic.trim(),
      assessmentAndNotes: newPlanAssessment.trim() || 'Süreç Değerlendirme',
    };
    const nextPlans = {
      ...annualPlansById,
      [planId]: [...(annualPlansById[planId] || []), created],
    };
    setAnnualPlansById(nextPlans);
    syncTeacherStateToServer({ annualPlansById: nextPlans });
    setNewPlanWeeks('');
    setNewPlanMonth('');
    setNewPlanTheme('');
    setNewPlanCode('');
    setNewPlanTopic('');
    setNewPlanAssessment('');
    setShowAddPlanRow(false);
  };

  const handleAddLeftLink = (e: React.FormEvent, catId: string) => {
    e.preventDefault();
    if (!isTeacher || !newLinkTitle.trim()) return;
    const newItem: TeacherLinkItem = {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim(),
      subtitle: newLinkSubtitle.trim() || 'Murat Öğretmen Paylaşımı',
      url: newLinkUrl.trim(),
      type:
        catId === 'yillik-planlar'
          ? 'plan'
          : catId === 'sinif-yoklama'
          ? 'attendance'
          : 'portal',
      grade: 'Genel',
      updatedAt: 'Yeni',
      sharedWithStudents: catId === 'notlarim-linkler',
    };
    const nextCategories = leftCategories.map((cat) =>
      cat.id === catId ? { ...cat, items: [...cat.items, newItem] } : cat
    );
    setLeftCategories(nextCategories);
    syncTeacherStateToServer({ leftCategories: nextCategories });
    setNewLinkTitle('');
    setNewLinkSubtitle('');
    setNewLinkUrl('');
    setAddingToCatId(null);
  };

  const handleDeleteLeftLink = (catId: string, itemId: string) => {
    if (!isTeacher) return;
    const nextCategories = leftCategories.map((cat) =>
      cat.id === catId
        ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
        : cat
    );
    setLeftCategories(nextCategories);
    syncTeacherStateToServer({ leftCategories: nextCategories });
    setSelectedLeftItem(null);
  };

  // Attendance Status Change (Teacher Only)
  const handleToggleStudentStatus = (
    classId: string,
    studentId: string,
    status: StudentAttendanceRecord['status']
  ) => {
    if (!isTeacher) return;
    const nextAttendance = {
      ...attendanceByClass,
      [classId]: (attendanceByClass[classId] || []).map((st) =>
        st.id === studentId ? { ...st, status } : st
      ),
    };
    setAttendanceByClass(nextAttendance);
    syncTeacherStateToServer({ attendanceByClass: nextAttendance });
  };

  const handleAddStudentToClass = (e: React.FormEvent, classId: string) => {
    e.preventDefault();
    if (!isTeacher || !newStudentName.trim()) return;
    const created: StudentAttendanceRecord = {
      id: `st-${Date.now()}`,
      number: newStudentNumber.trim() || String(Math.floor(Math.random() * 400) + 100),
      name: newStudentName.trim(),
      status: 'Var',
    };
    const nextAttendance = {
      ...attendanceByClass,
      [classId]: [...(attendanceByClass[classId] || []), created],
    };
    setAttendanceByClass(nextAttendance);
    syncTeacherStateToServer({ attendanceByClass: nextAttendance });
    setNewStudentName('');
    setNewStudentNumber('');
  };

  // Save or Update Note (Teacher Only)
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher) return;
    if (!noteTitle.trim() && !noteContent.trim()) return;

    const nowStr = new Date().toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let nextNotes: TeacherNote[];
    if (editingNoteId) {
      nextNotes = notes.map((n) =>
        n.id === editingNoteId
          ? {
              ...n,
              title: noteTitle.trim() || 'Başlıksız Not',
              content: noteContent.trim(),
              url: noteUrl.trim(),
              category: noteCategory,
              pinned: notePinned,
              sharedWithStudents: noteShared,
            }
          : n
      );
    } else {
      const created: TeacherNote = {
        id: `note-${Date.now()}`,
        title: noteTitle.trim() || 'Hızlı Ders Notu',
        content: noteContent.trim(),
        url: noteUrl.trim(),
        category: noteCategory,
        createdAt: nowStr,
        pinned: notePinned,
        sharedWithStudents: noteShared,
      };
      nextNotes = [created, ...notes];
    }

    setNotes(nextNotes);
    syncTeacherStateToServer({ notes: nextNotes });
    setNoteTitle('');
    setNoteContent('');
    setNoteUrl('');
    setNoteCategory('Genel');
    setNotePinned(false);
    setNoteShared(true);
    setEditingNoteId(null);
    setShowNoteComposer(false);
  };

  const handleEditNote = (note: TeacherNote) => {
    if (!isTeacher) return;
    setEditingNoteId(note.id);
    setNoteTitle(note.title);
    setNoteContent(note.content);
    setNoteUrl(note.url || '');
    setNoteCategory(note.category);
    setNotePinned(note.pinned);
    setNoteShared(note.sharedWithStudents !== false);
    setShowNoteComposer(true);
  };

  const handleTogglePinNote = (id: string) => {
    if (!isTeacher) return;
    const nextNotes = notes.map((n) =>
      n.id === id ? { ...n, pinned: !n.pinned } : n
    );
    setNotes(nextNotes);
    syncTeacherStateToServer({ notes: nextNotes });
  };

  const handleDeleteNote = (id: string) => {
    if (!isTeacher) return;
    const nextNotes = notes.filter((n) => n.id !== id);
    setNotes(nextNotes);
    syncTeacherStateToServer({ notes: nextNotes });
  };

  // Add New Grade Content (5, 6, 7, 8) (Teacher Only)
  const handleAddGradeContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher || !newContentTitle.trim()) return;
    const item: GradeContentItem = {
      id: `gc-${Date.now()}`,
      grade: activeGrade,
      unitNumber: newContentUnit.trim() || 'Tema',
      title: newContentTitle.trim(),
      type: newContentType,
      weekRange: newContentWeek.trim() || 'Güncel Hafta',
      summary:
        newContentSummary.trim() ||
        `${activeGrade}. sınıf Maarif Modeli Matematik ders materyali ve etkinlik bağlantısı.`,
      url: newContentUrl.trim(),
      sourceLabel: 'Maarif Modeli Matematik',
    };
    const nextContents = [item, ...gradeContents];
    setGradeContents(nextContents);
    syncTeacherStateToServer({ gradeContents: nextContents });
    setNewContentTitle('');
    setNewContentSummary('');
    setNewContentUrl('');
    setShowAddGradeContent(false);
  };

  const handleSaveGradeItemUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher || !selectedGradeItem) return;
    const trimmed = editingGradeItemUrl.trim();
    const nextContents = gradeContents.map((item) =>
      item.id === selectedGradeItem.id ? { ...item, url: trimmed } : item
    );
    setGradeContents(nextContents);
    syncTeacherStateToServer({ gradeContents: nextContents });
    setSelectedGradeItem((prev) => (prev ? { ...prev, url: trimmed } : null));
  };

  const handleDeleteGradeItem = (id: string) => {
    if (!isTeacher) return;
    const nextContents = gradeContents.filter((item) => item.id !== id);
    setGradeContents(nextContents);
    syncTeacherStateToServer({ gradeContents: nextContents });
    setSelectedGradeItem(null);
  };

  // Add External Game Link (Teacher Only)
  const handleAddExternalGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTeacher || !newGameTitle.trim() || !newGameUrl.trim()) return;
    const created: ExternalGameLink = {
      id: `ext-${Date.now()}`,
      title: newGameTitle.trim(),
      category: newGameCategory.trim() || 'Matematik Oyunu',
      description: newGameDesc.trim() || 'Sınıf içi etkileşimli matematik oyun bağlantısı.',
      url: newGameUrl.trim().startsWith('http')
        ? newGameUrl.trim()
        : `https://${newGameUrl.trim()}`,
      recommendedGrade: newGameGrade,
    };
    const nextGames = [created, ...externalGames];
    setExternalGames(nextGames);
    syncTeacherStateToServer({ externalGames: nextGames });
    setNewGameTitle('');
    setNewGameCategory('');
    setNewGameDesc('');
    setNewGameUrl('');
    setShowAddGameLink(false);
  };

  // Filtered Notes (Students see notes where sharedWithStudents !== false)
  const visibleNotes = notes.filter((n) => isTeacher || n.sharedWithStudents !== false);
  const filteredNotes = visibleNotes
    .filter((n) => {
      const matchesCat =
        noteCategoryFilter === 'Tümü' || n.category === noteCategoryFilter;
      const matchesSearch =
        !noteSearch.trim() ||
        n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
        n.content.toLowerCase().includes(noteSearch.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  // Filtered Grade Contents for Right Sidebar
  const filteredGradeContents = gradeContents.filter((c) => {
    if (c.grade !== activeGrade) return false;
    if (gradeTypeFilter !== 'Tümü' && c.type !== gradeTypeFilter) return false;
    return true;
  });

  // Filtered Left Sidebar Categories (Students only see shared websites/resources, not attendance or teacher annual plans)
  const visibleLeftCategories = isTeacher
    ? leftCategories
    : leftCategories.filter((cat) => !cat.teacherOnly);

  // ============================================================================
  // AUTHENTICATION SCREEN (TEACHER LOGIN / STUDENT LOGIN / STUDENT REGISTER)
  // ============================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-between">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-8">
          <span className="text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
            Murat Öğretmen&apos;in Not Defteri
          </span>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline whitespace-nowrap shrink-0">
            5, 6, 7 ve 8. Sınıflar Türkiye Yüzyılı Maarif Modeli Matematik Platformu
          </span>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-1.5 text-center">
              <h1 className="font-display font-bold text-2xl text-slate-900">
                Platform Giriş Ekranı
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Öğretmen yönetimi veya öğrenci ders içerikleri için giriş yapın
              </p>
            </div>

            {/* Role & Action Segmented Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('teacher-login');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`py-2 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  authTab === 'teacher-login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Öğretmen Girişi
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('student-login');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`py-2 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  authTab === 'student-login'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Öğrenci Girişi
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('student-register');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`py-2 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  authTab === 'student-register'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Öğrenci Kayıt Ol
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-600 leading-relaxed">
                {authTab === 'teacher-login' && (
                  <span>
                    <strong className="text-slate-900">Öğretmen Modu:</strong> Yıllık planları,
                    sınıf yoklamalarını, matematik kaynaklarını ve öğrenci duyurularını
                    düzenlemek için öğretmen bilgilerinizle giriş yapın.
                  </span>
                )}
                {authTab === 'student-login' && (
                  <span>
                    <strong className="text-slate-900">Öğrenci Modu:</strong> Kayıt olduğunuz
                    kullanıcı adı ve şifrenizle giriş yaparak Murat Öğretmen&apos;in paylaştığı
                    tüm notlara, web sitelerine ve 5–8. sınıf matematik içeriklerine ulaşabilirsiniz.
                  </span>
                )}
                {authTab === 'student-register' && (
                  <span>
                    <strong className="text-slate-900">Yeni Öğrenci Kaydı:</strong> Sadece bir
                    kullanıcı adı ve şifre belirleyerek hemen kayıt olabilir ve içerikleri
                    görüntülemeye başlayabilirsiniz.
                  </span>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  Kullanıcı Adı
                </label>
                <input
                  type="text"
                  placeholder={
                    authTab === 'teacher-login'
                      ? 'Öğretmen kullanıcı adı'
                      : 'Öğrenci kullanıcı adınız'
                  }
                  value={authUsername}
                  onChange={(e) => setAuthUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0284C7]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-800">
                  Şifre
                </label>
                <input
                  type="password"
                  placeholder="Şifrenizi girin"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#0284C7]"
                  required
                />
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {authError}
                </div>
              )}

              {authSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium">
                  {authSuccess}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 text-sm font-medium text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {authTab === 'teacher-login' && (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Öğretmen Olarak Giriş Yap</span>
                  </>
                )}
                {authTab === 'student-login' && (
                  <>
                    <UserCheck className="w-4 h-4" />
                    <span>Öğrenci Olarak Giriş Yap</span>
                  </>
                )}
                {authTab === 'student-register' && (
                  <>
                    <GraduationCap className="w-4 h-4" />
                    <span>Kayıt Ol ve Sisteme Gir</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </main>

        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
          Murat Öğretmen&apos;in Not Defteri · Türkiye Yüzyılı Maarif Modeli Ortaokul Matematik Platformu
        </footer>
      </div>
    );
  }

  // ============================================================================
  // MAIN WORKSPACE (TEACHER FULL CONTROL vs STUDENT READ-ONLY VIEW)
  // ============================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4 Concise Nav Links) — Zone 3 (1 Primary Action) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        <a
          href="#ust"
          className="text-lg font-display font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          Murat Öğretmen&apos;in Not Defteri
        </a>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <a
            href="#sol-panel"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isTeacher ? 'Plan & Yoklama' : 'Paylaşılan Siteler'}
          </a>
          <a
            href="#egitsel-oyunlar"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Matematik Oyunları
          </a>
          <a
            href="#not-defterim"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            {isTeacher ? 'Not Defterim' : 'Öğretmen Notları'}
          </a>
          <a
            href="#sinif-icerikleri"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            5–8. Sınıf Matematik
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>
              {isTeacher ? 'Murat Öğretmen · Çıkış' : `${currentUser.username} (Öğrenci) · Çıkış`}
            </span>
          </button>
        </div>
      </header>

      {/* Main 3-Column Desktop Workspace */}
      <main
        id="ust"
        className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
      >
        {/* ============================================================
            SOL PANEL (LEFT SIDEBAR)
           ============================================================ */}
        <aside
          id="sol-panel"
          className="lg:col-span-3 space-y-4 lg:sticky lg:top-20"
        >
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="font-display font-semibold text-base text-slate-900">
                {isTeacher
                  ? 'Öğretmen Yönetim & Dosyalarım'
                  : 'Paylaşılan Web Siteleri & Kaynaklar'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isTeacher
                  ? 'Yıllık planlar, sınıf yoklama listeleri ve öğrencilerle paylaşılan siteler'
                  : 'Murat Öğretmen tarafından paylaşılan matematik siteleri ve çalışma klasörleri'}
              </p>
            </div>

            <div className="space-y-3">
              {visibleLeftCategories.map((category) => {
                const isOpen = expandedCatIds[category.id] ?? true;
                const itemsToShow = isTeacher
                  ? category.items
                  : category.items.filter((i) => i.sharedWithStudents !== false);

                return (
                  <div
                    key={category.id}
                    className="border border-slate-200/90 rounded-lg overflow-hidden bg-slate-50/50"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCatIds((prev) => ({
                          ...prev,
                          [category.id]: !isOpen,
                        }))
                      }
                      className="w-full px-3.5 py-2.5 bg-white hover:bg-slate-50 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {category.id === 'yillik-planlar' && (
                          <BookOpen className="w-4 h-4 text-[#0284C7] shrink-0" />
                        )}
                        {category.id === 'sinif-yoklama' && (
                          <ClipboardCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {category.id === 'notlarim-linkler' && (
                          <Globe className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="font-display font-semibold text-xs sm:text-sm text-slate-900 truncate">
                          {category.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-mono text-slate-400 tabular-nums">
                          {itemsToShow.length}
                        </span>
                        {isOpen ? (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="divide-y divide-slate-200/70 border-t border-slate-200/80">
                        {itemsToShow.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-white hover:bg-slate-50/90 transition-colors group flex items-start justify-between gap-2"
                          >
                            <button
                              type="button"
                              onClick={() => handleLeftItemClick(category.id, item)}
                              className="text-left flex-1 min-w-0 cursor-pointer"
                            >
                              <div className="text-xs font-medium text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug">
                                {item.title}
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 truncate">
                                <span>{item.subtitle}</span>
                                <span aria-hidden="true">·</span>
                                <span>
                                  {item.type === 'plan'
                                    ? 'Yıllık Planı Aç'
                                    : item.type === 'attendance'
                                    ? 'Yoklamayı Aç'
                                    : item.url
                                    ? 'Bağlantıyı Aç'
                                    : 'İçerik / Link Ata'}
                                </span>
                              </div>
                            </button>

                            {item.type === 'plan' ? (
                              <button
                                type="button"
                                onClick={() => handleLeftItemClick(category.id, item)}
                                className="p-1.5 text-[#0284C7] hover:bg-sky-50 rounded-md transition-colors shrink-0 cursor-pointer"
                                title="36 Haftalık Planı Görüntüle"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                              </button>
                            ) : item.url && item.url.startsWith('http') ? (
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-slate-400 hover:text-[#0284C7] rounded-md hover:bg-sky-50 transition-colors shrink-0"
                                title="Yeni Sekmede Aç"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            ) : isTeacher ? (
                              <button
                                type="button"
                                onClick={() => handleLeftItemClick(category.id, item)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-md hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                                title="Aç / Bağlantı Ekle"
                              >
                                <Link2 className="w-3.5 h-3.5" />
                              </button>
                            ) : null}
                          </div>
                        ))}

                        {/* Teacher-Only: Add custom link or website to this category */}
                        {isTeacher && (
                          <div className="p-2.5 bg-slate-50/70">
                            {addingToCatId === category.id ? (
                              <form
                                onSubmit={(e) => handleAddLeftLink(e, category.id)}
                                className="space-y-2"
                              >
                                <input
                                  type="text"
                                  placeholder="Başlık (Örn: 6. Sınıf Çalışma Linki)"
                                  value={newLinkTitle}
                                  onChange={(e) => setNewLinkTitle(e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                                  required
                                />
                                <input
                                  type="text"
                                  placeholder="Açıklama (Örn: Öğrenciler İçin Web Sitesi)"
                                  value={newLinkSubtitle}
                                  onChange={(e) => setNewLinkSubtitle(e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                                />
                                <input
                                  type="text"
                                  placeholder="Web Sitesi URL (https://...)"
                                  value={newLinkUrl}
                                  onChange={(e) => setNewLinkUrl(e.target.value)}
                                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                                />
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setAddingToCatId(null)}
                                    className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                                  >
                                    İptal
                                  </button>
                                  <button
                                    type="submit"
                                    className="px-2.5 py-1 text-xs font-medium bg-[#0284C7] text-white rounded-md hover:bg-[#0369A1] cursor-pointer"
                                  >
                                    Ekle
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setAddingToCatId(category.id)}
                                className="w-full py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>
                                  {category.id === 'notlarim-linkler'
                                    ? 'Öğrencilere Yeni Web Sitesi Ekle'
                                    : 'Yeni Seçenek / Link Ekle'}
                                </span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher-Only: Registered Students Summary Card */}
          {isTeacher && (
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#0284C7]" />
                  <h3 className="font-display font-semibold text-xs sm:text-sm text-slate-900">
                    Sisteme Kayıtlı Öğrenciler
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-600 tabular-nums">
                  {registeredStudents.length}
                </span>
              </div>
              {registeredStudents.length > 0 ? (
                <div className="divide-y divide-slate-100 max-h-36 overflow-y-auto text-xs">
                  {registeredStudents.map((stu) => (
                    <div
                      key={stu.id}
                      className="py-1.5 flex items-center justify-between text-slate-700"
                    >
                      <span className="font-medium">{stu.username}</span>
                      <span className="text-[11px] text-slate-400">{stu.registeredAt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Öğrenciler giriş ekranındaki &ldquo;Öğrenci Kayıt Ol&rdquo; sekmesinden kullanıcı adı
                  ve şifre belirleyerek kayıt olduklarında burada listelenir.
                </p>
              )}
            </div>
          )}
        </aside>

        {/* ============================================================
            ORTA ALAN (CENTER WORKSPACE): Görsel Sahne, Oyunlar & Notlar
           ============================================================ */}
        <section className="lg:col-span-6 space-y-6">
          {/* 1. Görsel Karşılama Sahnesi */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="relative h-48 sm:h-52 bg-[#0F172A] overflow-hidden flex flex-col justify-end p-6">
              <svg
                className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none"
                viewBox="0 0 800 320"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="studioGlow" x1="0" y1="0" x2="800" y2="320" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#0F172A" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#D97706" stopOpacity="0.35" />
                  </linearGradient>
                </defs>
                <rect width="800" height="320" fill="url(#studioGlow)" />
                <g stroke="#38BDF8" strokeOpacity="0.14" strokeWidth="1">
                  <line x1="0" y1="64" x2="800" y2="64" />
                  <line x1="0" y1="128" x2="800" y2="128" />
                  <line x1="0" y1="192" x2="800" y2="192" />
                  <line x1="0" y1="256" x2="800" y2="256" />
                  <line x1="160" y1="0" x2="160" y2="320" />
                  <line x1="320" y1="0" x2="320" y2="320" />
                  <line x1="480" y1="0" x2="480" y2="320" />
                  <line x1="640" y1="0" x2="640" y2="320" />
                </g>
                <g stroke="#E2E8F0" strokeOpacity="0.35" strokeWidth="1.5">
                  <rect x="520" y="48" width="210" height="150" rx="8" fill="#1E293B" fillOpacity="0.6" />
                  <line x1="625" y1="48" x2="625" y2="198" />
                  <line x1="540" y1="80" x2="605" y2="80" />
                  <line x1="540" y1="104" x2="605" y2="104" />
                  <line x1="540" y1="128" x2="590" y2="128" />
                  <line x1="645" y1="80" x2="710" y2="80" />
                  <line x1="645" y1="104" x2="710" y2="104" />
                  <circle cx="675" cy="150" r="22" stroke="#38BDF8" strokeOpacity="0.6" />
                </g>
              </svg>

              <div className="relative z-10 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-sky-300 font-medium">
                  <span>Türkiye Yüzyılı Maarif Modeli Matematik</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isTeacher
                      ? 'Öğretmen Yönetim Paneli (Tam Yetki)'
                      : `Öğrenci Görünümü (${currentUser.username} · Salt Okunur)`}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
                  {isTeacher
                    ? 'Hoş Geldiniz, Murat Öğretmen'
                    : `Hoş Geldin, ${currentUser.username}`}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                  {isTeacher
                    ? 'Maarif Modeli 5–8. sınıf matematik yıllık planlarını, yoklama listelerinizi, paylaştığınız web sitelerini ve ders notlarınızı buradan yönetebilirsiniz.'
                    : 'Murat Öğretmen tarafından paylaşılan ders notlarını, web sitelerini, 5–8. sınıf Maarif Modeli Matematik konularını ve eğitsel oyunları buradan takip edebilirsin.'}
                </p>
              </div>
            </div>

            {/* Classroom Quick Bar: Lesson Timer & (Teacher-Only) Student Random Picker */}
            <div className="p-4 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              <div className="flex items-center justify-between gap-3 pr-0 sm:pr-2">
                <div>
                  <span className="text-xs text-slate-500 block">
                    Matematik Çalışma &amp; Ders Sayacı (40 Dk)
                  </span>
                  <span className="text-xl font-mono font-semibold text-slate-900 tabular-nums">
                    {formatTimer(timerSeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTimerRunning((r) => !r)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {timerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{timerRunning ? 'Duraklat' : 'Başlat'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSeconds(2400);
                    }}
                    className="p-1.5 text-slate-500 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="40 Dakikaya Sıfırla"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {isTeacher ? (
                <div className="pt-3 sm:pt-0 sm:pl-4 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Söz Hakkı Kurası:</span>
                      <select
                        value={pickerClassId}
                        onChange={(e) => {
                          setPickerClassId(e.target.value);
                          setPickedStudent(null);
                        }}
                        className="text-xs font-medium text-slate-800 bg-slate-100 rounded px-1.5 py-0.5 focus:outline-none"
                      >
                        <option value="yoklama-5a">5/A Sınıfı</option>
                        <option value="yoklama-6b">6/B Sınıfı</option>
                        <option value="yoklama-7a">7/A Sınıfı</option>
                        <option value="yoklama-8a">8/A Sınıfı</option>
                      </select>
                    </div>
                    <p className="text-xs font-semibold text-slate-900 truncate mt-1">
                      {pickedStudent
                        ? `${pickedStudent.number} · ${pickedStudent.name}`
                        : 'Öğrenci seçmek için kuraya basın'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePickRandomStudent}
                    className="px-3 py-1.5 text-xs font-medium text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    <span>Kura Çek</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 sm:pt-0 sm:pl-4 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-xs text-slate-500 block">
                      Türkiye Yüzyılı Maarif Modeli Matematik
                    </span>
                    <span className="text-xs font-semibold text-slate-900">
                      5, 6, 7 ve 8. Sınıf Konu &amp; Çalışma Merkezim
                    </span>
                  </div>
                  <a
                    href="#sinif-icerikleri"
                    className="px-3 py-1.5 text-xs font-medium text-[#0284C7] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    Konulara Git
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* 2. Murat Öğretmen'in Not Defteri & Paylaşılan Duyurular */}
          <div
            id="not-defterim"
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
              <div>
                <h2 className="font-display font-semibold text-lg text-slate-900">
                  {isTeacher
                    ? "Murat Öğretmen'in Not Defteri (Paylaşılan Notlar & Siteler)"
                    : "Murat Öğretmen'in Paylaştığı Notlar & Duyurular"}
                </h2>
                <p className="text-xs text-slate-500">
                  {isTeacher
                    ? 'Eklediğiniz notlar ve web sitesi bağlantıları sisteme giriş yapan tüm öğrencilerin ekranında görünür'
                    : 'Öğretmeninizin paylaştığı güncel ders notları, ödev duyuruları ve faydalı web bağlantıları'}
                </p>
              </div>
              {isTeacher && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingNoteId(null);
                    setNoteTitle('');
                    setNoteContent('');
                    setNoteUrl('');
                    setNoteCategory('Genel');
                    setNotePinned(false);
                    setNoteShared(true);
                    setShowNoteComposer((prev) => !prev);
                  }}
                  className="px-3.5 py-2 text-xs font-medium bg-[#0284C7] text-white hover:bg-[#0369A1] rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNoteComposer ? 'Formu Kapat' : 'Yeni Not / Site Paylaş'}</span>
                </button>
              )}
            </div>

            {/* Teacher-Only Note Composer Form */}
            {isTeacher && showNoteComposer && (
              <form
                onSubmit={handleSaveNote}
                className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    {editingNoteId ? 'Notu Düzenle' : 'Yeni Not veya Web Sitesi Paylaşımı'}
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={noteCategory}
                      onChange={(e) =>
                        setNoteCategory(e.target.value as TeacherNote['category'])
                      }
                      className="text-xs bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-slate-700"
                    >
                      <option value="Genel">Genel Duyuru</option>
                      <option value="5. Sınıf">5. Sınıf</option>
                      <option value="6. Sınıf">6. Sınıf</option>
                      <option value="7. Sınıf">7. Sınıf</option>
                      <option value="8. Sınıf">8. Sınıf</option>
                      <option value="Toplantı & İdare">Toplantı &amp; İdare</option>
                    </select>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notePinned}
                        onChange={(e) => setNotePinned(e.target.checked)}
                      />
                      <span>Üste Sabitle</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={noteShared}
                        onChange={(e) => setNoteShared(e.target.checked)}
                      />
                      <span>Öğrencilerle Paylaş</span>
                    </label>
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Not başlığı (Örn: 6. Sınıf Çarpanlar ve Katlar Ödevi)..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                  required
                />

                <textarea
                  rows={3}
                  placeholder="Öğrencilerin göreceği not veya açıklamayı buraya yazın..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                  required
                />

                <input
                  type="text"
                  placeholder="İsteğe bağlı web sitesi bağlantısı (https://...)"
                  value={noteUrl}
                  onChange={(e) => setNoteUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                />

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNoteComposer(false);
                      setEditingNoteId(null);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    {editingNoteId ? 'Değişiklikleri Kaydet' : 'Kaydet ve Paylaş'}
                  </button>
                </div>
              </form>
            )}

            {/* Search & Category Filter Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
                {[
                  'Tümü',
                  'Genel',
                  '5. Sınıf',
                  '6. Sınıf',
                  '7. Sınıf',
                  '8. Sınıf',
                  ...(isTeacher ? ['Toplantı & İdare'] : []),
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNoteCategoryFilter(cat)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      noteCategoryFilter === cat
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Notlarda ara..."
                  value={noteSearch}
                  onChange={(e) => setNoteSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white focus:border-[#0284C7]"
                />
              </div>
            </div>

            {/* Notes List */}
            {filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {filteredNotes.map((note) => (
                  <article
                    key={note.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      note.pinned
                        ? 'bg-amber-50/35 border-amber-200/90'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{note.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{note.createdAt}</span>
                          {note.pinned && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-amber-700 font-medium">Önemli</span>
                            </>
                          )}
                          {isTeacher && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-slate-500">
                                {note.sharedWithStudents !== false
                                  ? 'Öğrencilere Açık'
                                  : 'Yalnızca Öğretmen'}
                              </span>
                            </>
                          )}
                        </div>
                        <h3 className="font-display font-semibold text-sm sm:text-base text-slate-900">
                          {note.title}
                        </h3>
                      </div>

                      {isTeacher && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleTogglePinNote(note.id)}
                            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                              note.pinned
                                ? 'text-amber-600 bg-amber-100/60'
                                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                            title={note.pinned ? 'Sabitlemeyi Kaldır' : 'Üste Sabitle'}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleEditNote(note)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                            title="Notu Düzenle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Notu Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 mt-2 leading-relaxed whitespace-pre-line">
                      {note.content}
                    </p>

                    {note.url && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={
                            note.url.startsWith('http') ? note.url : `https://${note.url}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0284C7] hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Paylaşılan Bağlantıyı Aç ({note.url})</span>
                        </a>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Bu filtreye uygun not bulunamadı.
                </p>
              </div>
            )}
          </div>

          {/* 3. Eğitsel Matematik Oyunları & Örnek Oyun Bağlantıları */}
          <div id="egitsel-oyunlar" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-semibold text-lg text-slate-900">
                  Matematik Oyunları &amp; Sınıf Yarışmaları
                </h2>
                <p className="text-xs text-slate-500">
                  Bilgi Düellosu, Mini Tetris, Hızlı İşlem ve örnek oyun bağlantıları
                </p>
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                <button
                  type="button"
                  onClick={() => setActiveGameTab('duello')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeGameTab === 'duello'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bilgi Düellosu
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGameTab('tetris')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeGameTab === 'tetris'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mini Tetris
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGameTab('zihin')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeGameTab === 'zihin'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Hızlı İşlem
                </button>
              </div>
            </div>

            {activeGameTab === 'duello' && (
              <BilgiDuellosuGame
                questions={duelQuestions}
                isTeacher={isTeacher}
                onAddQuestion={(q) => {
                  const nextQuestions = [q, ...duelQuestions];
                  setDuelQuestions(nextQuestions);
                  syncTeacherStateToServer({ duelQuestions: nextQuestions });
                }}
              />
            )}

            {activeGameTab === 'tetris' && <MiniTetrisGame />}

            {activeGameTab === 'zihin' && (
              <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-display font-semibold text-base text-slate-900">
                      Hızlı Zihin &amp; Dört İşlem Düellosu (5–8. Sınıf Matematik)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Derse ısınma için hızlı zihinden işlem pratiği
                    </p>
                  </div>
                  <div className="text-xs font-mono font-semibold text-[#0284C7] tabular-nums">
                    Toplam Puan: {mathScore}
                  </div>
                </div>

                <form
                  onSubmit={handleCheckMath}
                  className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-50 border border-slate-200/80 rounded-xl"
                >
                  <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums px-4 py-2 bg-white border border-slate-200 rounded-lg">
                    {mathA} {mathOp} {mathB} = ?
                  </div>
                  <input
                    type="number"
                    placeholder="Cevabınız..."
                    value={mathInput}
                    onChange={(e) => setMathInput(e.target.value)}
                    className="w-full sm:w-40 px-3.5 py-2.5 text-sm font-mono bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2.5 text-xs font-medium bg-[#0284C7] text-white hover:bg-[#0369A1] rounded-lg transition-colors cursor-pointer"
                  >
                    Kontrol Et
                  </button>
                  <button
                    type="button"
                    onClick={generateNextMathQuestion}
                    className="w-full sm:w-auto px-3 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 bg-white rounded-lg transition-colors cursor-pointer"
                  >
                    Soruyu Değiştir
                  </button>
                </form>
                {mathFeedback && (
                  <p className="text-xs font-medium text-slate-700">{mathFeedback}</p>
                )}
              </div>
            )}

            {/* Örnek Oyun Bağlantıları */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-sm text-slate-900">
                    Örnek Oyun Bağlantıları &amp; İnteraktif Matematik Siteleri
                  </h3>
                  <p className="text-xs text-slate-500">
                    GeoGebra, Wordwall, Kahoot! ve PhET matematik simülasyonları
                  </p>
                </div>
                {isTeacher && (
                  <button
                    type="button"
                    onClick={() => setShowAddGameLink((s) => !s)}
                    className="px-3 py-1.5 text-xs font-medium text-[#0284C7] hover:bg-sky-50 border border-sky-200 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Oyun Linki Ekle</span>
                  </button>
                )}
              </div>

              {isTeacher && showAddGameLink && (
                <form
                  onSubmit={handleAddExternalGame}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-2.5"
                >
                  <input
                    type="text"
                    placeholder="Oyun Adı (Örn: 6. Sınıf Kesirler Oyunu)"
                    value={newGameTitle}
                    onChange={(e) => setNewGameTitle(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Kategori (Örn: Wordwall / Bulmaca)"
                    value={newGameCategory}
                    onChange={(e) => setNewGameCategory(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Oyun Bağlantısı (https://...)"
                    value={newGameUrl}
                    onChange={(e) => setNewGameUrl(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Sınıf Düzeyi (Örn: 5 ve 6. Sınıf)"
                    value={newGameGrade}
                    onChange={(e) => setNewGameGrade(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Kısa açıklama..."
                    value={newGameDesc}
                    onChange={(e) => setNewGameDesc(e.target.value)}
                    className="sm:col-span-2 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                  />
                  <div className="sm:col-span-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGameLink(false)}
                      className="px-3 py-1 text-xs text-slate-600 cursor-pointer"
                    >
                      Vazgeç
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-xs font-medium bg-[#0284C7] text-white rounded-md hover:bg-[#0369A1] cursor-pointer"
                    >
                      Bağlantıyı Kaydet
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {externalGames.map((game) => (
                  <a
                    key={game.id}
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-lg border border-slate-200 hover:border-[#0284C7] bg-slate-50/40 hover:bg-white transition-all group flex flex-col justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-[#0284C7] transition-colors">
                          {game.title}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284C7] shrink-0" />
                      </div>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>{game.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{game.recommendedGrade}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            SAĞ PANEL (RIGHT SIDEBAR): 5, 6, 7 ve 8. Sınıflar Maarif Modeli Matematik
           ============================================================ */}
        <aside
          id="sinif-icerikleri"
          className="lg:col-span-3 space-y-4 lg:sticky lg:top-20"
        >
          <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display font-semibold text-base text-slate-900">
                  5–8. Sınıf Matematik
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Türkiye Yüzyılı Maarif Modeli Matematik Kaynakları
                </p>
              </div>
              {isTeacher && (
                <button
                  type="button"
                  onClick={() => setShowAddGradeContent((s) => !s)}
                  className="p-2 text-[#0284C7] hover:bg-sky-50 border border-sky-200 rounded-lg transition-colors shrink-0 cursor-pointer"
                  title={`${activeGrade}. Sınıfa Yeni Matematik İçeriği Ekle`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Grade Selector Tabs: 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
              {(['5', '6', '7', '8'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActiveGrade(g)}
                  className={`py-2 text-xs font-display font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeGrade === g
                      ? 'bg-[#0284C7] text-white shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {g}. Sınıf
                </button>
              ))}
            </div>

            {/* Content Type Sub-filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {['Tümü', 'Konu Anlatımı', 'Çalışma Yaprağı', 'İnteraktif Etkinlik', 'Sınav & Deneme'].map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setGradeTypeFilter(t)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      gradeTypeFilter === t
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>

            {/* Teacher-Only: Add New Grade Content Form */}
            {isTeacher && showAddGradeContent && (
              <form
                onSubmit={handleAddGradeContent}
                className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2"
              >
                <div className="text-xs font-semibold text-slate-800">
                  {activeGrade}. Sınıf Matematik İçin Yeni İçerik Ekle
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Tema / Ünite (Örn: 2. Tema)"
                    value={newContentUnit}
                    onChange={(e) => setNewContentUnit(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                  />
                  <input
                    type="text"
                    placeholder="Hafta (Örn: 5-7. Hafta)"
                    value={newContentWeek}
                    onChange={(e) => setNewContentWeek(e.target.value)}
                    className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                  />
                </div>
                <select
                  value={newContentType}
                  onChange={(e) =>
                    setNewContentType(e.target.value as GradeContentItem['type'])
                  }
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                >
                  <option value="Konu Anlatımı">Konu Anlatımı</option>
                  <option value="Çalışma Yaprağı">Çalışma Yaprağı</option>
                  <option value="İnteraktif Etkinlik">İnteraktif Etkinlik</option>
                  <option value="Sınav & Deneme">Sınav &amp; Deneme</option>
                </select>
                <input
                  type="text"
                  placeholder="Matematik Konu / İçerik Başlığı..."
                  value={newContentTitle}
                  onChange={(e) => setNewContentTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                  required
                />
                <input
                  type="text"
                  placeholder="Kısa Açıklama..."
                  value={newContentSummary}
                  onChange={(e) => setNewContentSummary(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Materyal Linki (İsteğe bağlı https://...)"
                  value={newContentUrl}
                  onChange={(e) => setNewContentUrl(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowAddGradeContent(false)}
                    className="px-2.5 py-1 text-xs text-slate-600 cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-medium bg-[#0284C7] text-white rounded-md cursor-pointer"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            )}

            {/* Grade Curriculum Cards */}
            <div className="space-y-2.5">
              {filteredGradeContents.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedGradeItem(item);
                    setEditingGradeItemUrl(item.url || '');
                  }}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-[#0284C7] bg-white hover:bg-slate-50/70 transition-all cursor-pointer group space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span>
                      {item.unitNumber} · {item.type}
                    </span>
                    <span className="font-mono tabular-nums">{item.weekRange}</span>
                  </div>

                  <h3 className="font-display font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-[#0284C7] transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {item.sourceLabel || 'Maarif Modeli Matematik'} ·{' '}
                      {isTeacher
                        ? item.url
                          ? 'Bağlantı Hazır'
                          : 'Link Ekle / Düzenle'
                        : item.url
                        ? 'Kaynağı Aç'
                        : 'Detayı Gör'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284C7]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* ============================================================
          MODAL 1 (TEACHER ONLY): Sol Panel Öğesi (Yıllık Plan Tablosu / Yoklama Çizelgesi / Özel Bağlantı)
         ============================================================ */}
      {isTeacher && selectedLeftItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="text-xs text-slate-500">
                  {selectedLeftItem.item.subtitle} · {selectedLeftItem.item.updatedAt}
                </div>
                <h3 className="font-display font-bold text-lg sm:text-xl text-slate-900 mt-0.5">
                  {selectedLeftItem.item.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLeftItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Interactive 36-Week Annual Plan Table if type === 'plan' */}
            {selectedLeftItem.item.type === 'plan' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                    {(['Tümü', '1. Dönem', '2. Dönem'] as const).map((term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setPlanTermFilter(term)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          planTermFilter === term
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {term === 'Tümü' ? 'Tüm Yıl (36 Hafta)' : term}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddPlanRow((s) => !s)}
                    className="px-3 py-1.5 text-xs font-medium text-[#0284C7] hover:bg-sky-50 border border-sky-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plana Yeni Hafta / Kazanım Ekle</span>
                  </button>
                </div>

                {showAddPlanRow && (
                  <form
                    onSubmit={(e) => handleAddPlanRow(e, selectedLeftItem.item.id)}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                  >
                    <select
                      value={newPlanTerm}
                      onChange={(e) =>
                        setNewPlanTerm(e.target.value as '1. Dönem' | '2. Dönem')
                      }
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                    >
                      <option value="1. Dönem">1. Dönem</option>
                      <option value="2. Dönem">2. Dönem</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Hafta (Örn: 11–13. Hafta)"
                      value={newPlanWeeks}
                      onChange={(e) => setNewPlanWeeks(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Ay (Örn: Kasım)"
                      value={newPlanMonth}
                      onChange={(e) => setNewPlanMonth(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Tema / Ünite Adı"
                      value={newPlanTheme}
                      onChange={(e) => setNewPlanTheme(e.target.value)}
                      className="sm:col-span-2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Kazanım / Çıktı Kodu (MAT.5.1.2)"
                      value={newPlanCode}
                      onChange={(e) => setNewPlanCode(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                    />
                    <input
                      type="text"
                      placeholder="Konu ve Öğrenme Çıktısı Açıklaması..."
                      value={newPlanTopic}
                      onChange={(e) => setNewPlanTopic(e.target.value)}
                      className="sm:col-span-2 px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Ölçme Değerlendirme / Belirli Günler"
                      value={newPlanAssessment}
                      onChange={(e) => setNewPlanAssessment(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                    />
                    <div className="sm:col-span-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddPlanRow(false)}
                        className="px-3 py-1 text-xs text-slate-600 cursor-pointer"
                      >
                        Vazgeç
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 text-xs font-medium bg-[#0284C7] text-white rounded-md cursor-pointer"
                      >
                        Plana Ekle
                      </button>
                    </div>
                  </form>
                )}

                <div className="border border-slate-200 rounded-xl overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[680px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                        <th className="py-2.5 px-3 whitespace-nowrap">Dönem / Hafta</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">Ay &amp; Süre</th>
                        <th className="py-2.5 px-3">Tema / Ünite &amp; Kod</th>
                        <th className="py-2.5 px-3">Öğrenme Çıktısı / Kazanım ve Konular</th>
                        <th className="py-2.5 px-3">Ölçme &amp; Değerlendirme</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70 text-xs">
                      {(annualPlansById[selectedLeftItem.item.id] || [])
                        .filter(
                          (row) =>
                            planTermFilter === 'Tümü' || row.term === planTermFilter
                        )
                        .map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 align-top">
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="font-semibold text-slate-900">{row.weeks}</div>
                              <div className="text-[11px] text-slate-500">{row.term}</div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="text-slate-800 font-medium">{row.month}</div>
                              <div className="text-[11px] font-mono tabular-nums text-slate-500">
                                {row.hours}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900">
                                {row.themeOrUnit}
                              </div>
                              <div className="text-[11px] font-mono text-[#0284C7] mt-0.5">
                                {row.learningOutcomeCode}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-slate-700 leading-relaxed max-w-md">
                              {row.topicAndOutcome}
                            </td>
                            <td className="py-3 px-3 text-[11px] text-slate-600 leading-relaxed">
                              {row.assessmentAndNotes}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* External Link Assignment Box */}
            <form
              onSubmit={handleSaveLeftItemUrl}
              className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
            >
              <label className="block text-xs font-semibold text-slate-800">
                Harici Doküman / MEB Programı / Google Drive Bağlantısı
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="https://... bağlantınızı buraya yapıştırın"
                  value={editingLinkUrl}
                  onChange={(e) => setEditingLinkUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium bg-[#0284C7] text-white hover:bg-[#0369A1] rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Linki Kaydet
                </button>
                {selectedLeftItem.item.url && (
                  <a
                    href={
                      selectedLeftItem.item.url.startsWith('http')
                        ? selectedLeftItem.item.url
                        : `https://${selectedLeftItem.item.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
                  >
                    <span>Harici Linki Aç</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </form>

            {/* Interactive Attendance Table if type === 'attendance' */}
            {selectedLeftItem.item.type === 'attendance' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-semibold text-sm text-slate-900">
                    Canlı Sınıf Yoklama Çizelgesi
                  </h4>
                  <div className="text-xs font-mono tabular-nums text-slate-600">
                    Var:{' '}
                    {
                      (attendanceByClass[selectedLeftItem.item.id] || []).filter(
                        (s) => s.status === 'Var'
                      ).length
                    }{' '}
                    · Yok:{' '}
                    {
                      (attendanceByClass[selectedLeftItem.item.id] || []).filter(
                        (s) => s.status === 'Yok'
                      ).length
                    }{' '}
                    · İzinli:{' '}
                    {
                      (attendanceByClass[selectedLeftItem.item.id] || []).filter(
                        (s) => s.status === 'İzinli'
                      ).length
                    }
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                        <th className="py-2.5 px-3">Okul No</th>
                        <th className="py-2.5 px-3">Öğrenci Adı Soyadı</th>
                        <th className="py-2.5 px-3 text-right">Devam Durumu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/70 text-xs">
                      {(attendanceByClass[selectedLeftItem.item.id] || []).map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600">
                            {st.number}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-900">
                            {st.name}
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="inline-flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                              {(['Var', 'Yok', 'İzinli'] as const).map((statusOption) => (
                                <button
                                  key={statusOption}
                                  type="button"
                                  onClick={() =>
                                    handleToggleStudentStatus(
                                      selectedLeftItem.item.id,
                                      st.id,
                                      statusOption
                                    )
                                  }
                                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                                    st.status === statusOption
                                      ? statusOption === 'Var'
                                        ? 'bg-emerald-600 text-white'
                                        : statusOption === 'Yok'
                                        ? 'bg-rose-600 text-white'
                                        : 'bg-amber-600 text-white'
                                      : 'text-slate-600 hover:text-slate-900'
                                  }`}
                                >
                                  {statusOption}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <form
                  onSubmit={(e) => handleAddStudentToClass(e, selectedLeftItem.item.id)}
                  className="flex flex-col sm:flex-row gap-2 pt-1"
                >
                  <input
                    type="text"
                    placeholder="Okul No (Örn: 162)"
                    value={newStudentNumber}
                    onChange={(e) => setNewStudentNumber(e.target.value)}
                    className="sm:w-32 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Yeni Öğrenci Adı Soyadı..."
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    required
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                  >
                    Listeye Öğrenci Ekle
                  </button>
                </form>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  handleDeleteLeftLink(selectedLeftItem.catId, selectedLeftItem.item.id)
                }
                className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Bu Seçeneği Sil</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedLeftItem(null)}
                className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: Sağ Panel 5, 6, 7, 8. Sınıf Matematik İçerik Detayı
         ============================================================ */}
      {selectedGradeItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="text-xs text-slate-500">
                  {selectedGradeItem.grade}. Sınıf Matematik · {selectedGradeItem.unitNumber} ·{' '}
                  {selectedGradeItem.weekRange}
                </div>
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 mt-0.5">
                  {selectedGradeItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGradeItem(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedGradeItem.summary}
            </p>

            {isTeacher && (
              <form
                onSubmit={handleSaveGradeItemUrl}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2"
              >
                <label className="block text-xs font-semibold text-slate-800">
                  Materyal / Sunum / PDF Bağlantısı (Öğretmen Düzenleme Alanı)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="https://... ders içeriği linkini yapıştırın"
                    value={editingGradeItemUrl}
                    onChange={(e) => setEditingGradeItemUrl(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 text-xs font-medium bg-[#0284C7] text-white rounded-lg hover:bg-[#0369A1] cursor-pointer"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                {selectedGradeItem.url ? (
                  <a
                    href={
                      selectedGradeItem.url.startsWith('http')
                        ? selectedGradeItem.url
                        : `https://${selectedGradeItem.url}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 text-xs font-medium bg-[#0284C7] text-white hover:bg-[#0369A1] rounded-lg flex items-center gap-1.5"
                  >
                    <span>İçerik Bağlantısını Aç</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-500">
                    Henüz harici link atanmadı.
                  </span>
                )}

                {isTeacher && (
                  <button
                    type="button"
                    onClick={() => handleDeleteGradeItem(selectedGradeItem.id)}
                    className="px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                  >
                    Sil
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedGradeItem(null)}
                className="px-4 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quiet Editorial Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500">
        Murat Öğretmen&apos;in Not Defteri · Türkiye Yüzyılı Maarif Modeli 5, 6, 7 ve 8. Sınıflar Matematik Platformu
      </footer>
    </div>
  );
}
