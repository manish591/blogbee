export const APP_NAME = 'blogbee';
export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
export const DOMAIN_NAME =
  process.env.NEXT_PUBLIC_DOMAIN_NAME ?? 'localhost:3000';
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
export const PROTOCOL =
  process.env.NODE_ENV === 'production' ? 'https' : 'http';
