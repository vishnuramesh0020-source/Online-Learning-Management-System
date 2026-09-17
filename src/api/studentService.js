import axiosClient from './axiosClient.js';
import { INITIAL_STUDENTS } from '../utils/dummyData.js';
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '../utils/storage.js';

let inMemoryStudents = null;

const getCachedStudents = () => {
  const cached = getStorageItem(STORAGE_KEYS.STUDENTS);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    inMemoryStudents = cached;
    return cached;
  }
  return inMemoryStudents || INITIAL_STUDENTS;
};

const persistStudents = (data) => {
  inMemoryStudents = data;
  setStorageItem(STORAGE_KEYS.STUDENTS, data);
};

/**
 * Maps a DummyJSON user payload into the Education Pro Student schema.
 */
export const mapApiUserToStudent = (u) => {
  const addressParts = [];
  if (u.address) {
    if (u.address.address) addressParts.push(u.address.address);
    if (u.address.city) addressParts.push(u.address.city);
    if (u.address.state) addressParts.push(u.address.state);
  }
  const address = addressParts.length > 0
    ? addressParts.join(', ')
    : 'Richmond Road, Bangalore, Karnataka';

  const qualification = u.university
    ? `B.Tech / Graduate from ${u.university}`
    : 'B.Tech in Computer Science';

  // Deterministic enrollment date for realistic representation
  const day = String((Number(u.id) % 25) + 1).padStart(2, '0');
  const enrollmentDate = `2026-08-${day}`;

  const fullName = `${u.firstName || ''} ${u.lastName || ''}`.trim() || `Student ${u.id}`;

  return {
    id: `stu_api_${u.id}`,
    apiId: u.id,
    fullName,
    email: u.email || `student_${u.id}@educationpro.com`,
    phone: u.phone || '+1 555-0199',
    address,
    qualification,
    enrollmentDate,
    avatar: u.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
    isApi: true,
    source: 'DummyJSON'
  };
};

