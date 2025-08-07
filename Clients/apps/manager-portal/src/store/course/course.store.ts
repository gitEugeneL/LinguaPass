import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type { CourseResponse, GetCourseByIdResponse, GetCoursesResponse } from './course.models.ts';
import { courseUrls } from './course.urls.ts';

interface CourseState {
  courses: CourseResponse[];
  currentCourse: null | CourseResponse;
  isLoading: boolean;
  error: null | string;

  getCoursesBySchoolId: (schoolId: string) => Promise<void>;
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
      const mappedCourses = data.items.map((item: CourseResponse) => ({
        ...item,
        price: Number(item.price),
        admissionFee: Number(item.admissionFee)
      }));
      set({ courses: mappedCourses });
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
  }
}));
