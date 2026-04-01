import { create } from 'zustand';

export type Lesson = { 
  id: string; 
  title: string; 
  videoUrl: string; 
  content: string; 
  isFree: boolean; 
};

export type Module = { 
  id: string; 
  title: string; 
  lessons: Lesson[]; 
};

interface CourseState {
  title: string;
  subtitle: string;
  categoryId: string;
  description: string;
  imageUrl: string;
  modules: Module[];
  isFree: boolean;
  price: number;
  promoCode: string;
  publishedCourses: unknown[];
  setBasicInfo: (info: { title: string; subtitle: string; categoryId: string; description: string }) => void;
  addModule: (module: Module) => void;
  addLesson: (moduleId: string, lesson: Lesson) => void;
  setPricing: (isFree: boolean, price: number, promoCode: string) => void;
  publishCourse: () => void;
  reset: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  title: "",
  subtitle: "",
  categoryId: "",
  description: "",
  imageUrl: "",
  modules: [],
  isFree: true,
  price: 0,
  promoCode: "",
  publishedCourses: [],
  setBasicInfo: (info) => set((state) => ({ ...state, ...info })),
  addModule: (module) => set((state) => ({ modules: [...state.modules, module] })),
  addLesson: (moduleId, lesson) => set((state) => ({
    modules: state.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m)
  })),
  setPricing: (isFree, price, promoCode) => set({ isFree, price, promoCode }),
  publishCourse: () => set((state) => {
    const newCourse = {
      id: Date.now().toString(),
      title: state.title,
      categoryId: state.categoryId,
      modules: state.modules,
      price: state.isFree ? 0 : state.price,
      isFree: state.isFree,
      date: new Date().toLocaleDateString()
    };
    return { publishedCourses: [...state.publishedCourses, newCourse] };
  }),
  reset: () => set({ 
    title: "", subtitle: "", categoryId: "", description: "", imageUrl: "", 
    modules: [], isFree: true, price: 0, promoCode: "" 
  }),
}));
