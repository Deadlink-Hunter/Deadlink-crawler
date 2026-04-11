import axios, { AxiosInstance } from 'axios';
import { API_TIMEOUT } from '@/constants/api';
import { GITHUB_TOKEN } from '@/constants/github';

const createAxiosInstance = (): AxiosInstance => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  const instance = axios.create({
    timeout: API_TIMEOUT,
    headers,
  });

  return instance;
};

export const apiClient = createAxiosInstance();
