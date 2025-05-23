export const API_BASE =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:8000/api'
    : 'https://api.pydatapro.com/api';
