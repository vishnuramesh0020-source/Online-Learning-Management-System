import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CourseProvider } from './context/CourseContext.jsx'
import { StudentProvider } from './context/StudentContext.jsx'
import { InstructorProvider } from './context/InstructorContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CourseProvider>
        <StudentProvider>
          <InstructorProvider>
            <App />
          </InstructorProvider>
        </StudentProvider>
      </CourseProvider>
    </AuthProvider>
  </StrictMode>,
)

