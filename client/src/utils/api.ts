export const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8000'
    : 'https://pydatapro.com';
