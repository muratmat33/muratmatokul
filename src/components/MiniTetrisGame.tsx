import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, ArrowRight, ArrowDown, RotateCw, Trophy } from 'lucide-react';

const COLS = 10;
const ROWS = 18;
const BLOCK_SIZE = 22;

const SHAPES: { matrix: number[][]; color: string }[] = [
  { matrix: [[1, 1, 1, 1]], color: '#0284C7' }, // I - Sky Blue
  { matrix: [[1, 1], [1, 1]], color: '#D97706' }, // O - Amber
  { matrix: [[0, 1, 0], [1, 1, 1]], color: '#7C3AED' }, // T - Violet
  { matrix: [[1, 0, 0], [1, 1, 1]], color: '#2563EB' }, // J - Blue
  { matrix: [[0, 0, 1], [1, 1, 1]], color: '#EA580C' }, // L - Orange
  { matrix: [[0, 1, 1], [1, 1, 0]], color: '#059669' }, // S - Emerald
  { matrix: [[1, 1, 0], [0, 1, 1]], color: '#DC2626' }, // Z - Crimson
];

interface Piece {
  matrix: number[][];
  color: string;
  x: number;
  y: number;
}

export const MiniTetrisGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('burak_tetris_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [lines, setLines] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const boardRef = useRef<(string | null)[][]>(
    Array.from({ length: ROWS }, () => Array(COLS).fill(null))
  );
  const pieceRef = useRef<Piece | null>(null);

  const spawnPiece = useCallback((): Piece => {
    const template = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return {
      matrix: template.matrix.map((row) => [...row]),
      color: template.color,
      x: Math.floor((COLS - template.matrix[0].length) / 2),
      y: 0,
    };
  }, []);

  const collides = (board: (string | null)[][], piece: Piece, dx = 0, dy = 0, newMatrix?: number[][]) => {
    const m = newMatrix || piece.matrix;
    for (let r = 0; r < m.length; r++) {
      for (let c = 0; c < m[r].length; c++) {
        if (!m[r][c]) continue;
        const nx = piece.x + c + dx;
        const ny = piece.y + r + dy;
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
        if (ny >= 0 && board[ny][nx]) return true;
      }
    }
    return false;
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, ROWS * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(COLS * BLOCK_SIZE, y * BLOCK_SIZE);
      ctx.stroke();
    }

    // Draw locked blocks
    const board = boardRef.current;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = board[r][c];
        if (cell) {
          ctx.fillStyle = cell;
          ctx.fillRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
          ctx.fillStyle = 'rgba(255,255,255,0.22)';
          ctx.fillRect(c * BLOCK_SIZE + 1, r * BLOCK_SIZE + 1, BLOCK_SIZE - 2, 3);
        }
      }
    }

    // Draw active piece
    const p = pieceRef.current;
    if (p) {
      for (let r = 0; r < p.matrix.length; r++) {
        for (let c = 0; c < p.matrix[r].length; c++) {
          if (p.matrix[r][c]) {
            const px = (p.x + c) * BLOCK_SIZE;
            const py = (p.y + r) * BLOCK_SIZE;
            ctx.fillStyle = p.color;
            ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
            ctx.fillStyle = 'rgba(255,255,255,0.28)';
            ctx.fillRect(px + 1, py + 1, BLOCK_SIZE - 2, 3);
          }
        }
      }
    }
  }, []);

  const lockPiece = useCallback(() => {
    const p = pieceRef.current;
    if (!p) return;
    const board = boardRef.current;
    for (let r = 0; r < p.matrix.length; r++) {
      for (let c = 0; c < p.matrix[r].length; c++) {
        if (p.matrix[r][c]) {
          const by = p.y + r;
          const bx = p.x + c;
          if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
            board[by][bx] = p.color;
          }
        }
      }
    }

    // Clear completed rows
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every((cell) => cell !== null)) {
        board.splice(r, 1);
        board.unshift(Array(COLS).fill(null));
        cleared++;
        r++;
      }
    }

    if (cleared > 0) {
      const gained = cleared === 1 ? 100 : cleared === 2 ? 300 : cleared === 3 ? 500 : 800;
      setScore((prev) => {
        const next = prev + gained;
        setHighScore((hs) => {
          const updated = Math.max(hs, next);
          localStorage.setItem('burak_tetris_highscore', String(updated));
          return updated;
        });
        return next;
      });
      setLines((prev) => prev + cleared);
    }

    const nextPiece = spawnPiece();
    if (collides(board, nextPiece, 0, 0)) {
      setIsRunning(false);
      setGameOver(true);
    } else {
      pieceRef.current = nextPiece;
    }
    draw();
  }, [draw, spawnPiece]);

  const stepDown = useCallback(() => {
    const p = pieceRef.current;
    if (!p) return;
    if (!collides(boardRef.current, p, 0, 1)) {
      p.y += 1;
      draw();
    } else {
      lockPiece();
    }
  }, [draw, lockPiece]);

  const moveHorizontal = (dir: number) => {
    if (!isRunning || !pieceRef.current) return;
    if (!collides(boardRef.current, pieceRef.current, dir, 0)) {
      pieceRef.current.x += dir;
      draw();
    }
  };

  const rotatePiece = () => {
    if (!isRunning || !pieceRef.current) return;
    const p = pieceRef.current;
    const rotated = p.matrix[0].map((_, index) => p.matrix.map((row) => row[index]).reverse());
    if (!collides(boardRef.current, p, 0, 0, rotated)) {
      p.matrix = rotated;
      draw();
    }
  };

  const hardDrop = () => {
    if (!isRunning || !pieceRef.current) return;
    const p = pieceRef.current;
    while (!collides(boardRef.current, p, 0, 1)) {
      p.y += 1;
    }
    lockPiece();
  };

  const startNewGame = () => {
    boardRef.current = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    pieceRef.current = spawnPiece();
    setScore(0);
    setLines(0);
    setGameOver(false);
    setIsRunning(true);
    draw();
  };

  useEffect(() => {
    pieceRef.current = spawnPiece();
    draw();
  }, [draw, spawnPiece]);

  useEffect(() => {
    if (!isRunning) return;
    const speed = Math.max(200, 620 - Math.floor(lines / 5) * 45);
    const timer = setInterval(stepDown, speed);
    return () => clearInterval(timer);
  }, [isRunning, lines, stepDown]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isRunning) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === 'ArrowLeft') moveHorizontal(-1);
      else if (e.key === 'ArrowRight') moveHorizontal(1);
      else if (e.key === 'ArrowDown') stepDown();
      else if (e.key === 'ArrowUp') rotatePiece();
      else if (e.key === ' ') hardDrop();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-4 bg-white border border-slate-200 rounded-xl">
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#0F172A] shrink-0">
        <canvas
          ref={canvasRef}
          width={COLS * BLOCK_SIZE}
          height={ROWS * BLOCK_SIZE}
          className="block"
        />
        {(!isRunning || gameOver) && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
            <p className="text-white font-display font-semibold text-base mb-1">
              {gameOver ? 'Oyun Bitti!' : 'Teneffüs Mini Tetris'}
            </p>
            <p className="text-xs text-slate-300 mb-4 max-w-[180px]">
              {gameOver
                ? `Toplam Skorunuz: ${score}`
                : 'Ok tuşları veya aşağıdaki butonlarla blokları hizalayın.'}
            </p>
            <button
              onClick={gameOver ? startNewGame : () => setIsRunning(true)}
              className="px-4 py-2 text-xs font-medium text-white bg-[#0284C7] hover:bg-[#0369A1] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              {gameOver ? 'Tekrar Oyna' : score > 0 ? 'Devam Et' : 'Oyunu Başlat'}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between w-full space-y-4">
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-display font-semibold text-slate-900 text-base">Mini Tetris</h4>
              <p className="text-xs text-slate-500">Ders Arası Zihin Egzersizi</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-700 font-mono tabular-nums">
              <Trophy className="w-3.5 h-3.5" />
              <span>Rekor: {highScore}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <span className="text-xs text-slate-500 block">Anlık Skor</span>
              <span className="text-lg font-mono font-semibold text-slate-900 tabular-nums">
                {score}
              </span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
              <span className="text-xs text-slate-500 block">Tamamlanan Satır</span>
              <span className="text-lg font-mono font-semibold text-slate-900 tabular-nums">
                {lines}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive on-screen controls for smartboard / mouse */}
        <div className="space-y-2">
          <span className="text-xs text-slate-500 block">
            Akıllı Tahta & Klavye Kontrolleri
          </span>
          <div className="grid grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => moveHorizontal(-1)}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              title="Sola Kaydır (Sol Ok)"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={rotatePiece}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              title="Döndür (Yukarı Ok)"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => stepDown()}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              title="Hızlı İndir (Aşağı Ok)"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => moveHorizontal(1)}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
              title="Sağa Kaydır (Sağ Ok)"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <button
            type="button"
            onClick={hardDrop}
            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Tam İndir (Boşluk Tuşu)
          </button>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setIsRunning((r) => !r)}
            className="flex-1 py-2 px-3 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isRunning ? 'Duraklat' : 'Başlat'}
          </button>
          <button
            type="button"
            onClick={startNewGame}
            className="py-2 px-3 text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  );
};
