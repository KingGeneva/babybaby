
export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  instructor: string;
  modules: CourseModule[];
  updatedAt: string;
  category: string;
}

export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content: string;
  resources?: CourseResource[];
}

export interface CourseResource {
  id: string;
  title: string;
  type: "pdf" | "video" | "link";
  url: string;
}
