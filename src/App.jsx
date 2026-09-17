import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CourseListPage from './pages/courses/CourseListPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import EnrolledCoursesPage from './pages/courses/EnrolledCoursesPage';
import StudentListPage from './pages/students/StudentListPage';
import EnrollmentManagementPage from './pages/enrollments/EnrollmentManagementPage';
import LearningProgressPage from './pages/progress/LearningProgressPage';
import InstructorListPage from './pages/instructors/InstructorListPage';
import InstructorProfilePage from './pages/instructors/InstructorProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* Protected LMS Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/courses" element={<CourseListPage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/my-courses" element={<EnrolledCoursesPage />} />
          <Route path="/students" element={<StudentListPage />} />
          <Route path="/enrollments" element={<EnrollmentManagementPage />} />
          <Route path="/progress" element={<LearningProgressPage />} />
          <Route path="/instructors" element={<InstructorListPage />} />
          <Route path="/instructors/:id" element={<InstructorProfilePage />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

