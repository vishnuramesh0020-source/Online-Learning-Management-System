import { useState, useEffect, useMemo, useCallback } from 'react';
import { InstructorContext } from './contexts';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';
import { INITIAL_INSTRUCTORS } from '../utils/dummyData';
import { toast } from 'react-toastify';

export const InstructorProvider = ({ children }) => {
  const [instructors, setInstructors] = useState(() => {
    return getStorageItem(STORAGE_KEYS.INSTRUCTORS, INITIAL_INSTRUCTORS);
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  // Sync to localStorage
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.INSTRUCTORS, instructors);
  }, [instructors]);

  // Add Instructor
  const addInstructor = useCallback(async (data) => {
    const trimmedEmail = data.email?.trim().toLowerCase();

    if (instructors.some((i) => i.email?.trim().toLowerCase() === trimmedEmail)) {
      throw new Error('An instructor with this email address already exists.');
    }

    const newInstructor = {
      ...data,
      id: `inst_${Date.now()}`,
      name: data.name.trim(),
      email: trimmedEmail,
      experience: data.experience?.trim() || '1 Year',
      specialization: data.specialization?.trim() || 'General Studies',
      profileImage: data.profileImage?.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name.trim())}`,
      bio: data.bio?.trim() || 'Certified subject matter expert and dedicated online educator.',
      phone: data.phone?.trim() || '+1 (555) 000-0000',
      rating: 5.0,
      assignedCourses: Array.isArray(data.assignedCourses) ? data.assignedCourses : []
    };

    setInstructors((prev) => [newInstructor, ...prev]);
    toast.success(`Instructor "${newInstructor.name}" added successfully!`);
    return newInstructor;
  }, [instructors]);

  // Edit Instructor
  const updateInstructor = useCallback(async (id, data) => {
    const trimmedEmail = data.email ? data.email.trim().toLowerCase() : null;

    if (trimmedEmail && instructors.some((i) => String(i.id) !== String(id) && i.email?.trim().toLowerCase() === trimmedEmail)) {
      throw new Error('Another instructor with this email address already exists.');
    }

    let updatedRecord = null;
    setInstructors((prev) =>
      prev.map((inst) => {
        if (String(inst.id) === String(id)) {
          updatedRecord = {
            ...inst,
            ...data,
            name: data.name ? data.name.trim() : inst.name,
            email: trimmedEmail || inst.email,
            experience: data.experience ? data.experience.trim() : inst.experience,
            specialization: data.specialization ? data.specialization.trim() : inst.specialization,
            profileImage: data.profileImage ? data.profileImage.trim() : inst.profileImage,
            bio: data.bio !== undefined ? data.bio.trim() : inst.bio,
            phone: data.phone !== undefined ? data.phone.trim() : inst.phone,
            assignedCourses: Array.isArray(data.assignedCourses) ? data.assignedCourses : inst.assignedCourses
          };
          return updatedRecord;
        }
        return inst;
      })
    );

    if (updatedRecord) {
      toast.success(`Instructor "${updatedRecord.name}" updated successfully!`);
    }
    return updatedRecord;
  }, [instructors]);

  // Delete Instructor
  const deleteInstructor = useCallback(async (id) => {
    const instructorToDelete = instructors.find((i) => String(i.id) === String(id));
    setInstructors((prev) => prev.filter((i) => String(i.id) !== String(id)));
    toast.success(
      instructorToDelete
        ? `Instructor "${instructorToDelete.name}" removed.`
        : 'Instructor removed.'
    );
    return true;
  }, [instructors]);

  // Assign Courses to Instructor
  const assignCoursesToInstructor = useCallback(async (instructorId, courseIds) => {
    let targetName = '';
    setInstructors((prev) =>
      prev.map((inst) => {
        if (String(inst.id) === String(instructorId)) {
          targetName = inst.name;
          return {
            ...inst,
            assignedCourses: courseIds.map((cid) => Number(cid) || cid)
          };
        }
        return inst;
      })
    );
    toast.success(`Courses successfully assigned to ${targetName || 'Instructor'}!`);
    return true;
  }, []);

  // Get instructor by ID
  const getInstructorById = useCallback(
    (id) => instructors.find((i) => String(i.id) === String(id)),
    [instructors]
  );

  // Available specializations
  const specializations = useMemo(() => {
    const specs = new Set(instructors.map((i) => i.specialization).filter(Boolean));
    return ['All', ...Array.from(specs).sort()];
  }, [instructors]);

  // Filtered Instructors
  const filteredInstructors = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return instructors.filter((inst) => {
      // Search
      if (q) {
        const name = inst.name?.toLowerCase() || '';
        const email = inst.email?.toLowerCase() || '';
        const spec = inst.specialization?.toLowerCase() || '';
        const exp = inst.experience?.toLowerCase() || '';
        if (!name.includes(q) && !email.includes(q) && !spec.includes(q) && !exp.includes(q)) {
          return false;
        }
      }

      // Specialization
      if (selectedSpecialization !== 'All' && inst.specialization !== selectedSpecialization) {
        return false;
      }

      return true;
    });
  }, [instructors, searchQuery, selectedSpecialization]);

  return (
    <InstructorContext.Provider
      value={{
        instructors,
        filteredInstructors,
        searchQuery,
        setSearchQuery,
        selectedSpecialization,
        setSelectedSpecialization,
        specializations,
        addInstructor,
        updateInstructor,
        deleteInstructor,
        assignCoursesToInstructor,
        getInstructorById
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
};
