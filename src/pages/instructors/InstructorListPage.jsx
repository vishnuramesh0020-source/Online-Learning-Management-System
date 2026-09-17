import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInstructors } from '../../context/useInstructors';
import InstructorFormModal from '../../components/instructors/InstructorFormModal';
import AssignCourseModal from '../../components/instructors/AssignCourseModal';
import Modal from '../../components/common/Modal';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Briefcase, 
  Star, 
  BookOpen, 
  Edit2, 
  Trash2, 
  ArrowUpRight, 
  X,
  Award
} from 'lucide-react';

const InstructorListPage = () => {
  const {
    instructors,
    filteredInstructors,
    searchQuery,
    setSearchQuery,
    selectedSpecialization,
    setSelectedSpecialization,
    specializations,
    addInstructor,
    updateInstructor,
    deleteInstructor
  } = useInstructors();

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [instructorToAssign, setInstructorToAssign] = useState(null);
  const [instructorToDelete, setInstructorToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingInstructor(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (inst) => {
    setEditingInstructor(inst);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingInstructor) {
        await updateInstructor(editingInstructor.id, formData);
      } else {
        await addInstructor(formData);
      }
      setIsFormModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!instructorToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteInstructor(instructorToDelete.id);
      setInstructorToDelete(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Faculty & Mentors</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Instructor Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage instructors, course assignments, professional backgrounds, and profile pages.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Instructor</span>
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Instructors
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">{instructors.length}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Senior educators & industry leads</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average Experience
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">11+ Years</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Top-tier academic & tech experience</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Specialized Fields
            </p>
            <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
              {specializations.filter((s) => s !== 'All').length}
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Distinct disciplines taught</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, specialization, experience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec}>
                {spec === 'All' ? 'All Specializations' : spec}
              </option>
            ))}
          </select>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {filteredInstructors.length} {filteredInstructors.length === 1 ? 'instructor' : 'instructors'}
          </span>
        </div>
      </div>

      {/* Instructors Grid */}
      {filteredInstructors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Instructors Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery || selectedSpecialization !== 'All'
              ? 'No instructor matches your current filters. Try resetting search.'
              : 'No instructors have been added yet.'}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Add First Instructor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstructors.map((inst) => {
            const courseCount = Array.isArray(inst.assignedCourses) ? inst.assignedCourses.length : 0;

            return (
              <div
                key={inst.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Profile Top Bar */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="relative">
                        <img
                          src={inst.profileImage}
                          alt={inst.name}
                          className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm bg-slate-100"
                          onError={(e) => {
                            e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(inst.name)}`;
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow-xs">
                          <Star className="w-2.5 h-2.5 fill-current" />
                          <span>{inst.rating || '4.9'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setInstructorToAssign(inst)}
                          title="Assign Courses"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(inst)}
                          title="Edit Instructor"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setInstructorToDelete(inst)}
                          title="Delete Instructor"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <Link to={`/instructors/${inst.id}`}>
                      <h3 className="font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">
                        {inst.name}
                      </h3>
                    </Link>

                    <div className="inline-block mt-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-semibold">
                      {inst.specialization}
                    </div>

                    <p className="text-xs text-slate-500 mt-2.5 line-clamp-2 leading-relaxed">
                      {inst.bio || 'Experienced educator committed to student success and practical skills.'}
                    </p>

                    {/* Meta Specs */}
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Experience
                        </span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                          {inst.experience}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Assigned Courses
                        </span>
                        <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                          {courseCount} {courseCount === 1 ? 'Course' : 'Courses'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 truncate max-w-[140px]" title={inst.email}>
                      {inst.email}
                    </span>

                    <Link
                      to={`/instructors/${inst.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      <span>View Profile</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Instructor Modal */}
      {isFormModalOpen && (
        <InstructorFormModal
          key={editingInstructor ? editingInstructor.id : 'new_inst'}
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          instructor={editingInstructor}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Assign Courses Modal */}
      {instructorToAssign && (
        <AssignCourseModal
          key={instructorToAssign.id}
          isOpen={Boolean(instructorToAssign)}
          onClose={() => setInstructorToAssign(null)}
          instructor={instructorToAssign}
        />
      )}

      {/* Delete Instructor Modal */}
      <Modal
        isOpen={Boolean(instructorToDelete)}
        onClose={() => setInstructorToDelete(null)}
        title="Delete Instructor Profile"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Are you sure you want to remove{' '}
            <span className="font-bold text-slate-900">{instructorToDelete?.name}</span>? Courses assigned to this instructor will require reassignment.
          </p>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setInstructorToDelete(null)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              {isSubmitting ? 'Deleting...' : 'Yes, Delete Instructor'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InstructorListPage;
