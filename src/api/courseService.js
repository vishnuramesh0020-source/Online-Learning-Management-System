import axiosClient from './axiosClient';
import { INITIAL_COURSES } from '../utils/dummyData';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage';

export const courseService = {
  // Fetch all courses
  async getAllCourses() {
    const cached = getStorageItem(STORAGE_KEYS.COURSES);
    if (cached && cached.length > 0) {
      return cached;
    }

    try {
      // Fetch sample data from third-party API (DummyJSON)
      // Map DummyJSON products to course structure if needed, or seed INITIAL_COURSES
      await axiosClient.get('/products?limit=5');
      setStorageItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
      return INITIAL_COURSES;
    } catch (err) {
      console.warn('Network request fallback to seed data', err);
      setStorageItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
      return INITIAL_COURSES;
    }
  },

  // Get single course by id
  async getCourseById(id) {
    const courses = await this.getAllCourses();
    const course = courses.find((c) => String(c.id) === String(id));
    if (!course) {
      throw new Error(`Course with ID ${id} not found`);
    }
    return course;
  },

  // Create new course
  async createCourse(newCourse) {
    try {
      // Simulate remote POST request via Axios
      await axiosClient.post('/products/add', {
        title: newCourse.title,
        price: newCourse.price,
        description: newCourse.description,
      }).catch(() => null);
    } catch {
      // Fallback
    }

    const courses = getStorageItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const created = {
      ...newCourse,
      id: Date.now(),
      rating: newCourse.rating ? Number(newCourse.rating) : 4.5,
      price: newCourse.price ? Number(newCourse.price) : 0,
      enrolledStudents: 0,
      modules: newCourse.modules || [
        "Course Overview & Prerequisites",
        "Core Concepts & Architecture",
        "Hands-on Practical Lab Exercises",
        "Final Assessment & Capstone"
      ]
    };

    const updated = [created, ...courses];
    setStorageItem(STORAGE_KEYS.COURSES, updated);
    return created;
  },

  // Update existing course
  async updateCourse(id, updatedFields) {
    try {
      // Simulate remote PUT request
      await axiosClient.put(`/products/${id}`, updatedFields).catch(() => null);
    } catch {
      // Fallback
    }

    const courses = getStorageItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const index = courses.findIndex((c) => String(c.id) === String(id));
    if (index === -1) {
      throw new Error("Course not found for update");
    }

    const updatedCourse = {
      ...courses[index],
      ...updatedFields,
      price: Number(updatedFields.price),
      rating: Number(updatedFields.rating || courses[index].rating)
    };

    courses[index] = updatedCourse;
    setStorageItem(STORAGE_KEYS.COURSES, [...courses]);
    return updatedCourse;
  },

  // Delete course
  async deleteCourse(id) {
    try {
      // Simulate remote DELETE request
      await axiosClient.delete(`/products/${id}`).catch(() => null);
    } catch {
      // Fallback
    }

    const courses = getStorageItem(STORAGE_KEYS.COURSES, INITIAL_COURSES);
    const filtered = courses.filter((c) => String(c.id) !== String(id));
    setStorageItem(STORAGE_KEYS.COURSES, filtered);
    return true;
  }
};
