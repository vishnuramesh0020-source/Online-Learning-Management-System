import { useState } from 'react';
import Modal from '../../components/common/Modal';
import { HelpCircle, Clock, Award, BookOpen, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const QuizFormModal = ({ isOpen, onClose, initialData, onSave, courses = [] }) => {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        title: initialData.title || '',
        courseId: initialData.courseId || (courses[0]?.id ?? 1),
        courseTitle: initialData.courseTitle || courses[0]?.title || '',
        instructor: initialData.instructor || courses[0]?.instructor || '',
        durationMinutes: initialData.durationMinutes ?? 15,
        passingPercentage: initialData.passingPercentage ?? 70,
        questions: Array.isArray(initialData.questions) && initialData.questions.length > 0
          ? initialData.questions
          : [
              {
                id: 'q1',
                question: '',
                options: ['', '', '', ''],
                correctAnswerIndex: 0,
                explanation: ''
              }
            ]
      };
    }
    const defaultCourse = courses[0];
    return {
      title: '',
      courseId: defaultCourse ? defaultCourse.id : 1,
      courseTitle: defaultCourse ? defaultCourse.title : '',
      instructor: defaultCourse ? defaultCourse.instructor : '',
      durationMinutes: 15,
      passingPercentage: 70,
      questions: [
        {
          id: 'q1',
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: ''
        }
      ]
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCourseChange = (e) => {
    const cid = e.target.value;
    const matched = courses.find((c) => String(c.id) === String(cid));
    setFormData((prev) => ({
      ...prev,
      courseId: cid,
      courseTitle: matched ? matched.title : prev.courseTitle,
      instructor: matched ? matched.instructor : prev.instructor
    }));
  };

  // Add question
  const handleAddQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: `q_${Date.now()}`,
          question: '',
          options: ['', '', '', ''],
          correctAnswerIndex: 0,
          explanation: ''
        }
      ]
    }));
  };

  // Remove question
  const handleRemoveQuestion = (idx) => {
    if (formData.questions.length <= 1) {
      setError('A quiz must contain at least 1 question.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx)
    }));
  };

  // Update question field
  const handleUpdateQuestion = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, questions: updated };
    });
  };

  // Update option text
  const handleUpdateOption = (qIdx, optIdx, val) => {
    setFormData((prev) => {
      const updated = [...prev.questions];
      const newOpts = [...updated[qIdx].options];
      newOpts[optIdx] = val;
      updated[qIdx] = { ...updated[qIdx], options: newOpts };
      return { ...prev, questions: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Quiz title is required.');
      return;
    }

    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} text cannot be empty.`);
        return;
      }
      const filledOptions = q.options.filter((o) => o.trim().length > 0);
      if (filledOptions.length < 2) {
        setError(`Question ${i + 1} must have at least 2 non-empty options.`);
        return;
      }
    }

    setError('');
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      setError(err?.message || 'Failed to save quiz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Quiz & Assessment' : 'Create New Curriculum Quiz'}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        {/* Quiz Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
            Quiz Title <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <HelpCircle className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              placeholder="e.g. Next.js 15 Foundations & React 19 Hooks Evaluation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Associated Course & Duration & Passing Criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Associated Course <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={formData.courseId}
                onChange={handleCourseChange}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Duration (Minutes)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                min="5"
                max="180"
                value={formData.durationMinutes}
                onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Passing Mark (%)
            </label>
            <div className="relative">
              <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="number"
                min="50"
                max="100"
                value={formData.passingPercentage}
                onChange={(e) => setFormData({ ...formData, passingPercentage: e.target.value })}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* DYNAMIC QUESTION BUILDER */}
        <div className="space-y-4 pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <span>Quiz Questions List ({formData.questions.length})</span>
            </h4>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>

          <div className="space-y-5 max-h-[45vh] overflow-y-auto pr-1">
            {formData.questions.map((q, qIdx) => (
              <div
                key={q.id || qIdx}
                className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    Question {qIdx + 1}
                  </span>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIdx)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Remove question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Question Input */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder={`Enter Question ${qIdx + 1} prompt...`}
                    value={q.question}
                    onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-all"
                  />
                </div>

                {/* 4 Options Grid */}
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold text-slate-500">
                    Options (Select radio for correct answer):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = q.correctAnswerIndex === optIdx;
                      return (
                        <div
                          key={optIdx}
                          className={`flex items-center gap-2 p-2 rounded-xl border bg-white transition-all ${
                            isCorrect ? 'border-emerald-400 ring-2 ring-emerald-500/20' : 'border-slate-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`correct_${qIdx}`}
                            checked={isCorrect}
                            onChange={() => handleUpdateQuestion(qIdx, 'correctAnswerIndex', optIdx)}
                            className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                            title="Mark as correct answer"
                          />
                          <span className="text-xs font-bold text-slate-400 w-4">
                            {String.fromCharCode(65 + optIdx)}:
                          </span>
                          <input
                            type="text"
                            required
                            placeholder={`Option ${String.fromCharCode(65 + optIdx)} text...`}
                            value={opt}
                            onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                            className="w-full text-xs text-slate-800 focus:outline-none bg-transparent"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation */}
                <div>
                  <input
                    type="text"
                    placeholder="Explanation for the correct answer (optional)..."
                    value={q.explanation || ''}
                    onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                    className="w-full px-3 py-1.5 bg-white/70 border border-slate-200 rounded-xl text-[11px] text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Saving...' : isEdit ? 'Save Quiz Changes' : 'Create Quiz'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuizFormModal;
