import React, { useState } from 'react';
import { DuelQuestion, GradeLevel } from '../data/initialData';
import { Award, CheckCircle2, XCircle, Plus, RotateCcw, ArrowRight } from 'lucide-react';

interface BilgiDuellosuGameProps {
  questions: DuelQuestion[];
  onAddQuestion?: (q: DuelQuestion) => void;
  isTeacher?: boolean;
}

export const BilgiDuellosuGame: React.FC<BilgiDuellosuGameProps> = ({
  questions,
  onAddQuestion,
  isTeacher = false,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<'Tümü' | GradeLevel>('Tümü');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTeam, setActiveTeam] = useState<'A' | 'B'>('A');
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // New question state
  const [newGrade, setNewGrade] = useState<GradeLevel>('5');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctIdx, setCorrectIdx] = useState(0);

  const filteredQuestions =
    selectedGrade === 'Tümü'
      ? questions
      : questions.filter((q) => q.grade === selectedGrade);

  const currentQuestion = filteredQuestions[currentIndex] || filteredQuestions[0];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || !currentQuestion) return;
    setSelectedOption(idx);
    if (idx === currentQuestion.correctIndex) {
      if (activeTeam === 'A') setScoreA((s) => s + currentQuestion.points);
      else setScoreB((s) => s + currentQuestion.points);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setActiveTeam((prev) => (prev === 'A' ? 'B' : 'A'));
    setCurrentIndex((prev) =>
      filteredQuestions.length > 0 ? (prev + 1) % filteredQuestions.length : 0
    );
  };

  const handleResetScores = () => {
    setScoreA(0);
    setScoreB(0);
    setSelectedOption(null);
    setCurrentIndex(0);
    setActiveTeam('A');
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddQuestion || !newQuestionText.trim() || !opt0.trim() || !opt1.trim()) return;
    const created: DuelQuestion = {
      id: `custom-${Date.now()}`,
      grade: newGrade,
      question: newQuestionText.trim(),
      options: [
        opt0.trim(),
        opt1.trim(),
        opt2.trim() || 'Diğer Seçenek',
        opt3.trim() || 'Hiçbiri',
      ],
      correctIndex: correctIdx,
      points: 150,
    };
    onAddQuestion(created);
    setNewQuestionText('');
    setOpt0('');
    setOpt1('');
    setOpt2('');
    setOpt3('');
    setShowAddForm(false);
  };

  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h4 className="font-display font-semibold text-slate-900 text-base">
            Matematik Bilgi Düellosu (5, 6, 7 ve 8. Sınıflar)
          </h4>
          <p className="text-xs text-slate-500">
            Türkiye Yüzyılı Maarif Modeli Matematik soruları ile canlı düello
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(['Tümü', '5', '6', '7', '8'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setSelectedGrade(g);
                  setCurrentIndex(0);
                  setSelectedOption(null);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedGrade === g
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g === 'Tümü' ? 'Tümü' : `${g}. Sınıf`}
              </button>
            ))}
          </div>

          {isTeacher && onAddQuestion && (
            <button
              type="button"
              onClick={() => setShowAddForm((s) => !s)}
              className="px-2.5 py-1.5 text-xs font-medium text-[#0284C7] hover:bg-sky-50 border border-sky-200 rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Soru Ekle
            </button>
          )}
        </div>
      </div>

      {/* Add Custom Question Form (Teacher Only) */}
      {isTeacher && showAddForm && (
        <form
          onSubmit={handleCreateQuestion}
          className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">
              Düelloya Yeni Matematik Sorusu Ekle
            </span>
            <select
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value as GradeLevel)}
              className="text-xs bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-700"
            >
              <option value="5">5. Sınıf</option>
              <option value="6">6. Sınıf</option>
              <option value="7">7. Sınıf</option>
              <option value="8">8. Sınıf</option>
            </select>
          </div>
          <input
            type="text"
            placeholder="Soru metnini yazın..."
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0284C7]"
            required
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'A Şıkkı', val: opt0, set: setOpt0, idx: 0 },
              { label: 'B Şıkkı', val: opt1, set: setOpt1, idx: 1 },
              { label: 'C Şıkkı', val: opt2, set: setOpt2, idx: 2 },
              { label: 'D Şıkkı', val: opt3, set: setOpt3, idx: 3 },
            ].map((item) => (
              <div key={item.idx} className="flex items-center gap-1.5">
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctIdx === item.idx}
                  onChange={() => setCorrectIdx(item.idx)}
                  title="Doğru cevabı işaretle"
                />
                <input
                  type="text"
                  placeholder={`${item.label} (Doğruysa seçin)`}
                  value={item.val}
                  onChange={(e) => item.set(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                  required={item.idx < 2}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium bg-[#0284C7] text-white rounded-lg hover:bg-[#0369A1] cursor-pointer"
            >
              Soruyu Kaydet
            </button>
          </div>
        </form>
      )}

      {/* Team Scoreboard */}
      <div className="grid grid-cols-2 gap-3">
        <div
          onClick={() => setActiveTeam('A')}
          className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
            activeTeam === 'A'
              ? 'bg-sky-50/70 border-[#0284C7] text-slate-900'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div>
            <span className="text-xs font-medium block">
              A Grubu {activeTeam === 'A' ? '· Sıra Sizde' : ''}
            </span>
            <span className="text-lg font-mono font-semibold tabular-nums text-slate-900">
              {scoreA} Puan
            </span>
          </div>
          <Award className={`w-5 h-5 ${activeTeam === 'A' ? 'text-[#0284C7]' : 'text-slate-400'}`} />
        </div>

        <div
          onClick={() => setActiveTeam('B')}
          className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between ${
            activeTeam === 'B'
              ? 'bg-amber-50/70 border-amber-600 text-slate-900'
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}
        >
          <div>
            <span className="text-xs font-medium block">
              B Grubu {activeTeam === 'B' ? '· Sıra Sizde' : ''}
            </span>
            <span className="text-lg font-mono font-semibold tabular-nums text-slate-900">
              {scoreB} Puan
            </span>
          </div>
          <Award className={`w-5 h-5 ${activeTeam === 'B' ? 'text-amber-600' : 'text-slate-400'}`} />
        </div>
      </div>

      {/* Question Stage */}
      {currentQuestion ? (
        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              {currentQuestion.grade}. Sınıf Matematik · Soru {currentIndex + 1} /{' '}
              {filteredQuestions.length}
            </span>
            <span className="font-mono tabular-nums font-medium text-slate-700">
              Değer: {currentQuestion.points} Puan
            </span>
          </div>

          <p className="text-sm font-medium text-slate-900 leading-relaxed">
            {currentQuestion.question}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;
              let btnStyle =
                'bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50/80';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-medium';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-50 border-rose-600 text-rose-950';
                } else {
                  btnStyle = 'bg-white border-slate-200 text-slate-400 opacity-75';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  disabled={selectedOption !== null}
                  className={`p-3 text-left text-xs rounded-lg border transition-all flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                >
                  <span>
                    <strong className="font-mono mr-1.5">
                      {['A)', 'B)', 'C)', 'D)'][idx]}
                    </strong>
                    {opt}
                  </span>
                  {selectedOption !== null && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
            <button
              type="button"
              onClick={handleResetScores}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Skorları Sıfırla
            </button>

            <button
              type="button"
              onClick={handleNextQuestion}
              className="px-3.5 py-2 text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Sıradaki Soru ({activeTeam === 'A' ? 'B Grubuna Geç' : 'A Grubuna Geç'})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-slate-500">
          Bu sınıf düzeyi için henüz soru bulunmuyor.
        </div>
      )}
    </div>
  );
};
