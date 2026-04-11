import { getUserRepositories } from './helpers';
import { GithubRepository } from './types';
import { githubRepoService } from './githubRepoService';

export const githubUserService = {
  getUserRepos: async (username: string): Promise<GithubRepository[]> => {
    return getUserRepositories(username);
  },

  getAllLinksFromUserRepos: async (username: string) => {
    const repos = await getUserRepositories(username);
    const results = [];

    for (const repo of repos) {
      console.log(`Searching links for: ${repo.full_name}`);
      const links = await githubRepoService.getLinksFromReadme(repo);
      results.push({
        repository: repo.full_name,
        links,
      });
    }

    return results;
  },
};
