import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useAccountStore, useAuthStore } from '../index.ts';

import {
  type ChooseCourseRequest,
  type ChooseCourseResponse,
  type Course,
  type GetCourseById,
  type GetCoursesResponse
} from './course.models.ts';
import { courseUrls } from './course.urls.ts';

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  currentCourseId: string | null;
  chosenLanguageId: string | null;
  chosenSchoolId: string | null;
  isLoading: boolean;
  error: null | string;

  getCurrentCourse: (courseId: string) => Promise<void>;
  getCourses: (languageId: string, schoolId: string) => Promise<void>;
  chooseCourse: (languageId: string, schoolId: string, courseId: string) => Promise<void>;
  resetCurrentCourse: () => void;
}

export const useCoursesStore = create<CoursesState>()(
  persist(
    (set, get) => ({
      courses: [],
      currentCourse: null,
      currentCourseId: null,
      chosenLanguageId: null,
      chosenSchoolId: null,
      isLoading: false,
      error: null,

      getCourses: async (schoolId: string, languageId: string) => {
        if (
          get().chosenLanguageId === languageId &&
          get().chosenSchoolId === schoolId &&
          get().courses.length !== 0
        ) {
          return;
        }
        set({ isLoading: true, courses: [], currentCourse: null });
        try {
          const { data } = await axios.get<GetCoursesResponse>(
            courseUrls.getCourses(schoolId, languageId),
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            courses: data.items,
            chosenLanguageId: languageId,
            chosenSchoolId: schoolId
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      chooseCourse: async (languageId: string, schoolId: string, courseId: string) => {
        set({ isLoading: true });
        try {
          const request: ChooseCourseRequest = { languageId, schoolId, courseId };
          const { data } = await axios.post<ChooseCourseResponse>(
            courseUrls.chooseCourse,
            request,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            currentCourse: get().courses.find((c) => c.courseId == data.courseId) || null,
            currentCourseId: data.courseId
          });
          useAccountStore.getState().updateCourseId(data.courseId);
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getCurrentCourse: async (courseId: string) => {
        set({ isLoading: true, currentCourse: null });
        try {
          const { data } = await axios.get<GetCourseById>(courseUrls.getCourseById(courseId), {
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
          set({
            currentCourseId: data.courseId,
            currentCourse: {
              courseId: data.courseId,
              name: data.name,
              description: data.description,
              activities: data.activities,
              duration: data.duration,
              price: data.price,
              location: data.location,
              languageName: data.languageName,
              schoolName: data.schoolName,
              admissionFee: data.admissionFee,
              withAccommodation: data.withAccommodation,
              schoolId: data.schoolId,
              languageId: data.languageId,
              isActive: data.isActive
            }
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      resetCurrentCourse: () => {
        set({ currentCourse: null, currentCourseId: null });
      }
    }),
    {
      name: 'courses'
    }
  )
);
