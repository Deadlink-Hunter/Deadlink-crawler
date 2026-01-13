import { MAX_GITHUB_SEARCH_PAGES } from "../../constants/github";
import { getRandomNumber, getRandomItem } from "../../utils/random";
import { GithubRepository, GithubSearchResponse } from "./types";
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
  ): Promise<string[]> => {
    try {
      // Get README content using the same pattern as getRandomRepository
      const readmeContent = await getRepositoryReadme(repository.full_name);

      // Extract all links from markdown
      // Pattern matches: [text](url) and [text](url "title")
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const linksInREADME: string[] = [];
      let match;

      while ((match = linkRegex.exec(readmeContent)) !== null) {
        const url = match[2].trim();
        // Filter out anchor links and mailto links if needed
        if (url && !url.startsWith("#") && !url.startsWith("mailto:")) {
          linksInREADME.push(url);
        }
      }

      return linksInREADME;
    } catch (error) {
      // Handle case where README doesn't exist or API error
      console.error(
        `Error fetching README for ${repository.full_name}:`,
        error
      );
      return [];
    }
  },
};
