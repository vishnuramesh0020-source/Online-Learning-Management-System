import { useState, useEffect, useMemo } from 'react';
import { CourseContext } from './contexts';
import { courseService } from '../api/courseService';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { INITIAL_ENROLLMENTS, DEFAULT_COURSE_MODULES } from '../utils/dummyData';
import { toast } from 'react-toastify';

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc'); // 'name-asc', 'name-desc', 'price-low', 'price-high', 'rating-high'
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Enrolled courses state (persisted in localStorage)
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(() => {
    return getStorageItem(STORAGE_KEYS.ENROLLED, [1, 3]); // seed with 2 courses
  });

  // Rich Course Enrollments state (Module 5 & Module 7)
  const [enrollments, setEnrollments] = useState(() => {
    const rawEnrollments = getStorageItem(STORAGE_KEYS.ENROLLMENTS, INITIAL_ENROLLMENTS);
    return rawEnrollments.map((item) => {
      if (Array.isArray(item.completedLessons)) return item;
      const progressVal = Number(item.progress) || 0;
      const defaultCount = Math.min(5, Math.max(0, Math.round((progressVal / 100) * 5)));
      return {
        ...item,
        completedLessons: DEFAULT_COURSE_MODULES.slice(0, defaultCount)
      };
    });
  });

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ENROLLED, enrolledCourseIds);
  }, [enrolledCourseIds]);

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ENROLLMENTS, enrollments);
  }, [enrollments]);

  // Fetch courses on mount
  const fetchCourses = async () => {
    setError(null);
    try {
      const data = await courseService.getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Sync courses live from DummyJSON third-party API
  const syncCoursesFromApi = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const freshCourses = await courseService.syncFromApi();
      setCourses(freshCourses);
      toast.success(`Synced ${freshCourses.length} courses live from DummyJSON API!`);
      return freshCourses;
    } catch (err) {
      toast.error('Failed to sync courses from API. Using local cache.');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    let active = true;
    courseService.getAllCourses()
      .then((data) => {
        if (active) setCourses(data);
      })
      .catch((err) => {
        if (active) setError(err?.message || 'Failed to fetch courses.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Add course
  const addCourse = async (courseData) => {
    try {
      const newCourse = await courseService.createCourse(courseData);
      setCourses((prev) => [newCourse, ...prev]);
      return newCourse;
    } catch (err) {
      throw new Error(err?.message || 'Failed to add course');
    }
  };

  // Update course
  const updateCourse = async (id, updatedFields) => {
    try {
      const updated = await courseService.updateCourse(id, updatedFields);
      setCourses((prev) =>
        prev.map((item) => (String(item.id) === String(id) ? updated : item))
      );
      return updated;
    } catch (err) {
      throw new Error(err?.message || 'Failed to update course');
    }
  };

  // Delete course
  const deleteCourse = async (id) => {
    try {
      await courseService.deleteCourse(id);
      setCourses((prev) => prev.filter((item) => String(item.id) !== String(id)));
      // Also remove from enrolled if present
      setEnrolledCourseIds((prev) => prev.filter((courseId) => String(courseId) !== String(id)));
      return true;
    } catch (err) {
      throw new Error(err?.message || 'Failed to delete course');
    }
  };

  // Toggle enrollment (for logged in demo student)
  const toggleEnrollment = (courseId) => {
    const numericId = Number(courseId) || courseId;
    setEnrolledCourseIds((prev) => {
      const exists = prev.some((id) => String(id) === String(numericId));
      if (exists) {
        return prev.filter((id) => String(id) !== String(numericId));
      }
      return [...prev, numericId];
    });
  };

  // Module 5: Enroll a student into a course
  const enrollStudent = async ({
    studentId,
    studentName,
    studentEmail = '',
    courseId,
    enrollmentDate,
    status = 'In Progress',
    progress = 0
  }) => {
    // 1. Prevent duplicate enrollment
    const isDuplicate = enrollments.some(
      (e) => String(e.studentId) === String(studentId) && String(e.courseId) === String(courseId)
    );
    if (isDuplicate) {
      throw new Error(`Student "${studentName}" is already enrolled in this course.`);
    }

    const targetCourse = courses.find((c) => String(c.id) === String(courseId));
    if (!targetCourse) {
      throw new Error('Selected course does not exist.');
    }

    const courseModules = Array.isArray(targetCourse.modules) && targetCourse.modules.length > 0
      ? targetCourse.modules
      : DEFAULT_COURSE_MODULES;

    const initialProgress = Number(progress) || 0;
    const initialCompletedCount = Math.round((initialProgress / 100) * courseModules.length);
    const initialCompletedLessons = courseModules.slice(0, initialCompletedCount);

    const newEnrollment = {
      id: `enr_${Date.now()}`,
      studentId: String(studentId),
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim(),
      courseId: targetCourse.id,
      courseTitle: targetCourse.title,
      courseThumbnail: targetCourse.thumbnail,
      instructor: targetCourse.instructor,
      enrollmentDate: enrollmentDate || new Date().toISOString().split('T')[0],
      status: initialProgress >= 100 ? 'Completed' : status,
      progress: initialProgress,
      completedLessons: initialCompletedLessons,
      createdAt: new Date().toISOString()
    };

    setEnrollments((prev) => [newEnrollment, ...prev]);

    // Update enrolledStudents count on course
    setCourses((prev) =>
      prev.map((c) =>
        String(c.id) === String(courseId)
          ? { ...c, enrolledStudents: (Number(c.enrolledStudents) || 0) + 1 }
          : c
      )
    );

    // Keep enrolledCourseIds in sync
    setEnrolledCourseIds((prev) => {
      if (!prev.some((id) => String(id) === String(courseId))) {
        return [...prev, targetCourse.id];
      }
      return prev;
    });

    toast.success(`"${studentName}" successfully enrolled in "${targetCourse.title}"!`);
    return newEnrollment;
  };

  // Module 5: Remove enrollment
  const removeEnrollment = async (enrollmentId) => {
    const target = enrollments.find((e) => String(e.id) === String(enrollmentId));
    if (!target) return false;

    setEnrollments((prev) => prev.filter((e) => String(e.id) !== String(enrollmentId)));

    // Decrease course enrolled count
    setCourses((prev) =>
      prev.map((c) =>
        String(c.id) === String(target.courseId)
          ? { ...c, enrolledStudents: Math.max(0, (Number(c.enrolledStudents) || 0) - 1) }
          : c
      )
    );

    toast.success(`Enrollment for "${target.studentName}" removed.`);
    return true;
  };

  // Check if student is enrolled in course
  const isStudentEnrolled = (studentId, courseId) => {
    return enrollments.some(
      (e) => String(e.studentId) === String(studentId) && String(e.courseId) === String(courseId)
    );
  };

  // Module 5: Enrollment Summary Analytics
  const enrollmentSummary = useMemo(() => {
    const totalEnrollments = enrollments.length;
    const uniqueStudents = new Set(enrollments.map((e) => e.studentId)).size;
    const completedCount = enrollments.filter((e) => e.status === 'Completed' || e.progress >= 100).length;
    const inProgressCount = totalEnrollments - completedCount;

    // Course enrollment counts
    const courseCounts = {};
    enrollments.forEach((e) => {
      courseCounts[e.courseTitle] = (courseCounts[e.courseTitle] || 0) + 1;
    });

    let topCourse = 'N/A';
    let topCourseCount = 0;
    Object.entries(courseCounts).forEach(([title, count]) => {
      if (count > topCourseCount) {
        topCourseCount = count;
        topCourse = title;
      }
    });

    return {
      totalEnrollments,
      uniqueStudents,
      completedCount,
      inProgressCount,
      topCourse,
      topCourseCount
    };
  }, [enrollments]);

  // Module 7: Learning Progress Helpers & Actions
  const getCourseModules = (courseId) => {
    const course = courses.find((c) => String(c.id) === String(courseId));
    if (course && Array.isArray(course.modules) && course.modules.length > 0) {
      return course.modules;
    }
    return DEFAULT_COURSE_MODULES;
  };

  const resolveEnrollmentLessons = (enrollment) => {
    if (Array.isArray(enrollment.completedLessons)) {
      return enrollment.completedLessons;
    }
    const modules = getCourseModules(enrollment.courseId);
    const p = Number(enrollment.progress) || 0;
    const count = Math.min(modules.length, Math.max(0, Math.round((p / 100) * modules.length)));
    return modules.slice(0, count);
  };

  const toggleLessonCompletion = (enrollmentId, lessonTitle, isCompleted) => {
    let studentName = '';
    let courseTitle = '';
    let newPercentage = 0;

    setEnrollments((prev) =>
      prev.map((item) => {
        if (String(item.id) !== String(enrollmentId)) return item;

        studentName = item.studentName;
        courseTitle = item.courseTitle;
        const modules = getCourseModules(item.courseId);
        const currentCompleted = Array.isArray(item.completedLessons)
          ? [...item.completedLessons]
          : resolveEnrollmentLessons(item);

        let nextCompleted;
        if (isCompleted) {
          if (!currentCompleted.includes(lessonTitle)) {
            nextCompleted = [...currentCompleted, lessonTitle];
          } else {
            nextCompleted = currentCompleted;
          }
        } else {
          nextCompleted = currentCompleted.filter((t) => t !== lessonTitle);
        }

        const totalModules = modules.length || 1;
        newPercentage = Math.min(100, Math.max(0, Math.round((nextCompleted.length / totalModules) * 100)));
        const newStatus = newPercentage >= 100 ? 'Completed' : 'In Progress';

        return {
          ...item,
          completedLessons: nextCompleted,
          progress: newPercentage,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      })
    );

    if (isCompleted && newPercentage === 100) {
      toast.success(`🎉 100% Completed! ${studentName || 'Student'} finished "${courseTitle}"!`);
    }
  };

  const updateEnrollmentProgress = (enrollmentId, newPercentage) => {
    const safePercent = Math.min(100, Math.max(0, Number(newPercentage) || 0));
    setEnrollments((prev) =>
      prev.map((item) => {
        if (String(item.id) !== String(enrollmentId)) return item;
        const modules = getCourseModules(item.courseId);
        const completedCount = Math.round((safePercent / 100) * modules.length);
        const completedLessons = modules.slice(0, completedCount);
        return {
          ...item,
          progress: safePercent,
          status: safePercent >= 100 ? 'Completed' : 'In Progress',
          completedLessons,
          lastUpdated: new Date().toISOString()
        };
      })
    );
  };

  const markAllLessonsCompleted = (enrollmentId) => {
    setEnrollments((prev) =>
      prev.map((item) => {
        if (String(item.id) !== String(enrollmentId)) return item;
        const modules = getCourseModules(item.courseId);
        return {
          ...item,
          progress: 100,
          status: 'Completed',
          completedLessons: [...modules],
          lastUpdated: new Date().toISOString()
        };
      })
    );
    toast.success('All lessons marked as completed!');
  };

  const resetEnrollmentProgress = (enrollmentId) => {
    setEnrollments((prev) =>
      prev.map((item) => {
        if (String(item.id) !== String(enrollmentId)) return item;
        return {
          ...item,
          progress: 0,
          status: 'In Progress',
          completedLessons: [],
          lastUpdated: new Date().toISOString()
        };
      })
    );
    toast.info('Progress reset to 0%.');
  };

  // Module 7: Learning Progress Statistics
  const learningProgressStatistics = useMemo(() => {
    if (!enrollments.length) {
      return {
        totalEnrollments: 0,
        averageCompletionRate: 0,
        totalCompletedLessons: 0,
        totalPendingLessons: 0,
        totalLessons: 0,
        completedCertificates: 0,
        inProgressCount: 0,
        highAchieversCount: 0
      };
    }

    let totalProgressSum = 0;
    let totalCompletedLessons = 0;
    let totalLessonsCount = 0;
    let completedCertificates = 0;
    let highAchieversCount = 0;

    enrollments.forEach((e) => {
      const p = Number(e.progress) || 0;
      totalProgressSum += p;
      if (p >= 100 || e.status === 'Completed') {
        completedCertificates++;
      }
      if (p >= 80) {
        highAchieversCount++;
      }

      const course = courses.find((c) => String(c.id) === String(e.courseId));
      const modules = (course && Array.isArray(course.modules) && course.modules.length > 0)
        ? course.modules
        : DEFAULT_COURSE_MODULES;

      const cLessons = Array.isArray(e.completedLessons)
        ? e.completedLessons
        : modules.slice(0, Math.round((p / 100) * modules.length));

      totalCompletedLessons += cLessons.length;
      totalLessonsCount += modules.length;
    });

    const averageCompletionRate = Math.round(totalProgressSum / enrollments.length);
    const totalPendingLessons = Math.max(0, totalLessonsCount - totalCompletedLessons);

    return {
      totalEnrollments: enrollments.length,
      averageCompletionRate,
      totalCompletedLessons,
      totalPendingLessons,
      totalLessons: totalLessonsCount,
      completedCertificates,
      inProgressCount: enrollments.length - completedCertificates,
      highAchieversCount
    };
  }, [enrollments, courses]);

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setSortBy('name-asc');
    setCurrentPage(1);
  };

  // Filtered & Sorted courses memo
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // 1. Search Query (Title, Instructor, Category, Description)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.instructor?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((c) => c.category === selectedCategory);
    }

    // 3. Level Filter
    if (selectedLevel !== 'All') {
      result = result.filter((c) => c.level === selectedLevel);
    }

    // 4. Sort
    result.sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'name-desc') {
        return b.title.localeCompare(a.title);
      }
      if (sortBy === 'price-low') {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (sortBy === 'price-high') {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      if (sortBy === 'rating-high') {
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      }
      return 0;
    });

    return result;
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const paginatedCourses = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, safeCurrentPage, itemsPerPage]);

  return (
    <CourseContext.Provider
      value={{
        courses,
        loading,
        isSyncing,
        error,
        fetchCourses,
        syncCoursesFromApi,
        addCourse,
        updateCourse,
        deleteCourse,
        enrolledCourseIds,
        toggleEnrollment,
        enrollments,
        enrollStudent,
        removeEnrollment,
        isStudentEnrolled,
        enrollmentSummary,
        // Module 7: Learning Progress
        getCourseModules,
        resolveEnrollmentLessons,
        toggleLessonCompletion,
        updateEnrollmentProgress,
        markAllLessonsCompleted,
        resetEnrollmentProgress,
        learningProgressStatistics,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedLevel,
        setSelectedLevel,
        sortBy,
        setSortBy,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        filteredCourses,
        paginatedCourses,
        totalPages,
        resetFilters
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};
