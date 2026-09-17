import { useState, useEffect, useMemo, useCallback } from 'react';
import { StudentContext } from './contexts';
import { studentService } from '../api/studentService';
import { getStorageItem, STORAGE_KEYS } from '../utils/storage';
import { INITIAL_STUDENTS } from '../utils/dummyData';
import { toast } from 'react-toastify';

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState(() => {
    return getStorageItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Initial load: fetch from studentService (syncs with DummyJSON if needed)
  useEffect(() => {
    let active = true;
    studentService.getAllStudents()
      .then((data) => {
        if (active && data && data.length > 0) {
          setStudents(data);
        }
      })
      .catch((err) => {
        console.warn('Could not initialize students from service:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  // Explicit sync from DummyJSON third-party API
  const syncStudentsFromApi = useCallback(async () => {
    setIsSyncing(true);
    try {
      const freshStudents = await studentService.syncFromApi();
      setStudents(freshStudents);
      toast.success(`Synced ${freshStudents.length} students live from DummyJSON API!`);
      return freshStudents;
    } catch (err) {
      toast.error('Failed to sync students from API. Using local cache.');
      throw err;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Add Student (dispatches remote POST to DummyJSON)
  const addStudent = useCallback(async (studentData) => {
    const trimmedEmail = studentData.email?.trim().toLowerCase();
    
    // Check email uniqueness
    if (students.some((s) => s.email?.trim().toLowerCase() === trimmedEmail)) {
      throw new Error('A student with this email address is already registered.');
    }

    try {
      const createdStudent = await studentService.createStudent(studentData);
      setStudents((prev) => [createdStudent, ...prev.filter((s) => s.id !== createdStudent.id)]);
      toast.success(`Student "${createdStudent.fullName}" added successfully!`);
      return createdStudent;
    } catch (err) {
      toast.error(err.message || 'Failed to add student');
      throw err;
    }
  }, [students]);

  // Update Student (dispatches remote PUT to DummyJSON)
  const updateStudent = useCallback(async (id, updatedData) => {
    const trimmedEmail = updatedData.email ? updatedData.email.trim().toLowerCase() : null;

    // Check email uniqueness among other students
    if (trimmedEmail && students.some((s) => String(s.id) !== String(id) && s.email?.trim().toLowerCase() === trimmedEmail)) {
      throw new Error('Another student with this email address already exists.');
    }

    try {
      const updated = await studentService.updateStudent(id, updatedData);
      setStudents((prev) =>
        prev.map((s) => (String(s.id) === String(id) ? updated : s))
      );
      toast.success(`Student "${updated.fullName}" updated successfully!`);
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update student');
      throw err;
    }
  }, [students]);

  // Delete Student (dispatches remote DELETE to DummyJSON)
  const deleteStudent = useCallback(async (id) => {
    const studentToDelete = students.find((s) => String(s.id) === String(id));
    try {
      await studentService.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => String(s.id) !== String(id)));
      toast.success(
        studentToDelete
          ? `Student "${studentToDelete.fullName}" removed successfully.`
          : 'Student removed successfully.'
      );
      return true;
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
      throw err;
    }
  }, [students]);

  // Get student by ID
  const getStudentById = useCallback(
    (id) => students.find((s) => String(s.id) === String(id)),
    [students]
  );

  // Filtered Students
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return students;

    return students.filter((s) => {
      const name = s.fullName?.toLowerCase() || '';
      const email = s.email?.toLowerCase() || '';
      const phone = s.phone?.toLowerCase() || '';
      const address = s.address?.toLowerCase() || '';
      const qualification = s.qualification?.toLowerCase() || '';
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        address.includes(q) ||
        qualification.includes(q)
      );
    });
  }, [students, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / itemsPerPage));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedStudents = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, safeCurrentPage, itemsPerPage]);

  return (
    <StudentContext.Provider
      value={{
        students,
        loading: false,
        isSyncing,
        syncStudentsFromApi,
        filteredStudents,
        paginatedStudents,
        searchQuery,
        setSearchQuery,
        currentPage: safeCurrentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        totalPages,
        totalStudents: filteredStudents.length,
        addStudent,
        updateStudent,
        deleteStudent,
        getStudentById
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
