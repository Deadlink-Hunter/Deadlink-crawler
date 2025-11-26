import { apiClient } from '../api';
import { GITHUB_API_BASE_URL } from '../../constants/github';
import { GithubSearchResponse } from './types';

export const searchGithubRepositories = async (
  page: number
): Promise<GithubSearchResponse> => {
  const response = await apiClient.get<GithubSearchResponse>(
    `${GITHUB_API_BASE_URL}/search/repositories`,
    {
      params: {
        q: 'stars:>0',
        sort: 'stars',
        order: 'desc',
        page,
      },
    }
  );

  return response.data;
};
