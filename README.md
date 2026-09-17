# Education Pro — Online Learning Management System (LMS)

A modern, full-featured **Online Learning Management System** built with **React 19**, **Vite**, **Tailwind CSS v4**, and integrated with **Third-Party REST APIs (DummyJSON)**.

---

## 🌟 Key Features & Modules

### 1. Authentication & Role Management (`/login`, `/register`, `/forgot-password`)
- Clean, responsive authentication views with split-screen hero artwork.
- Role-based experience for **Students** and **Instructors**.
- Quick demo logins for fast testing.
- Form validation via `react-hook-form` and password matching.
- Google Sign-In simulation.

### 2. Learning Dashboard (`/dashboard`)
- Dynamic KPI stat cards: Total Courses, Active Students, Verified Instructors, Enrolled Courses, and Completed Courses.
- In-progress course tracker with dynamic progress bars and instant resume shortcuts.
- Upcoming live virtual classes feed with instant "Join Class" actions.
- Live activity audit log and interactive quick actions shortcuts.

### 3. Course Management & Third-Party API Integration (`/courses`, `/courses/:id`)
- Course catalog with dual Grid / List view switcher.
- **Third-Party API Integration**: Live sync with [DummyJSON Products API](https://dummyjson.com/products) with fallback to local persistent storage.
- Real-time search, category pill filters, course level filters (Beginner, Intermediate, Advanced), and multi-criteria sorting.
- Course CRUD: Add new courses, update curriculum/pricing/instructor, and soft/hard deletion with confirmation dialogs.
- Detailed course view with module breakdown, syllabus details, and enrollment status.

### 4. Student Management (`/students`)
- Full student CRUD with fields: **Full Name**, **Email**, **Mobile Number**, **Address**, **Qualification**, and **Enrollment Date**.
- **Third-Party API Integration**: Live sync with [DummyJSON Users API](https://dummyjson.com/users).
- Real-time search by student name, email, phone, address, or qualification.
- Responsive table with student avatars, badges, pagination, and edit/delete modals.

### 5. Course Enrollment Ledger (`/enrollments`, `/my-courses`)
- Enroll students into courses with duplicate enrollment protection.
- Track enrollment date, student details, course title, and live learning progress.
- Enrollment summary metrics (Total Enrollments, Active Learners, Completed Courses, Top Enrolled Course).
- Search, filter by status (In Progress, Active, Completed), course, or enrollment date.
- Dedicated "My Enrolled Courses" view for learner accounts.

### 6. Instructor Management (`/instructors`, `/instructors/:id`)
- Full instructor CRUD: Name, Email, Phone, Experience, Specialization, Profile Image, and Bio.
- Instructor course assignment: Assign single or multiple courses to faculty mentors.
- Comprehensive Instructor Profile Page displaying assigned cohorts and bio.
- Filter instructors by specialization and search by qualifications.

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Run Linter
```bash
npm run lint
```

### 4. Build for Production
```bash
npm run build
```

