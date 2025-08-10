import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type {
  CourseResponse,
  CreateCourseRequest,
  GetCourseByIdResponse,
  GetCoursesResponse,
  UpdateCourseRequest
} from './course.models.ts';
import { courseUrls } from './course.urls.ts';

interface CourseState {
  courses: CourseResponse[];
  currentCourse: null | CourseResponse;
  isLoading: boolean;
  error: null | string;

  getCoursesBySchoolId: (schoolId: string) => Promise<void>;
  getCourseById: (courseId: string) => Promise<void>;
  createCourse: (course: CreateCourseRequest) => Promise<void>;
  updateCourse: (course: UpdateCourseRequest) => Promise<void>;
  resetError: () => void;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,

  getCoursesBySchoolId: async (schoolId: string) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get<GetCoursesResponse>(
        courseUrls.getCoursesBySchoolId(schoolId),
        {
          headers: createAuthHeader(useAuthStore.getState().accessToken)
        }
      );
      set({ courses: data.items });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getCourseById: async (courseId: string) => {
    set({ isLoading: true, currentCourse: null });
    try {
      const course = get().courses.find((c) => c.courseId === courseId);
      if (course) {
        set({ currentCourse: course });
      } else {
        const { data } = await axios.get<GetCourseByIdResponse>(
          courseUrls.getCourseById(courseId),
          {
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          }
        );
        set({ currentCourse: data });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createCourse: async (course: CreateCourseRequest) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post<CourseResponse>(courseUrls.createCourse, course, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      if (get().courses.length === 0) {
        await get().getCoursesBySchoolId(course.schoolId);
      }
      set({ courses: [{ ...data }, ...get().courses] });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateCourse: async (course: UpdateCourseRequest) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.patch<CourseResponse>(courseUrls.updateCourse, course, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      if (get().courses.length > 0) {
        set({
          courses: get().courses.map((response) =>
            response.courseId === course.courseId ? { ...data } : response
          )
        });
      } else {
        await get().getCoursesBySchoolId(course.schoolId);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },

  resetError: () => set({ error: null })
}));
