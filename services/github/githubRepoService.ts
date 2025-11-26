import { MAX_GITHUB_SEARCH_PAGES } from '../../constants/github';
import { getRandomNumber, getRandomItem } from '../../utils/random';
import { GithubRepository, GithubSearchResponse } from './types';
import { searchGithubRepositories } from './helpers';

export const githubRepoService = {

  getRandomRepository: async (): Promise<GithubRepository> => {
    // TODO: this brings 30 pags x 30 repos = 900 repos, if we needed more this will need to be refactroterd
    const randomPage = getRandomNumber(1, MAX_GITHUB_SEARCH_PAGES);
    const searchResponse = await searchGithubRepositories(randomPage);
    const randomRepo = getRandomItem(searchResponse.items);
    return randomRepo;
  },

  getRepositoriesByPage: async (
    page: number = 1
  ): Promise<GithubSearchResponse> => {
    return searchGithubRepositories(page);
  },
};
