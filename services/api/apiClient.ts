import axios, { AxiosInstance } from 'axios';
import { API_TIMEOUT } from '@/constants/api';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return instance;
};

export const apiClient = createAxiosInstance();
