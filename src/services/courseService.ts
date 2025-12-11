/**
 * Course Service
 * Handles all course-related API calls
 */

import api from '@/lib/axios';
import authService from './authService';

// ==================== Course Types ====================

export interface Course {
  id: number;
  title: string;
  description?: string;
  thumbnail?: string; // For POST/PUT requests (base64 data URL)
  thumbnail_url?: string; // For GET responses (image URL from backend)
  published: boolean;
  certificate_enabled: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  chapters_count?: number;
  lessons_count?: number;
  assigned_staff_ids?: number[];
}

export interface CourseResponse {
  success: boolean;
  message: string;
  data: Course;
}

export interface CourseListResponse {
  success: boolean;
  message: string;
  data: Course[];
  count: number;
  page?: number;
  limit?: number;
  total_pages?: number;
}

export interface CourseWithChapters extends Course {
  chapters: Chapter[];
  assigned_staff_ids: number[];
  assigned_staff?: Array<{
    id: number;
    fullname: string;
    username: string;
    email: string;
  }>;
}

// ==================== Chapter Types ====================

export interface Chapter {
  id: number;
  course_id: number;
  title: string;
  description?: string;
  order: number;
  is_active: boolean;
  lessons_count?: number;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface ChapterResponse {
  success: boolean;
  message: string;
  data: Chapter;
}

export interface ChapterListResponse {
  success: boolean;
  message: string;
  data: Chapter[];
  count: number;
}

// ==================== Lesson Types ====================

export type LessonType = 'text' | 'pdf' | 'quiz';

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string | number;
  points: number;
}

export interface QuizData {
  questions: QuizQuestion[];
  passing_score: number;
}

export interface Lesson {
  id: number;
  chapter_id: number;
  course_id: number;
  title: string;
  description?: string;
  order: number;
  is_active: boolean;
  lesson_type?: LessonType;
  content?: string;
  pdf_url?: string;
  quiz_data?: QuizData;
  is_prerequisite?: boolean;
  is_free_preview?: boolean;
  created_at: string;
  updated_at: string;
}

export interface LessonResponse {
  success: boolean;
  message: string;
  data: Lesson;
}

export interface LessonListResponse {
  success: boolean;
  message: string;
  data: Lesson[];
  count: number;
}

// ==================== Progress Types ====================

export interface CourseProgress {
  course_id: number;
  course_name: string;
  staff_name: string;
  staff_id: number;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  enrollment_date: string | null;
  completion_date: string | null;
}

export interface CourseProgressResponse {
  success: boolean;
  message: string;
  data: CourseProgress[];
  count: number;
}

export interface UserCourseProgressResponse {
  success: boolean;
  message: string;
  data: {
    course_id: number;
    course_title: string;
    user_id: number;
    user_name: string;
    total_lessons: number;
    completed_lessons: number;
    progress_percentage: number;
    is_completed: boolean;
    enrollment_date: string | null;
    completion_date: string | null;
    completed_lesson_ids: number[];
  };
}

export interface MarkLessonCompleteResponse {
  success: boolean;
  message: string;
  data: {
    course_id: number;
    lesson_id: number;
    user_id: number;
    completed_at: string;
    is_course_completed: boolean;
  };
}

// ==================== Assignment Types ====================

export interface AssignStaffRequest {
  staff_ids: number[];
}

export interface AssignStaffResponse {
  success: boolean;
  message: string;
  data: {
    course_id: number;
    assigned_staff_ids: number[];
    assigned_count: number;
  };
}

class CourseService {
  // ==================== Course Management ====================

