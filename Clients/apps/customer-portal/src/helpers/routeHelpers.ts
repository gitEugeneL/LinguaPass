export interface Route {
  name: string;
  to: string;
  order: number;
}

export const routes: Record<string, Route> = {
  home: { name: 'Home', to: '/home', order: 0 },
  language: { name: 'Language', to: '/languages', order: 1 },
  school: { name: 'School', to: '/schools', order: 2 },
  course: { name: 'Course', to: '/courses', order: 3 },
  contact: { name: 'Contact', to: '/contact-info', order: 4 },
  personal: { name: 'Personal', to: '/personal-info', order: 5 },
  documents: { name: 'Documents', to: '/documents', order: 6 }
};

export const routesArray: Route[] = Object.values(routes);
