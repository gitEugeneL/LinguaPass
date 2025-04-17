import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { courseUrls } from './course.urls.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';
import {
  ChooseCourseRequest,
  ChooseCourseResponse,
  Course,
  GetCoursesResponse
} from './course.models.ts';
import { useAccountStore } from '../account/account.store.ts';

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  currentCourseId: string | null;
  chosenLanguageId: string | null;
  chosenSchoolId: string | null;
  isLoading: boolean;
  error: null | string;

  getCourses: (languageId: string, schoolId: string) => Promise<void>;
  chooseCourse: (languageId: string, schoolId: string, courseId: string) => Promise<void>;
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
        set({ isLoading: true, courses: [] });
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
      }
    }),
    {
      name: 'courses'
    }
  )
);
