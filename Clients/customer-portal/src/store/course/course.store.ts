import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { courseUrls } from './course.urls.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';
import { Course, GetCoursesResponse } from './course.models.ts';

interface CoursesState {
  courses: Course[];
  chosenLanguageId: string | null;
  chosenSchoolId: string | null;
  isLoading: boolean;
  error: null | string;

  getCourses: (languageId: string, schoolId: string) => Promise<void>;
}

export const useCoursesStore = create<CoursesState>()(
  persist(
    (set, get) => ({
      courses: [],
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
      }
    }),
    {
      name: 'courses'
    }
  )
);
