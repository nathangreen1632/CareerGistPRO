export const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8000'
    : 'https://api.pydatapro.com';
