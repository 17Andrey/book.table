const isDevelopment = process.env.NODE_ENV === 'development';

export const API_URL = isDevelopment 
  ? 'http://localhost:3000'
  : 'https://your-api-domain.com'; // Замените на реальный домен вашего API 