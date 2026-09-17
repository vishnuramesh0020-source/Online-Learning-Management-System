import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCourses } from '../../context/useCourses';
import CourseCard from '../../components/courses/CourseCard';
import CourseFilter from '../../components/courses/CourseFilter';
import CourseFormModal from '../../components/courses/CourseFormModal';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import { CourseCardSkeleton } from '../../components/common/LoadingSkeleton';
import {
  PlusCircle,
  AlertCircle,
  RefreshCw,
  LayoutGrid,
  List,
  Trash2,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-toastify';

const CourseListPage = () => {
  const location = useLocation();
  const { canManageCourses } = useAuth();
  const {
    loading,
    isSyncing,
    error,
    filteredCourses,
    paginatedCourses,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    fetchCourses,
    syncCoursesFromApi,
    deleteCourse,
    resetFilters
  } = useCourses();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isAddModalOpen, setIsAddModalOpen] = useState(
    Boolean(location.state?.openAddModal)
  );
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Edit action
  const handleEditClick = (course) => {
    setCourseToEdit(course);
  };

  // Delete action confirmation
  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    setDeleting(true);
    try {
      await deleteCourse(courseToDelete.id);
      toast.success(`Course "${courseToDelete.title}" deleted successfully.`);
      setCourseToDelete(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete course');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Catalog</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>DummyJSON API Live</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Course Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search, edit, or create industry-leading courses connected to third-party REST API.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Grid / List Switcher */}
          <div className="hidden sm:inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sync from Third-Party API Button */}
          <button
            type="button"
            onClick={syncCoursesFromApi}
            disabled={isSyncing}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
            title="Fetch live courses from DummyJSON Third-Party REST API"
          >
            <RefreshCw className={`w-4 h-4 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync API Courses'}</span>
          </button>

          {/* Add Course Trigger (Instructors only) */}
          {canManageCourses && (
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <CourseFilter />

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchCourses}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : paginatedCourses.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto my-8">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Courses Found</h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            We couldn&apos;t find any courses matching your search query or selected filters. Try
            adjusting your keywords or reset all filters.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              Reset Filters
            </button>
            {canManageCourses && (
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
              >
                Add New Course
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Course Grid / List */
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {paginatedCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={handleEditClick}
              onDelete={(c) => setCourseToDelete(c)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredCourses.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          totalItems={filteredCourses.length}
          itemsPerPage={itemsPerPage}
        />
      )}

      {/* Add Course Modal */}
      {isAddModalOpen && (
        <CourseFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {/* Edit Course Modal */}
      {courseToEdit && (
        <CourseFormModal
          isOpen={Boolean(courseToEdit)}
          onClose={() => setCourseToEdit(null)}
          courseToEdit={courseToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(courseToDelete)}
        onClose={() => setCourseToDelete(null)}
        title="Confirm Deletion"
        maxWidth="max-w-md"
      >
        <div className="text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto mb-3">
            <Trash2 className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-900">Delete Course</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-800">
              &quot;{courseToDelete?.title}&quot;
            </span>
            ? This action cannot be undone.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCourseToDelete(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {deleting ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Delete Course</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CourseListPage;
