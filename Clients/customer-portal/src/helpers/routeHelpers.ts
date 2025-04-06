export const routes = {
  language: { name: 'My language', to: '/languages', order: 1 },
  school: { name: 'My School', to: '/schools', order: 2 },
  course: { name: 'My School', to: '/course', order: 3 },
  contact: { name: 'My contact info', to: '/contact-info', order: 4 },
  personal: { name: 'My personal info', to: '/personal-info', order: 5 },
  documents: { name: 'My documents', to: '/documents', order: 6 }
} as const;

export const routesArray = Object.values(routes);
