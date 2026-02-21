import { MAX_GITHUB_SEARCH_PAGES } from "@/constants/github";
import { getRandomNumber, getRandomItem } from "@/utils/random";
import {
  GithubRepository,
  GithubSearchResponse,
  ReadmeLink,
} from "./types";
import { searchGithubRepositories, getRepositoryReadme } from "./helpers";

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
  getLinksFromReadme: async (
    repository: GithubRepository
  ): Promise<ReadmeLink[]> => {
    try {
      const readmeContent = await getRepositoryReadme(repository.full_name);

      const githubRepoLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const linksInREADME: ReadmeLink[] = [];
      let match;

      while ((match = githubRepoLinkPattern.exec(readmeContent)) !== null) {
        const displayName = match[1].trim();
        const url = match[2].trim();
        if (url && !url.startsWith("#") && !url.startsWith("mailto:")) {
          linksInREADME.push({ displayName, url });
        }
      }

      return linksInREADME;
    } catch (error) {
      console.error(
        `Error fetching README for ${repository.full_name}:`,
        error
      );
      return [];
    }
  },
};
