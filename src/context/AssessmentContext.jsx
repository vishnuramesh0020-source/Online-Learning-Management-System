import { useState, useEffect, useMemo, useCallback } from 'react';
import { AssessmentContext } from './contexts';
import { assessmentService } from '../api/assessmentService';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { INITIAL_ASSIGNMENTS, INITIAL_QUIZZES } from '../utils/dummyData';
import { toast } from 'react-toastify';

export const AssessmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState(() => {
    return getStorageItem(STORAGE_KEYS.ASSIGNMENTS, INITIAL_ASSIGNMENTS);
  });

  const [quizzes, setQuizzes] = useState(() => {
    return getStorageItem(STORAGE_KEYS.QUIZZES, INITIAL_QUIZZES);
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ASSIGNMENTS, assignments);
  }, [assignments]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.QUIZZES, quizzes);
  }, [quizzes]);

  // Sync assessments with DummyJSON API
  const syncAssessmentsFromApi = useCallback(async () => {
    setIsSyncing(true);
    try {
      const result = await assessmentService.syncFromApi();
      setAssignments(result.assignments);
      toast.success(`Synced ${result.syncedCount} assignments live from DummyJSON API!`);
      return result;
    } catch (err) {
      toast.error('Failed to sync assessments from API. Using local cache.');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Submit an assignment
  const submitAssignment = useCallback(async (assignmentId, { submissionText, submissionLink }) => {
    try {
      const updatedItem = await assessmentService.submitAssignment(assignmentId, {
        submissionText,
        submissionLink
      });

      setAssignments((prev) =>
        prev.map((a) => (String(a.id) === String(assignmentId) ? updatedItem : a))
      );

      toast.success('Assignment submitted successfully for instructor review!');
      return updatedItem;
    } catch (err) {
      toast.error('Failed to submit assignment.');
      throw err;
    }
  }, []);

  // Grade an assignment
  const gradeAssignment = useCallback(async (assignmentId, { marksAwarded, feedback }) => {
    try {
      const updatedItem = await assessmentService.gradeAssignment(assignmentId, {
        marksAwarded,
        feedback
      });

      setAssignments((prev) =>
        prev.map((a) => (String(a.id) === String(assignmentId) ? updatedItem : a))
      );

      toast.success(`Assignment graded with ${marksAwarded}/100 marks!`);
      return updatedItem;
    } catch (err) {
      toast.error('Failed to grade assignment.');
      throw err;
    }
  }, []);

  // Submit a completed quiz
  const submitQuiz = useCallback(async (quizId, scorePercentage) => {
    try {
      const updatedQuiz = await assessmentService.submitQuizResult(quizId, scorePercentage);

      setQuizzes((prev) =>
        prev.map((q) => (String(q.id) === String(quizId) ? updatedQuiz : q))
      );

      if (scorePercentage >= 70) {
        toast.success(`🎉 Congratulations! You passed with ${scorePercentage}% score!`);
      } else {
        toast.info(`Quiz completed with ${scorePercentage}% score. Review the explanations and retry.`);
      }

      return updatedQuiz;
    } catch (err) {
      toast.error('Failed to submit quiz result.');
      throw err;
    }
  }, []);

  // Create Assignment
  const createAssignment = useCallback(async (assignmentData) => {
    try {
      const created = await assessmentService.createAssignment(assignmentData);
      setAssignments((prev) => [created, ...prev]);
      toast.success(`Assignment "${created.title}" created successfully!`);
      return created;
    } catch (err) {
      toast.error('Failed to create assignment.');
      throw err;
    }
  }, []);

  // Update Assignment
  const updateAssignment = useCallback(async (id, updatedFields) => {
    try {
      const updated = await assessmentService.updateAssignment(id, updatedFields);
      setAssignments((prev) =>
        prev.map((a) => (String(a.id) === String(id) ? updated : a))
      );
      toast.success('Assignment updated successfully!');
      return updated;
    } catch (err) {
      toast.error('Failed to update assignment.');
      throw err;
    }
  }, []);

  // Delete Assignment
  const deleteAssignment = useCallback(async (id) => {
    try {
      await assessmentService.deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => String(a.id) !== String(id)));
      toast.success('Assignment deleted successfully.');
      return true;
    } catch (err) {
      toast.error('Failed to delete assignment.');
      throw err;
    }
  }, []);

  // Create Quiz
  const createQuiz = useCallback(async (quizData) => {
    try {
      const created = await assessmentService.createQuiz(quizData);
      setQuizzes((prev) => [created, ...prev]);
      toast.success(`Quiz "${created.title}" created successfully!`);
      return created;
    } catch (err) {
      toast.error('Failed to create quiz.');
      throw err;
    }
  }, []);

  // Update Quiz
  const updateQuiz = useCallback(async (id, updatedFields) => {
    try {
      const updated = await assessmentService.updateQuiz(id, updatedFields);
      setQuizzes((prev) =>
        prev.map((q) => (String(q.id) === String(id) ? updated : q))
      );
      toast.success('Quiz updated successfully!');
      return updated;
    } catch (err) {
      toast.error('Failed to update quiz.');
      throw err;
    }
  }, []);

  // Delete Quiz
  const deleteQuiz = useCallback(async (id) => {
    try {
      await assessmentService.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => String(q.id) !== String(id)));
      toast.success('Quiz deleted successfully.');
      return true;
    } catch (err) {
      toast.error('Failed to delete quiz.');
      throw err;
    }
  }, []);

  // Assessment summary statistics
  const assessmentStatistics = useMemo(() => {
    const totalAssignments = assignments.length;
    const submittedAssignmentsCount = assignments.filter((a) => a.status === 'Submitted').length;
    const gradedAssignmentsCount = assignments.filter((a) => a.status === 'Graded').length;
    const pendingAssignmentsCount = assignments.filter((a) => a.status === 'Pending').length;

    const totalQuizzes = quizzes.length;
    const completedQuizzes = quizzes.filter((q) => q.status === 'Completed' && q.score !== null);
    const completedQuizzesCount = completedQuizzes.length;

    const averageQuizScore = completedQuizzesCount > 0
      ? Math.round(completedQuizzes.reduce((acc, q) => acc + (q.score || 0), 0) / completedQuizzesCount)
      : 0;

    const totalGradedMarks = assignments
      .filter((a) => a.status === 'Graded' && typeof a.marksAwarded === 'number')
      .map((a) => a.marksAwarded);

    const averageAssignmentMarks = totalGradedMarks.length > 0
      ? Math.round(totalGradedMarks.reduce((acc, m) => acc + m, 0) / totalGradedMarks.length)
      : 90;

    return {
      totalAssignments,
      submittedAssignmentsCount,
      gradedAssignmentsCount,
      pendingAssignmentsCount,
      totalQuizzes,
      completedQuizzesCount,
      averageQuizScore,
      averageAssignmentMarks
    };
  }, [assignments, quizzes]);

  return (
    <AssessmentContext.Provider
      value={{
        assignments,
        quizzes,
        isSyncing,
        syncAssessmentsFromApi,
        submitAssignment,
        gradeAssignment,
        submitQuiz,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        assessmentStatistics
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
