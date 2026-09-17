// LocalStorage management helper with error handling

export const STORAGE_KEYS = {
  AUTH_USER: 'lms_auth_user',
  USERS: 'lms_users',
  COURSES: 'lms_courses',
  ENROLLED: 'lms_enrolled_courses',
  STUDENTS: 'lms_students_v1',
  INSTRUCTORS: 'lms_instructors_v1',
  ENROLLMENTS: 'lms_enrollments_v1',
};

export const getStorageItem = (key, fallback = null) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return fallback;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return fallback;
  }
};

export const setStorageItem = (key, value) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
  }
};

export const removeStorageItem = (key) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage`, error);
  }
};
