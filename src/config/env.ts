export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'EPFO EO Tour Diary',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