export const studentService = {
  /**
   * Fetch all students.
   * If local cache exists and forceSync is false, returns cached students.
   * Otherwise fetches live from https://dummyjson.com/users and merges with seed/custom data.
   */
  async getAllStudents(forceSync = false) {
    const cached = getStorageItem(STORAGE_KEYS.STUDENTS);

    if (!forceSync && cached && Array.isArray(cached) && cached.length > 0) {
      inMemoryStudents = cached;
      return cached;
    }

    try {
      // Live Third-Party API Request to DummyJSON
      const data = await axiosClient.get('/users?limit=15');
      const apiStudents = (data?.users || []).map(mapApiUserToStudent);

      // Preserve existing custom user-created students and seed students
      const existingStudents = cached && Array.isArray(cached) ? cached : (inMemoryStudents || INITIAL_STUDENTS);
      const customStudents = existingStudents.filter(
        (s) => !String(s.id).startsWith('stu_api_')
      );

      // Merge custom/initial students first, followed by live API students (avoiding duplicate emails)
      const seenEmails = new Set();
      const merged = [];

      for (const s of [...customStudents, ...apiStudents]) {
        const lowerEmail = (s.email || '').toLowerCase().trim();
        if (!seenEmails.has(lowerEmail)) {
          seenEmails.add(lowerEmail);
          merged.push(s);
        }
      }

      persistStudents(merged);
      return merged;
    } catch (err) {
      console.warn('Network request failed for students, using local cache / seeds:', err);
      const fallback = cached || inMemoryStudents || INITIAL_STUDENTS;
      persistStudents(fallback);
      return fallback;
    }
  },

  /**
   * Search students via DummyJSON remote search endpoint
   */
  async searchStudents(query) {
    if (!query || !query.trim()) {
      return this.getAllStudents();
    }

    const trimmed = query.trim().toLowerCase();

    try {
      // Remote search via DummyJSON API
      const res = await axiosClient.get(`/users/search?q=${encodeURIComponent(trimmed)}`);
      const remoteMatches = (res?.users || []).map(mapApiUserToStudent);

      // Also filter cached/local students for full coverage
      const local = getCachedStudents();
      const localMatches = local.filter((s) => {
        const name = (s.fullName || '').toLowerCase();
        const email = (s.email || '').toLowerCase();
        const phone = (s.phone || '').toLowerCase();
        const qual = (s.qualification || '').toLowerCase();
        return name.includes(trimmed) || email.includes(trimmed) || phone.includes(trimmed) || qual.includes(trimmed);
      });

      // Combine unique matches
      const seen = new Set();
      const combined = [];
      for (const item of [...remoteMatches, ...localMatches]) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          combined.push(item);
        }
      }
      return combined;
    } catch {
      const local = getCachedStudents();
      return local.filter((s) =>
        (s.fullName || '').toLowerCase().includes(trimmed) ||
        (s.email || '').toLowerCase().includes(trimmed)
      );
    }
  },

  /**
   * Create a student with remote POST request to DummyJSON
   */
  async createStudent(studentData) {
    const nameParts = (studentData.fullName || '').trim().split(' ');
    const firstName = nameParts[0] || 'Student';
    const lastName = nameParts.slice(1).join(' ') || '';

    let apiResponse = null;
    try {
      // Send real HTTP POST request to DummyJSON
      apiResponse = await axiosClient.post('/users/add', {
        firstName,
        lastName,
        email: studentData.email,
        phone: studentData.phone,
        university: studentData.qualification,
        address: { address: studentData.address }
      });
    } catch {
      // Fallback
    }

    const students = getCachedStudents();
    const newStudent = {
      ...studentData,
      id: `stu_${Date.now()}`,
      apiId: apiResponse?.id || null,
      fullName: studentData.fullName.trim(),
      email: studentData.email.trim().toLowerCase(),
      phone: studentData.phone.trim(),
      address: studentData.address.trim(),
      qualification: studentData.qualification.trim(),
      enrollmentDate: studentData.enrollmentDate || new Date().toISOString().split('T')[0],
      avatar: studentData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(studentData.fullName.trim())}`,
      isApi: Boolean(apiResponse),
      source: apiResponse ? 'DummyJSON API' : 'Local'
    };

    const updated = [newStudent, ...students];
    persistStudents(updated);
    return newStudent;
  },

  /**
   * Update student with remote PUT request to DummyJSON
   */
  async updateStudent(id, updatedFields) {
    try {
      // Dispatch remote PUT request to DummyJSON
      const rawId = String(id).replace('stu_api_', '').replace('stu_', '');
      const num = Number(rawId);
      const validId = (num > 0 && num <= 208) ? num : 1;
      await axiosClient.put(`/users/${validId}`, {
        firstName: updatedFields.fullName?.split(' ')[0] || 'Student',
        email: updatedFields.email,
        phone: updatedFields.phone
      }).catch(() => null);
    } catch {
      // Fallback
    }

    const students = getCachedStudents();
    const index = students.findIndex((s) => String(s.id) === String(id));
    if (index === -1) {
      throw new Error('Student not found for update');
    }

    const updatedStudent = {
      ...students[index],
      ...updatedFields,
      fullName: updatedFields.fullName ? updatedFields.fullName.trim() : students[index].fullName,
      email: updatedFields.email ? updatedFields.email.trim().toLowerCase() : students[index].email,
      phone: updatedFields.phone ? updatedFields.phone.trim() : students[index].phone,
      address: updatedFields.address ? updatedFields.address.trim() : students[index].address,
      qualification: updatedFields.qualification ? updatedFields.qualification.trim() : students[index].qualification
    };

    students[index] = updatedStudent;
    persistStudents([...students]);
    return updatedStudent;
  },

  /**
   * Delete student with remote DELETE request to DummyJSON
   */
  async deleteStudent(id) {
    try {
      // Dispatch remote DELETE request to DummyJSON
      const rawId = String(id).replace('stu_api_', '').replace('stu_', '');
      const num = Number(rawId);
      const validId = (num > 0 && num <= 208) ? num : 1;
      await axiosClient.delete(`/users/${validId}`).catch(() => null);
    } catch {
      // Fallback
    }

    const students = getCachedStudents();
    const filtered = students.filter((s) => String(s.id) !== String(id));
    persistStudents(filtered);
    return true;
  },

  /**
   * Explicitly force-sync students from the DummyJSON API
   */
  async syncFromApi() {
    return this.getAllStudents(true);
  }
};
