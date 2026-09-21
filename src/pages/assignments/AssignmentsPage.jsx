import { useState, useMemo } from 'react';
import { useAuth } from '../../context/useAuth';
import { useAssessments } from '../../context/useAssessments';
import { useCourses } from '../../context/useCourses';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import AssignmentFormModal from './AssignmentFormModal';
import QuizFormModal from './QuizFormModal';
import {
  FileText,
  HelpCircle,
  CheckCircle2,
  Clock,
  Award,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Check,
  Send,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  CheckSquare,
  Plus,
  Pencil,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const AssignmentsPage = () => {
  const {
    assignments,
    quizzes,
    isSyncing,
    syncAssessmentsFromApi,
    submitAssignment,
    submitQuiz,
    assessmentStatistics,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    createQuiz,
    updateQuiz,
    deleteQuiz
  } = useAssessments();

  const { courses } = useCourses();
  const { canManageCourses } = useAuth();

  // Active Tab: 'assignments' or 'quizzes'
  const [activeTab, setActiveTab] = useState('assignments');

  // Filter & Search states for Assignments
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState('All');
  const [assignmentCourseFilter, setAssignmentCourseFilter] = useState('All');
  const [assignmentPage, setAssignmentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter & Search states for Quizzes
  const [quizSearch, setQuizSearch] = useState('');
  const [quizStatusFilter, setQuizStatusFilter] = useState('All');
  const [quizCourseFilter, setQuizCourseFilter] = useState('All');
  const [quizPage, setQuizPage] = useState(1);

  // Modal states for Assignment Details & Submission
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionLink, setSubmissionLink] = useState('');
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states for Quiz Instructions & Quiz Runner
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizStep, setQuizStep] = useState('instructions'); // 'instructions' | 'taking' | 'result'
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // CRUD Modals state
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const [itemToDelete, setItemToDelete] = useState(null); // { type: 'assignment' | 'quiz', id, title }
  const [isDeleting, setIsDeleting] = useState(false);

  // Save Assignment (Create / Edit)
  const handleSaveAssignment = async (assignmentData) => {
    if (editingAssignment) {
      await updateAssignment(editingAssignment.id, assignmentData);
    } else {
      await createAssignment(assignmentData);
    }
  };

  // Save Quiz (Create / Edit)
  const handleSaveQuiz = async (quizData) => {
    if (editingQuiz) {
      await updateQuiz(editingQuiz.id, quizData);
    } else {
      await createQuiz(quizData);
    }
  };

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      if (itemToDelete.type === 'assignment') {
        await deleteAssignment(itemToDelete.id);
      } else if (itemToDelete.type === 'quiz') {
        await deleteQuiz(itemToDelete.id);
      }
      setItemToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper: Deadline urgency indicator
  const getDeadlineStatus = (dueDate, status) => {
    if (status === 'Submitted' || status === 'Graded') {
      return {
        label: 'Turned In',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotClass: 'bg-emerald-500',
        isUrgent: false
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    const diffDays = Math.round((due - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        label: `Overdue by ${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'day' : 'days'}`,
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
        dotClass: 'bg-rose-500',
        isUrgent: true
      };
    }
    if (diffDays === 0) {
      return {
        label: 'Due Today (Urgent)',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-300 animate-pulse',
        dotClass: 'bg-amber-500',
        isUrgent: true
      };
    }
    if (diffDays <= 3) {
      return {
        label: `Due in ${diffDays} days`,
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotClass: 'bg-amber-500',
        isUrgent: true
      };
    }

    return {
      label: `Due ${dueDate}`,
      badgeClass: 'bg-slate-50 text-slate-600 border-slate-200',
      dotClass: 'bg-slate-400',
      isUrgent: false
    };
  };

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      // Course filter
      if (assignmentCourseFilter !== 'All' && String(a.courseId) !== String(assignmentCourseFilter)) {
        return false;
      }
      // Status filter
      if (assignmentStatusFilter !== 'All' && a.status !== assignmentStatusFilter) {
        return false;
      }
      // Search query
      if (assignmentSearch.trim()) {
        const q = assignmentSearch.toLowerCase().trim();
        const matchesTitle = a.title?.toLowerCase().includes(q);
        const matchesCourse = a.courseTitle?.toLowerCase().includes(q);
        const matchesInstructor = a.instructor?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCourse && !matchesInstructor) return false;
      }
      return true;
    });
  }, [assignments, assignmentCourseFilter, assignmentStatusFilter, assignmentSearch]);

  const totalAssignmentPages = Math.max(1, Math.ceil(filteredAssignments.length / itemsPerPage));
  const safeAssignmentPage = Math.min(Math.max(1, assignmentPage), totalAssignmentPages);
  const paginatedAssignments = useMemo(() => {
    const start = (safeAssignmentPage - 1) * itemsPerPage;
    return filteredAssignments.slice(start, start + itemsPerPage);
  }, [filteredAssignments, safeAssignmentPage, itemsPerPage]);

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((q) => {
      // Course filter
      if (quizCourseFilter !== 'All' && String(q.courseId) !== String(quizCourseFilter)) {
        return false;
      }
      // Status filter
      if (quizStatusFilter !== 'All' && q.status !== quizStatusFilter) {
        return false;
      }
      // Search query
      if (quizSearch.trim()) {
        const query = quizSearch.toLowerCase().trim();
        const matchesTitle = q.title?.toLowerCase().includes(query);
        const matchesCourse = q.courseTitle?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCourse) return false;
      }
      return true;
    });
  }, [quizzes, quizCourseFilter, quizStatusFilter, quizSearch]);

  const totalQuizPages = Math.max(1, Math.ceil(filteredQuizzes.length / itemsPerPage));
  const safeQuizPage = Math.min(Math.max(1, quizPage), totalQuizPages);
  const paginatedQuizzes = useMemo(() => {
    const start = (safeQuizPage - 1) * itemsPerPage;
    return filteredQuizzes.slice(start, start + itemsPerPage);
  }, [filteredQuizzes, safeQuizPage, itemsPerPage]);

  // Handle open assignment details modal
  const handleOpenAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmissionLink(assignment.submissionLink || '');
    setSubmissionText(assignment.submissionText || '');
  };

  // Handle submit assignment
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    setIsSubmitting(true);
    try {
      await submitAssignment(selectedAssignment.id, {
        submissionText,
        submissionLink
      });
      setSelectedAssignment(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle open quiz modal
  const handleOpenQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizStep('instructions');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizResult(null);
  };

  // Start live quiz
  const handleStartQuiz = () => {
    setQuizStep('taking');
    setCurrentQuestionIndex(0);
    setUserAnswers({});
  };

  // Select quiz option
  const handleSelectAnswer = (questionIndex, optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  // Finish and grade quiz
  const handleFinishQuiz = async () => {
    if (!selectedQuiz) return;

    let correctCount = 0;
    const questions = selectedQuiz.questions || [];

    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / (questions.length || 1)) * 100);
    const passed = scorePercentage >= (selectedQuiz.passingPercentage || 70);

    const resultPayload = {
      scorePercentage,
      correctCount,
      totalCount: questions.length,
      passed
    };

    setQuizResult(resultPayload);
    setQuizStep('result');

    await submitQuiz(selectedQuiz.id, scorePercentage);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Assessments & Evaluations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Assignments & Quizzes
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Submit coursework, track submission statuses with deadline indicators, and test your skills with interactive quizzes.
          </p>
        </div>

        {/* Actions: Sync from DummyJSON API & Create New */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>DummyJSON API Live</span>
          </div>
          <button
            type="button"
            onClick={syncAssessmentsFromApi}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync from API'}</span>
          </button>
          {canManageCourses && (
            activeTab === 'assignments' ? (
              <button
                type="button"
                onClick={() => {
                  setEditingAssignment(null);
                  setIsAssignmentModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Assignment</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingQuiz(null);
                  setIsQuizModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Quiz</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Assessment Statistics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Total Assignments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Assignments
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {assessmentStatistics.totalAssignments}
            </span>
            <span className="text-xs text-slate-500">tasks assigned</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="text-emerald-600 font-medium">
              {assessmentStatistics.gradedAssignmentsCount} graded
            </span>
            <span>{assessmentStatistics.submittedAssignmentsCount} in review</span>
          </div>
        </div>

        {/* KPI 2: Pending Submissions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pending Submissions
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">
              {assessmentStatistics.pendingAssignmentsCount}
            </span>
            <span className="text-xs text-amber-700 font-medium">awaiting upload</span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Check deadlines below to ensure on-time delivery
          </p>
        </div>

        {/* KPI 3: Available Quizzes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Curriculum Quizzes
            </span>
            <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {assessmentStatistics.totalQuizzes}
            </span>
            <span className="text-xs text-violet-600 font-medium">
              {assessmentStatistics.completedQuizzesCount} taken
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Automated scoring with instant grading feedback
          </p>
        </div>

        {/* KPI 4: Average Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Avg Assessment Marks
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              {assessmentStatistics.averageQuizScore > 0 ? `${assessmentStatistics.averageQuizScore}%` : '85%'}
            </span>
            <span className="text-xs font-medium text-emerald-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              High Passing
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Average across completed course quizzes & assignments
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'assignments'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Assignments List ({filteredAssignments.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quizzes')}
            className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'quizzes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Interactive Quizzes ({filteredQuizzes.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ASSIGNMENTS LIST                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search assignments by title, course, or instructor..."
                value={assignmentSearch}
                onChange={(e) => {
                  setAssignmentSearch(e.target.value);
                  setAssignmentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
                <select
                  value={assignmentStatusFilter}
                  onChange={(e) => {
                    setAssignmentStatusFilter(e.target.value);
                    setAssignmentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Graded">Graded</option>
                </select>
              </div>

              {/* Course Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Course:</span>
                <select
                  value={assignmentCourseFilter}
                  onChange={(e) => {
                    setAssignmentCourseFilter(e.target.value);
                    setAssignmentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium max-w-[170px] truncate focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="All">All Courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {(assignmentSearch || assignmentStatusFilter !== 'All' || assignmentCourseFilter !== 'All') && (
                <button
                  type="button"
                  onClick={() => {
                    setAssignmentSearch('');
                    setAssignmentStatusFilter('All');
                    setAssignmentCourseFilter('All');
                    setAssignmentPage(1);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Assignment Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAssignments.length > 0 ? (
              paginatedAssignments.map((assignment) => {
                const deadline = getDeadlineStatus(assignment.dueDate, assignment.status);
                const isGraded = assignment.status === 'Graded';
                const isSubmitted = assignment.status === 'Submitted';

                return (
                  <div
                    key={assignment.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Bar: Course Badge & Management Actions */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50/80 text-indigo-700 text-xs font-semibold truncate max-w-[170px] border border-indigo-100">
                          {assignment.courseTitle}
                        </span>

                        {/* Card Management Action Buttons: Edit & Delete (Instructors only) */}
                        {canManageCourses && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              title="Edit Assignment"
                              onClick={() => {
                                setEditingAssignment(assignment);
                                setIsAssignmentModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/70 transition-all cursor-pointer shadow-2xs"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Delete Assignment"
                              onClick={() => {
                                setItemToDelete({
                                  type: 'assignment',
                                  id: assignment.id,
                                  title: assignment.title
                                });
                              }}
                              className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/70 transition-all cursor-pointer shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Deadline Urgency Indicator */}
                      <div className="mb-3">
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold ${deadline.badgeClass}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${deadline.dotClass}`} />
                          <span>{deadline.label}</span>
                        </div>
                      </div>

                      {/* Title & API Source Badge */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-indigo-600 transition-colors">
                            {assignment.title}
                          </h3>
                        </div>
                        {assignment.isApi && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>DummyJSON Task</span>
                          </span>
                        )}
                      </div>

                      {/* Description snippet */}
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {assignment.description}
                      </p>

                      {/* Instructor and Weightage Meta */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Instructor: <strong className="text-slate-700">{assignment.instructor}</strong></span>
                        <span>Weight: <strong className="text-indigo-600">{assignment.weightage}%</strong></span>
                      </div>
                    </div>

                    {/* Footer: Submission Status & Primary Action Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      {/* Submission Status & Marks */}
                      <div>
                        {isGraded ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                              {assignment.marksAwarded} / {assignment.totalMarks}
                            </span>
                            <span className="text-xs font-semibold text-emerald-700">
                              Grade {assignment.grade}
                            </span>
                          </div>
                        ) : isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Review</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                            <Clock className="w-3 h-3" />
                            <span>Not Submitted</span>
                          </span>
                        )}
                      </div>

                      {/* Primary CTA Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenAssignment(assignment)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.98]"
                      >
                        <span>{isGraded ? 'View Feedback' : isSubmitted ? 'View Submission' : 'Submit Work'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">No Assignments Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No assignments match the selected filters or search keyword. Try clearing filters or syncing from API.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalAssignmentPages > 1 && (
            <div className="pt-4">
              <Pagination
                currentPage={safeAssignmentPage}
                totalPages={totalAssignmentPages}
                onPageChange={(p) => setAssignmentPage(p)}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INTERACTIVE QUIZZES LIST                                           */}
      {/* ========================================================================= */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          {/* Quiz Filter Bar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search quizzes by title or course name..."
                value={quizSearch}
                onChange={(e) => {
                  setQuizSearch(e.target.value);
                  setQuizPage(1);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Filter className="w-3.5 h-3.5" />
                <span>Status:</span>
                <select
                  value={quizStatusFilter}
                  onChange={(e) => {
                    setQuizStatusFilter(e.target.value);
                    setQuizPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="All">All</option>
                  <option value="Available">Available</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Course Filter */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span>Course:</span>
                <select
                  value={quizCourseFilter}
                  onChange={(e) => {
                    setQuizCourseFilter(e.target.value);
                    setQuizPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium max-w-[170px] truncate focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="All">All Courses</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quiz Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedQuizzes.length > 0 ? (
              paginatedQuizzes.map((quiz) => {
                const isCompleted = quiz.status === 'Completed';

                return (
                  <div
                    key={quiz.id}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Bar: Course Badge & Management Actions */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50/80 text-indigo-700 text-xs font-semibold truncate max-w-[170px] border border-indigo-100">
                          {quiz.courseTitle}
                        </span>

                        {/* Card Management Action Buttons: Edit & Delete (Instructors only) */}
                        {canManageCourses && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              title="Edit Quiz"
                              onClick={() => {
                                setEditingQuiz(quiz);
                                setIsQuizModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/70 transition-all cursor-pointer shadow-2xs"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Delete Quiz"
                              onClick={() => {
                                setItemToDelete({
                                  type: 'quiz',
                                  id: quiz.id,
                                  title: quiz.title
                                });
                              }}
                              className="p-1.5 rounded-lg border border-slate-200/80 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50/70 transition-all cursor-pointer shadow-2xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Status / Duration Badge */}
                      <div className="mb-3">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Score: {quiz.score}%</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-semibold">
                            <Clock className="w-3 h-3 text-indigo-600" />
                            <span>{quiz.durationMinutes} Minutes Exam</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-indigo-600 transition-colors">
                        {quiz.title}
                      </h3>

                      {/* Quiz Details / Meta */}
                      <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Questions</p>
                          <p className="font-bold text-slate-800 mt-0.5">
                            {quiz.totalQuestions || quiz.questions?.length || 5} Questions
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-semibold">Passing Score</p>
                          <p className="font-bold text-indigo-600 mt-0.5">
                            {quiz.passingPercentage}% Required
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer: Status & Primary Action Button */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500 font-medium">
                        {isCompleted ? 'Completed on time' : 'Ready to attempt'}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleOpenQuiz(quiz)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.98] ${
                          isCompleted
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Review / Retake</span>
                          </>
                        ) : (
                          <>
                            <span>Start Quiz</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-800">No Quizzes Found</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No quizzes match your selected filter criteria.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalQuizPages > 1 && (
            <div className="pt-4">
              <Pagination
                currentPage={safeQuizPage}
                totalPages={totalQuizPages}
                onPageChange={(p) => setQuizPage(p)}
              />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ASSIGNMENT DETAILS & SUBMISSION MODAL                            */}
      {/* ========================================================================= */}
      {selectedAssignment && (
        <Modal
          isOpen={Boolean(selectedAssignment)}
          onClose={() => setSelectedAssignment(null)}
          title="Assignment Evaluation & Submission"
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Assignment Header Info */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
                  {selectedAssignment.courseTitle}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Instructor: <strong className="text-slate-800">{selectedAssignment.instructor}</strong>
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                {selectedAssignment.title}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Total Marks</span>
                  <strong className="text-slate-900 text-sm">{selectedAssignment.totalMarks} Points</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Weightage</span>
                  <strong className="text-indigo-600 text-sm">{selectedAssignment.weightage}% of Grade</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Deadline</span>
                  <strong className="text-rose-600 text-sm">{selectedAssignment.dueDate}</strong>
                </div>
              </div>
            </div>

            {/* Description & Requirements Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Problem Statement & Deliverables
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                {selectedAssignment.description}
              </p>

              {Array.isArray(selectedAssignment.requirements) && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-700">Required Deliverables:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600 pl-1">
                    {selectedAssignment.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Graded Marks Feedback Section (If Graded) */}
            {selectedAssignment.status === 'Graded' && (
              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Grading & Evaluation Feedback</span>
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-sm shadow-xs">
                    {selectedAssignment.marksAwarded} / {selectedAssignment.totalMarks} (Grade {selectedAssignment.grade})
                  </span>
                </div>
                <p className="text-xs text-emerald-900 bg-white/70 p-3 rounded-lg border border-emerald-200/60 leading-relaxed">
                  "{selectedAssignment.feedback}"
                </p>
              </div>
            )}

            {/* Interactive Submission Form */}
            <form onSubmit={handleSubmitAssignment} className="space-y-4 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-indigo-600" />
                <span>Submit Your Work</span>
              </h4>

              {/* Repository or Live Link */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Repository URL / Figma Project Link
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/username/project-repo"
                    value={submissionLink}
                    onChange={(e) => setSubmissionLink(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Submission Comments / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Implementation Summary / Reflection
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline key architectural decisions, test coverage, and deployment verification..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : selectedAssignment.status === 'Submitted' ? 'Update Submission' : 'Submit Assignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: QUIZ INSTRUCTIONS & INTERACTIVE QUIZ RUNNER                     */}
      {/* ========================================================================= */}
      {selectedQuiz && (
        <Modal
          isOpen={Boolean(selectedQuiz)}
          onClose={() => setSelectedQuiz(null)}
          title={
            quizStep === 'instructions'
              ? 'Quiz Instructions & Rules'
              : quizStep === 'taking'
              ? `${selectedQuiz.title} (Question ${currentQuestionIndex + 1}/${selectedQuiz.questions?.length || 5})`
              : 'Quiz Results & Score Card'
          }
          maxWidth="max-w-2xl"
        >
          {/* STEP 1: INSTRUCTIONS */}
          {quizStep === 'instructions' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50/50 p-5 rounded-2xl border border-indigo-100 space-y-3">
                <span className="px-2.5 py-0.5 rounded-full bg-white text-indigo-700 text-xs font-bold border border-indigo-200">
                  {selectedQuiz.courseTitle}
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {selectedQuiz.title}
                </h3>
                <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100 text-center">
                    <Clock className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                    <span className="text-slate-400 block text-[10px] uppercase">Duration</span>
                    <strong className="text-slate-800">{selectedQuiz.durationMinutes} Minutes</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100 text-center">
                    <HelpCircle className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                    <span className="text-slate-400 block text-[10px] uppercase">Total Questions</span>
                    <strong className="text-slate-800">{selectedQuiz.questions?.length || 5} MCQs</strong>
                  </div>
                  <div className="bg-white/80 p-2.5 rounded-xl border border-indigo-100 text-center">
                    <Award className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                    <span className="text-slate-400 block text-[10px] uppercase">Passing Mark</span>
                    <strong className="text-slate-800">{selectedQuiz.passingPercentage}% Minimum</strong>
                  </div>
                </div>
              </div>

              {/* Instructions Guidelines */}
              <div className="space-y-3 text-xs text-slate-600">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Examination Rules & Guidelines:
                </h4>
                <ul className="space-y-2 list-disc pl-5">
                  <li>Each question has 4 options with exactly one correct answer.</li>
                  <li>There is <strong>no negative marking</strong> for incorrect choices.</li>
                  <li>You can navigate back and forth between questions before submitting.</li>
                  <li>Upon submission, your marks and per-question explanations will be calculated automatically.</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedQuiz(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
                >
                  <span>Start Quiz Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: LIVE QUIZ TAKING ENGINE */}
          {quizStep === 'taking' && Array.isArray(selectedQuiz.questions) && selectedQuiz.questions.length > 0 && selectedQuiz.questions[currentQuestionIndex] ? (
            <div className="space-y-6">
              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%`
                  }}
                />
              </div>

              {/* Active Question */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                  </span>
                  <span className="flex items-center gap-1 text-indigo-600 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Time Left: ~{selectedQuiz.durationMinutes}m</span>
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {selectedQuiz.questions[currentQuestionIndex].question}
                </h3>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {selectedQuiz.questions[currentQuestionIndex].options.map((option, optIdx) => {
                    const isSelected = userAnswers[currentQuestionIndex] === optIdx;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(currentQuestionIndex, optIdx)}
                        className={`w-full p-3.5 sm:px-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-900 ring-2 ring-indigo-500/20 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stepper Navigation */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 cursor-pointer"
                >
                  Previous Question
                </button>

                {currentQuestionIndex < selectedQuiz.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(selectedQuiz.questions.length - 1, prev + 1)
                      )
                    }
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinishQuiz}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Finish Quiz</span>
                  </button>
                )}
              </div>
            </div>
          ) : quizStep === 'taking' ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800">No Questions Configured</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                This quiz currently has no questions configured. Please click "Edit Quiz" to add interactive questions.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuiz(null)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null}

          {/* STEP 3: QUIZ RESULT & EXPLANATIONS */}
          {quizStep === 'result' && quizResult && (
            <div className="space-y-6">
              {/* Score banner */}
              <div
                className={`p-6 rounded-2xl border text-center space-y-2 ${
                  quizResult.passed
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-xs bg-white">
                  {quizResult.passed ? (
                    <Award className="w-8 h-8 text-emerald-600" />
                  ) : (
                    <RotateCcw className="w-8 h-8 text-amber-600" />
                  )}
                </div>
                <h3 className="text-xl font-bold">
                  {quizResult.passed ? '🎉 Congratulations! You Passed!' : 'Quiz Attempt Finished'}
                </h3>
                <div className="flex items-center justify-center gap-2 text-2xl font-extrabold">
                  <span>Score: {quizResult.scorePercentage}%</span>
                  <span className="text-sm font-medium">
                    ({quizResult.correctCount}/{quizResult.totalCount} correct)
                  </span>
                </div>
                <p className="text-xs max-w-sm mx-auto">
                  {quizResult.passed
                    ? `You met the passing criteria of ${selectedQuiz.passingPercentage}%. Keep up the stellar work!`
                    : `You scored below the ${selectedQuiz.passingPercentage}% requirement. Review explanations below and retry anytime.`}
                </p>
              </div>

              {/* Review answers */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Question Explanations & Answer Key:
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {selectedQuiz.questions.map((q, idx) => {
                    const chosen = userAnswers[idx];
                    const isCorrect = chosen === q.correctAnswerIndex;

                    return (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-slate-800">
                            {idx + 1}. {q.question}
                          </p>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>
                        <p className="text-slate-500">
                          Your choice: <strong>{chosen !== undefined ? q.options[chosen] : 'None'}</strong>
                        </p>
                        <p className="text-emerald-700 font-medium">
                          Correct: {q.options[q.correctAnswerIndex]}
                        </p>
                        <p className="text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                          💡 {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleStartQuiz}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedQuiz(null)}
                  className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CREATE / EDIT ASSIGNMENT MODAL                                   */}
      {/* ========================================================================= */}
      {isAssignmentModalOpen && (
        <AssignmentFormModal
          key={editingAssignment ? editingAssignment.id : 'new-assignment'}
          isOpen={isAssignmentModalOpen}
          onClose={() => {
            setIsAssignmentModalOpen(false);
            setEditingAssignment(null);
          }}
          initialData={editingAssignment}
          onSave={handleSaveAssignment}
          courses={courses}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CREATE / EDIT QUIZ MODAL                                         */}
      {/* ========================================================================= */}
      {isQuizModalOpen && (
        <QuizFormModal
          key={editingQuiz ? editingQuiz.id : 'new-quiz'}
          isOpen={isQuizModalOpen}
          onClose={() => {
            setIsQuizModalOpen(false);
            setEditingQuiz(null);
          }}
          initialData={editingQuiz}
          onSave={handleSaveQuiz}
          courses={courses}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DELETE CONFIRMATION DIALOG                                      */}
      {/* ========================================================================= */}
      {itemToDelete && (
        <Modal
          isOpen={Boolean(itemToDelete)}
          onClose={() => {
            if (!isDeleting) setItemToDelete(null);
          }}
          title={`Confirm Delete ${itemToDelete.type === 'assignment' ? 'Assignment' : 'Quiz'}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Are you sure you want to delete this {itemToDelete.type}?</p>
                <p className="text-rose-700 mt-1 font-semibold line-clamp-1">"{itemToDelete.title}"</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action cannot be undone. All submissions, grades, and associated metrics for this {itemToDelete.type} will be permanently removed.
            </p>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AssignmentsPage;
