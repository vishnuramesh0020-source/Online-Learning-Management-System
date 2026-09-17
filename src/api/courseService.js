import axiosClient from './axiosClient.js';
import { INITIAL_COURSES } from '../utils/dummyData.js';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage.js';

let inMemoryCourses = null;

const getCachedCourses = () => {
  const cached = getStorageItem(STORAGE_KEYS.COURSES);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    inMemoryCourses = cached;
    return cached;
  }
  return inMemoryCourses || INITIAL_COURSES;
};

const persistCourses = (data) => {
  inMemoryCourses = data;
  setStorageItem(STORAGE_KEYS.COURSES, data);
};

/**
 * Maps a DummyJSON product into the Education Pro Course schema.
 */
export const mapApiProductToCourse = (p) => {
  const categoryMap = {
    beauty: 'Design & Aesthetics',
    fragrances: 'Product Development',
    furniture: 'UI/UX Design',
    laptops: 'Cloud & DevOps',
    smartphones: 'Mobile Development',
    tablets: 'Web Development',
  };

  const instructors = [
    'Dr. Sarah Jenkins',
    'Prof. Michael Chen',
    'Elena Rostova',
    'David Miller',
    'Sophia Rodriguez',
    'Dr. Alan Vance'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const instructorName = instructors[p.id % instructors.length];
  const assignedLevel = levels[p.id % levels.length];
  const assignedCategory = categoryMap[p.category] || 'Web Development';

  return {
    id: `api_crs_${p.id}`,
    apiId: p.id,
    title: `${p.title} Professional Specialization`,
    instructor: instructorName,
    instructorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(instructorName)}`,
    category: assignedCategory,
    duration: `${((p.id * 7) % 30) + 15} Hours`,
    level: assignedLevel,
    price: Number(p.price) || 49.99,
    description: p.description || 'Hands-on curriculum with practical assignments, industry projects, and career mentoring.',
    rating: Number(p.rating) ? Math.min(5.0, Math.max(3.8, Number(p.rating))).toFixed(1) : 4.8,
    thumbnail: p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    enrolledStudents: ((p.id * 233) % 2500) + 420,
    modules: [
      `${p.title} Fundamentals & Tooling`,
      'Architectural Foundations & Standards',
      'Hands-on Practical Labs and Real-World Projects',
      'Production Deployment and Capstone Certification'
    ],
    isApi: true,
    source: 'DummyJSON'
  };
};

export const courseService = {
  /**
   * Fetch all courses.
   * If local cache exists and forceSync is false, returns cached courses.
   * Otherwise fetches live from https://dummyjson.com/products and combines with seed courses.
   */
  async getAllCourses(forceSync = false) {
    const cached = getStorageItem(STORAGE_KEYS.COURSES);

    if (!forceSync && cached && Array.isArray(cached) && cached.length > 0) {
      inMemoryCourses = cached;
      return cached;
    }

    try {
      // Live Third-Party API Request to DummyJSON
      const data = await axiosClient.get('/products?limit=8');
      const apiCourses = (data?.products || []).map(mapApiProductToCourse);

      // Preserve custom user-created courses and the core INITIAL_COURSES (which link to enrollments & instructors)
      const existing = cached && Array.isArray(cached) ? cached : (inMemoryCourses || INITIAL_COURSES);
      const coreAndCustom = existing.filter((c) => !String(c.id).startsWith('api_crs_'));

      const merged = [...coreAndCustom, ...apiCourses];
      persistCourses(merged);
      return merged;
    } catch (err) {
      console.warn('Network request failed for courses, using seed data:', err);
      const fallback = cached && cached.length > 0 ? cached : (inMemoryCourses || INITIAL_COURSES);
      persistCourses(fallback);
      return fallback;
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

  /**
   * Search courses with remote DummyJSON endpoint
   */
  async searchCourses(query) {
    if (!query || !query.trim()) {
      return this.getAllCourses();
    }

    const trimmed = query.trim().toLowerCase();

    try {
      // Live Third-Party API Search
      const res = await axiosClient.get(`/products/search?q=${encodeURIComponent(trimmed)}`);
      const remoteMatches = (res?.products || []).map(mapApiProductToCourse);

      const local = getCachedCourses();
      const localMatches = local.filter((c) =>
        (c.title || '').toLowerCase().includes(trimmed) ||
        (c.instructor || '').toLowerCase().includes(trimmed) ||
        (c.category || '').toLowerCase().includes(trimmed)
      );

      const seen = new Set();
      const combined = [];
      for (const item of [...localMatches, ...remoteMatches]) {
        if (!seen.has(String(item.id))) {
          seen.add(String(item.id));
          combined.push(item);
        }
      }
      return combined;
    } catch {
      const local = getCachedCourses();
      return local.filter((c) =>
        (c.title || '').toLowerCase().includes(trimmed) ||
        (c.category || '').toLowerCase().includes(trimmed)
      );
    }
  },

  // Create new course with remote DummyJSON POST
  async createCourse(newCourse) {
    let apiResponse = null;
    try {
      // Live HTTP POST to DummyJSON
      apiResponse = await axiosClient.post('/products/add', {
        title: newCourse.title,
        price: Number(newCourse.price) || 0,
        description: newCourse.description,
        category: newCourse.category
      });
    } catch {
      // Fallback
    }

    const courses = getCachedCourses();
    const created = {
      ...newCourse,
      id: Date.now(),
      apiId: apiResponse?.id || null,
      rating: newCourse.rating ? Number(newCourse.rating) : 4.8,
      price: newCourse.price ? Number(newCourse.price) : 0,
      enrolledStudents: 0,
      modules: newCourse.modules || [
        'Course Overview & Prerequisites',
        'Core Concepts & Architecture',
        'Hands-on Practical Lab Exercises',
        'Final Assessment & Capstone'
      ],
      isApi: Boolean(apiResponse),
      source: apiResponse ? 'DummyJSON API' : 'Local'
    };

    const updated = [created, ...courses];
    persistCourses(updated);
    return created;
  },

  // Update existing course with remote DummyJSON PUT
  async updateCourse(id, updatedFields) {
    try {
      const num = Number(String(id).replace('api_crs_', ''));
      const validId = (num > 0 && num <= 194) ? num : 1;
      await axiosClient.put(`/products/${validId}`, {
        title: updatedFields.title,
        price: updatedFields.price
      }).catch(() => null);
    } catch {
      // Fallback
    }

    const courses = getCachedCourses();
    const index = courses.findIndex((c) => String(c.id) === String(id));
    if (index === -1) {
      throw new Error('Course not found for update');
    }

    const updatedCourse = {
      ...courses[index],
      ...updatedFields,
      price: Number(updatedFields.price),
      rating: Number(updatedFields.rating || courses[index].rating)
    };

    courses[index] = updatedCourse;
    persistCourses([...courses]);
    return updatedCourse;
  },

  // Delete course with remote DummyJSON DELETE
  async deleteCourse(id) {
    try {
      const num = Number(String(id).replace('api_crs_', ''));
      const validId = (num > 0 && num <= 194) ? num : 1;
      await axiosClient.delete(`/products/${validId}`).catch(() => null);
    } catch {
      // Fallback
    }

    const courses = getCachedCourses();
    const filtered = courses.filter((c) => String(c.id) !== String(id));
    persistCourses(filtered);
    return true;
  },

  // Force-sync courses from DummyJSON API
  async syncFromApi() {
    return this.getAllCourses(true);
  }
};
