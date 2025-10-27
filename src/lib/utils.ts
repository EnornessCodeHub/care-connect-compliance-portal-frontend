import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ===== Course models and storage helpers =====
export type Course = {
  id: string;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  published: boolean;
  createdBy: string;
  updatedAt: string;
  certificateEnabled?: boolean;
  assignedStaffIds?: string[];
  chapters: Chapter[];
};

export type Chapter = {
  id: string;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  description?: string;
  order: number;
  isActive: boolean;
  content?: string;
};

const COURSE_STORAGE_KEY = "cc_courses_v1";

export function loadCourses(): Course[] {
  try {
    const raw = localStorage.getItem(COURSE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Course[];
  } catch {
    return [];
  }
}

export function saveCourses(courses: Course[]) {
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
}

export function upsertCourse(course: Course) {
  const list = loadCourses();
  const idx = list.findIndex(c => c.id === course.id);
  if (idx >= 0) list[idx] = course; else list.push(course);
  saveCourses(list);
}

export function deleteCourse(courseId: string) {
  const list = loadCourses().filter(c => c.id !== courseId);
  saveCourses(list);
}

export function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}-${Date.now().toString(36)}`;
}