  /**
   * Get all courses
   */
  async getAllCourses(params?: {
    status?: 'all' | 'published' | 'draft';
    assignedTo?: number;
    page?: number;
    limit?: number;
  }): Promise<CourseListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.assignedTo) queryParams.append('assignedTo', params.assignedTo.toString());
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/courses${queryString ? `?${queryString}` : ''}`;
    const response = await api.get<CourseListResponse>(url);
    return response.data;
  }

  /**
   * Get course by ID (with chapters and lessons)
   */
  async getCourseById(id: number): Promise<CourseResponse> {
    const response = await api.get<CourseResponse>(`/courses/${id}`);
    return response.data;
  }

  /**
   * Create a new course
   * thumbnail should be in data URL format: "data:image/png;base64,iVBORw0KG..."
   */
  async createCourse(data: {
    title: string;
    description?: string;
    thumbnail?: string;
    published?: boolean;
    certificate_enabled?: boolean;
    assigned_staff_ids?: number[];
  }): Promise<CourseResponse> {
    const response = await api.post<CourseResponse>('/courses', data);
    return response.data;
  }

  /**
   * Update a course
   * thumbnail should be in data URL format: "data:image/png;base64,iVBORw0KG..."
   */
  async updateCourse(id: number, data: {
    title?: string;
    description?: string;
    thumbnail?: string;
    published?: boolean;
    certificate_enabled?: boolean;
    assigned_staff_ids?: number[];
  }): Promise<CourseResponse> {
    const response = await api.put<CourseResponse>(`/courses/${id}`, data);
    return response.data;
  }

  /**
   * Delete a course
   */
  async deleteCourse(id: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/courses/${id}`);
    return response.data;
  }

  // ==================== Chapter Management ====================

  /**
   * Get chapters by course
   */
  async getChaptersByCourse(courseId: number): Promise<ChapterListResponse> {
    const response = await api.get<ChapterListResponse>(`/courses/${courseId}/chapters`);
    return response.data;
  }

  /**
   * Create a chapter
   */
  async createChapter(courseId: number, data: {
    title: string;
    description?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<ChapterResponse> {
    const response = await api.post<ChapterResponse>(`/courses/${courseId}/chapters`, data);
    return response.data;
  }

  /**
   * Update a chapter
   */
  async updateChapter(courseId: number, chapterId: number, data: {
    title?: string;
    description?: string;
    order?: number;
    is_active?: boolean;
  }): Promise<ChapterResponse> {
    const response = await api.put<ChapterResponse>(`/courses/${courseId}/chapters/${chapterId}`, data);
    return response.data;
  }

  /**
   * Delete a chapter
   */
  async deleteChapter(courseId: number, chapterId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/courses/${courseId}/chapters/${chapterId}`);
    return response.data;
  }

  // ==================== Lesson Management ====================

  /**
   * Get lessons by chapter
   */
  async getLessonsByChapter(courseId: number, chapterId: number): Promise<LessonListResponse> {
    const response = await api.get<LessonListResponse>(`/courses/${courseId}/chapters/${chapterId}/lessons`);
    return response.data;
  }

  /**
   * Create a lesson
   */
  async createLesson(courseId: number, chapterId: number, data: {
    title: string;
    description?: string;
    order?: number;
    is_active?: boolean;
    lesson_type?: LessonType;
    content?: string;
    pdf?: string; // Base64 PDF data URL
    pdf_url?: string;
    quiz_data?: QuizData;
    is_prerequisite?: boolean;
    is_free_preview?: boolean;
  }): Promise<LessonResponse> {
    const response = await api.post<LessonResponse>(`/courses/${courseId}/chapters/${chapterId}/lessons`, data);
    return response.data;
  }

  /**
   * Update a lesson
   */
  async updateLesson(courseId: number, chapterId: number, lessonId: number, data: {
    title?: string;
    description?: string;
    order?: number;
    is_active?: boolean;
    lesson_type?: LessonType;
    content?: string;
    pdf?: string; // Base64 PDF data URL
    pdf_url?: string;
    quiz_data?: QuizData;
    is_prerequisite?: boolean;
    is_free_preview?: boolean;
  }): Promise<LessonResponse> {
    const response = await api.put<LessonResponse>(`/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, data);
    return response.data;
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(courseId: number, chapterId: number, lessonId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
    return response.data;
  }

  // ==================== Progress Tracking ====================

  /**
   * Mark a lesson as completed
   */
  async markLessonComplete(courseId: number, lessonId: number, userId?: number): Promise<MarkLessonCompleteResponse> {
    const user = authService.getUserData();
    const targetUserId = userId || user?.id;
    
    const response = await api.post<MarkLessonCompleteResponse>(
      `/courses/${courseId}/lessons/${lessonId}/complete`,
      { user_id: targetUserId }
    );
    return response.data;
  }

  /**
   * Get all progress for a specific user (across all their courses)
   * Used for Progress Dashboard
   */
  async getAllUserProgress(userId: number): Promise<CourseProgressResponse> {
    const response = await api.get<CourseProgressResponse>(`/courses/progress/user/${userId}`);
    return response.data;
  }

  /**
   * Get progress for all users in a specific course (Admin)
   */
  async getCourseProgressForAllUsers(courseId: number, staffId?: number, status?: string): Promise<CourseProgressResponse> {
    const params = new URLSearchParams();
    if (staffId) params.append('staff_id', staffId.toString());
    if (status) params.append('status', status);
    
    const queryString = params.toString();
    const url = `/courses/${courseId}/progress${queryString ? `?${queryString}` : ''}`;
    const response = await api.get<CourseProgressResponse>(url);
    return response.data;
  }

  /**
   * Get progress for a specific user in a specific course
   */
  async getUserCourseProgress(courseId: number, userId: number): Promise<UserCourseProgressResponse> {
    const response = await api.get<UserCourseProgressResponse>(`/courses/${courseId}/progress/${userId}`);
    return response.data;
  }

  /**
   * Get all courses progress (aggregated for admin dashboard)
   * Fetches all courses and aggregates their progress data
   */
  async getAllCoursesProgress(): Promise<CourseProgressResponse> {
    try {
      // First, get all courses
      const coursesResponse = await api.get<{
        success: boolean;
        data: Array<{ id: number; title: string }>;
      }>('/courses?status=all&limit=1000');

      if (!coursesResponse.data.success || !coursesResponse.data.data) {
        return {
          success: false,
          message: 'Failed to fetch courses',
          data: [],
          count: 0,
        };
      }

      // Fetch progress for each course and aggregate
      const allProgress: CourseProgress[] = [];
      
      await Promise.all(
        coursesResponse.data.data.map(async (course) => {
          try {
            const progressResponse = await this.getCourseProgressForAllUsers(course.id);
            if (progressResponse.success && progressResponse.data) {
              allProgress.push(...progressResponse.data);
            }
          } catch (error) {
            console.error(`Error fetching progress for course ${course.id}:`, error);
          }
        })
      );

      return {
        success: true,
        message: 'Progress retrieved successfully',
        data: allProgress,
        count: allProgress.length,
      };
    } catch (error) {
      console.error('Error fetching all courses progress:', error);
      return {
        success: false,
        message: 'Failed to fetch courses progress',
        data: [],
        count: 0,
      };
    }
  }

  // ==================== Course Assignments ====================

  /**
   * Assign staff to a course
   */
  async assignStaffToCourse(courseId: number, staffIds: number[]): Promise<AssignStaffResponse> {
    const response = await api.post<AssignStaffResponse>(`/courses/${courseId}/assign`, {
      staff_ids: staffIds
    });
    return response.data;
  }

  /**
   * Remove staff from a course
   */
  async removeStaffFromCourse(courseId: number, staffId: number): Promise<{ success: boolean; message: string }> {
    const response = await api.delete<{ success: boolean; message: string }>(`/courses/${courseId}/assign/${staffId}`);
    return response.data;
  }

  /**
   * Get assigned courses for a user
   */
  async getAssignedCoursesForUser(userId: number): Promise<{
    success: boolean;
    message: string;
    data: Array<{
      id: number;
      title: string;
      description?: string;
      thumbnail?: string;
      progress: number;
      assigned_date: string;
    }>;
    count: number;
  }> {
    const response = await api.get(`/courses/assigned/${userId}`);
    return response.data;
  }
}

export default new CourseService();

