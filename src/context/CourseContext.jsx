import { createContext, useState, useEffect, useMemo } from 'react';
import { courseService } from '../api/courseService';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';

export const CourseContext = createContext(null);
export { useCourses } from './useCourses';

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    setStorageItem(STORAGE_KEYS.ENROLLED, enrolledCourseIds);
  }, [enrolledCourseIds]);

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

  // Toggle enrollment
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
        error,
        fetchCourses,
        addCourse,
        updateCourse,
        deleteCourse,
        enrolledCourseIds,
        toggleEnrollment,
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
