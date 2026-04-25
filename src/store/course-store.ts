import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LessonAttachment = {
  name: string;
  url: string;
  type: string;
};

export type Lesson = { 
  id: string; 
  title: string; 
  videoUrl?: string; 
  content?: string; 
  isFree?: boolean; 
  attachments?: LessonAttachment[];
};

export type Module = { 
  id: string; 
  title: string; 
  lessons: Lesson[]; 
};

interface CourseState {
  id: string | null;
  title: string;
  subtitle: string;
  categoryId: string;
  description: string;
  imageUrl: string;
  modules: Module[];
  isFree: boolean;
  price: number;
  promoCode: string;
  setCourseData: (data: Partial<CourseState>) => void;
  setBasicInfo: (info: { title: string; subtitle: string; categoryId: string; description: string }) => void;
  addModule: (module: Module) => void;
  addLesson: (moduleId: string, lesson: Lesson) => void;
  updateLesson: (moduleId: string, lessonId: string, updates: Partial<Lesson>) => void;
  setPricing: (isFree: boolean, price: number, promoCode: string) => void;
  reset: () => void;
}

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      id: null,
      title: "",
      subtitle: "",
      categoryId: "",
      description: "",
      imageUrl: "",
      modules: [],
      isFree: true,
      price: 0,
      promoCode: "",
      setCourseData: (data) => set((state) => ({ ...state, ...data })),
      setBasicInfo: (info) => set((state) => ({ ...state, ...info })),
      addModule: (module) => set((state) => ({ modules: [...state.modules, module] })),
      addLesson: (moduleId, lesson) => set((state) => ({
        modules: state.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m)
      })),
      updateLesson: (moduleId, lessonId, updates) => set((state) => ({
        modules: state.modules.map(m => m.id === moduleId ? {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        } : m)
      })),
      setPricing: (isFree, price, promoCode) => set({ isFree, price, promoCode }),
      reset: () => set({ 
        id: null, title: "", subtitle: "", categoryId: "", description: "", imageUrl: "", 
        modules: [], isFree: true, price: 0, promoCode: "" 
      }),
    }),
    {
      name: 'course-storage', // name of the item in storage (must be unique)
    }
  )
);
