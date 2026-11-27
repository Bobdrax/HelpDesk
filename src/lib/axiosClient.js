import axios from 'axios';

const baseURL = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const isAxiosConfigured = Boolean(baseURL && anonKey);

export const axiosClient = axios.create({
  baseURL: `${baseURL}/rest/v1`,
  headers: {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'Content-Type': 'application/json',
  },
});
