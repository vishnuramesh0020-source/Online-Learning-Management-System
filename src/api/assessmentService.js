import axiosClient from './axiosClient';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { INITIAL_ASSIGNMENTS, INITIAL_QUIZZES } from '../utils/dummyData';

/**
 * Adapter to map a DummyJSON post into a curriculum Assignment
 */
const mapApiPostToAssignment = (post, index) => {
  const courseIds = [1, 2, 3, 4, 5, 6];
  const courseTitles = [
    "Mastering React 19 & Next.js 15 Full-Stack",
    "Complete Python for Data Science and Machine Learning",
    "Modern UI/UX Design with Figma: Concept to Prototype",
    "Cloud Computing & DevOps with AWS, Docker & Kubernetes",
    "Cross-Platform Mobile App Development with Flutter & Dart",
    "Deep Learning, LLMs & Generative AI Bootcamp"
  ];
  const instructors = [
    "Dr. Sarah Jenkins",
    "Prof. Michael Chen",
    "Elena Rostova",
    "David Miller",
    "Sophia Rodriguez",
    "Dr. Alan Vance"
  ];

  const courseIdx = index % courseIds.length;
  const daysOffset = (index % 5) + 2;
  const dueDate = new Date(Date.now() + daysOffset * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return {
    id: `asg_api_${post.id}`,
    title: `Practical Task: ${post.title.charAt(0).toUpperCase() + post.title.slice(1)}`,
    courseId: courseIds[courseIdx],
    courseTitle: courseTitles[courseIdx],
    instructor: instructors[courseIdx],
    description: post.body,
    requirements: [
      `Review core principles outlined in ${post.title}`,
      `Apply tags: ${Array.isArray(post.tags) ? post.tags.join(', ') : 'architecture, development'}`,
      "Develop reproducible solution with full documentation",
      "Submit repository URL and execution proof"
    ],
    dueDate,
    totalMarks: 100,
    weightage: 20,
    status: "Pending",
    submissionText: "",
    submissionLink: "",
    submittedAt: null,
    marksAwarded: null,
    grade: null,
    feedback: null,
    isApi: true,
    source: "DummyJSON"
  };
};

export const assessmentService = {
  /**
   * Get all assignments from localStorage or initial seed
   */
  async getAllAssignments() {
    return getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  },

  /**
   * Get all quizzes from localStorage or initial seed
   */
  async getAllQuizzes() {
    return getStorageItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  },

  /**
   * Sync fresh assignments from DummyJSON /posts API
   */
  async syncFromApi() {
    try {
      const response = await axiosClient.get('/posts?limit=6');
      const posts = response.posts || [];
      const remoteAssignments = posts.map(mapApiPostToAssignment);

      const localAssignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
      const existingIds = new Set(localAssignments.map((a) => String(a.id)));

      // Merge remote without clobbering existing
      const mergedAssignments = [
        ...localAssignments,
        ...remoteAssignments.filter((a) => !existingIds.has(String(a.id)))
      ];

      setStorageItem(STORAGE_KEYS.ASSIGNMENTS, mergedAssignments);
      return {
        assignments: mergedAssignments,
        syncedCount: remoteAssignments.length
      };
    } catch (err) {
      console.warn('DummyJSON posts sync fallback to local storage:', err);
      return {
        assignments: getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS),
        syncedCount: 0
      };
    }
  },

  /**
   * Submit an assignment
   */
  async submitAssignment(assignmentId, { submissionText, submissionLink }) {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    const updated = assignments.map((a) => {
      if (String(a.id) === String(assignmentId)) {
        return {
          ...a,
          status: 'Submitted',
          submissionText: submissionText || a.submissionText,
          submissionLink: submissionLink || a.submissionLink,
          submittedAt: new Date().toISOString(),
          feedback: 'Submitted successfully. Awaiting instructor review.'
        };
      }
      return a;
    });

    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, updated);
    return updated.find((a) => String(a.id) === String(assignmentId));
  },

  /**
   * Grade an assignment (Simulation)
   */
  async gradeAssignment(assignmentId, { marksAwarded, feedback }) {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    const numMarks = Number(marksAwarded) || 0;
    let grade = 'C';
    if (numMarks >= 90) grade = 'A+';
    else if (numMarks >= 80) grade = 'A';
    else if (numMarks >= 70) grade = 'B';
    else if (numMarks >= 60) grade = 'C';
    else grade = 'F';

    const updated = assignments.map((a) => {
      if (String(a.id) === String(assignmentId)) {
        return {
          ...a,
          status: 'Graded',
          marksAwarded: numMarks,
          grade,
          feedback: feedback || 'Graded by instructor.'
        };
      }
      return a;
    });

    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, updated);
    return updated.find((a) => String(a.id) === String(assignmentId));
  },

  /**
   * Submit Quiz Result
   */
  async submitQuizResult(quizId, scorePercentage) {
    const quizzes = getStorageItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    const updated = quizzes.map((q) => {
      if (String(q.id) === String(quizId)) {
        return {
          ...q,
          status: 'Completed',
          score: scorePercentage,
          completedAt: new Date().toISOString(),
          attempts: (q.attempts || 0) + 1
        };
      }
      return q;
    });

    setStorageItem(STORAGE_KEYS.QUIZZES, updated);
    return updated.find((q) => String(q.id) === String(quizId));
  },

  /**
   * Create a new Assignment
   */
  async createAssignment(assignmentData) {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    const newAssignment = {
      id: `asg_${Date.now()}`,
      title: assignmentData.title.trim(),
      courseId: assignmentData.courseId,
      courseTitle: assignmentData.courseTitle,
      instructor: assignmentData.instructor || 'Instructor',
      description: assignmentData.description || '',
      requirements: Array.isArray(assignmentData.requirements)
        ? assignmentData.requirements
        : typeof assignmentData.requirements === 'string'
        ? assignmentData.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
        : [],
      dueDate: assignmentData.dueDate || new Date().toISOString().split('T')[0],
      totalMarks: Number(assignmentData.totalMarks) || 100,
      weightage: Number(assignmentData.weightage) || 20,
      status: assignmentData.status || 'Pending',
      submissionText: '',
      submissionLink: '',
      submittedAt: null,
      marksAwarded: null,
      grade: null,
      feedback: null,
      createdAt: new Date().toISOString()
    };

    const updated = [newAssignment, ...assignments];
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, updated);
    return newAssignment;
  },

  /**
   * Update an existing Assignment
   */
  async updateAssignment(id, updatedFields) {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    let updatedItem = null;

    const updated = assignments.map((a) => {
      if (String(a.id) === String(id)) {
        const reqs = Array.isArray(updatedFields.requirements)
          ? updatedFields.requirements
          : typeof updatedFields.requirements === 'string'
          ? updatedFields.requirements.split('\n').map((r) => r.trim()).filter(Boolean)
          : a.requirements;

        updatedItem = {
          ...a,
          ...updatedFields,
          requirements: reqs,
          totalMarks: Number(updatedFields.totalMarks) || a.totalMarks,
          weightage: Number(updatedFields.weightage) || a.weightage,
          updatedAt: new Date().toISOString()
        };
        return updatedItem;
      }
      return a;
    });

    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, updated);
    return updatedItem;
  },

  /**
   * Delete an Assignment
   */
  async deleteAssignment(id) {
    const assignments = getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
    const updated = assignments.filter((a) => String(a.id) !== String(id));
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, updated);
    return true;
  },

  /**
   * Create a new Quiz
   */
  async createQuiz(quizData) {
    const quizzes = getStorageItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    const newQuiz = {
      id: `qz_${Date.now()}`,
      title: quizData.title.trim(),
      courseId: quizData.courseId,
      courseTitle: quizData.courseTitle,
      instructor: quizData.instructor || 'Instructor',
      durationMinutes: Number(quizData.durationMinutes) || 15,
      totalQuestions: quizData.questions?.length || 5,
      passingPercentage: Number(quizData.passingPercentage) || 70,
      status: 'Available',
      score: null,
      completedAt: null,
      attempts: 0,
      questions: Array.isArray(quizData.questions) ? quizData.questions : [],
      createdAt: new Date().toISOString()
    };

    const updated = [newQuiz, ...quizzes];
    setStorageItem(STORAGE_KEYS.QUIZZES, updated);
    return newQuiz;
  },

  /**
   * Update an existing Quiz
   */
  async updateQuiz(id, updatedFields) {
    const quizzes = getStorageItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    let updatedItem = null;

    const updated = quizzes.map((q) => {
      if (String(q.id) === String(id)) {
        const questions = Array.isArray(updatedFields.questions) ? updatedFields.questions : q.questions;
        updatedItem = {
          ...q,
          ...updatedFields,
          questions,
          totalQuestions: questions.length,
          durationMinutes: Number(updatedFields.durationMinutes) || q.durationMinutes,
          passingPercentage: Number(updatedFields.passingPercentage) || q.passingPercentage,
          updatedAt: new Date().toISOString()
        };
        return updatedItem;
      }
      return q;
    });

    setStorageItem(STORAGE_KEYS.QUIZZES, updated);
    return updatedItem;
  },

  /**
   * Delete a Quiz
   */
  async deleteQuiz(id) {
    const quizzes = getStorageItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
    const updated = quizzes.filter((q) => String(q.id) !== String(id));
    setStorageItem(STORAGE_KEYS.QUIZZES, updated);
    return true;
  }
};

