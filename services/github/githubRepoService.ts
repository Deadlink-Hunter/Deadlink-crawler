import { MAX_GITHUB_SEARCH_PAGES } from '@/constants/github';
import { getRandomNumber, getRandomItem } from '@/utils/random';
import { GithubRepository, GithubSearchResponse, ReadmeLink } from './types';
import { searchGithubRepositories, getRepositoryReadme } from './helpers';

const ABSOLUTE_URL_REGEX = /^(?:[a-z]+:)?\/\//i;
const TRAILING_SLASHES_REGEX = /\/+$/;

export const githubRepoService = {
  getRandomRepository: async (): Promise<GithubRepository> => {
    // TODO: this brings 30 pags x 30 repos = 900 repos, if we needed more this will need to be refactroterd
    const randomPage = getRandomNumber(1, MAX_GITHUB_SEARCH_PAGES);
    const searchResponse = await searchGithubRepositories(randomPage);
    const randomRepo = getRandomItem(searchResponse.items);
    return randomRepo;
  },

  getRepositoriesByPage: async (
    page: number = 1,
  ): Promise<GithubSearchResponse> => {
    return searchGithubRepositories(page);
  },
  getLinksFromReadme: async (
    repository: GithubRepository,
  ): Promise<ReadmeLink[]> => {
    try {
      const readmeContent = await getRepositoryReadme(repository.full_name);

      const githubRepoLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const linksInREADME: ReadmeLink[] = [];
      let match;

      while ((match = githubRepoLinkPattern.exec(readmeContent)) !== null) {
        const displayName = match[1].trim();
        const rawUrl = match[2].trim();

        if (
          rawUrl &&
          !rawUrl.startsWith('#') &&
          !rawUrl.startsWith('mailto:')
        ) {
          const resolvedUrl = getFullUrlPath(repository, rawUrl);
          linksInREADME.push({ displayName, url: resolvedUrl });
        }
      }

      return linksInREADME;
    } catch (error) {
      console.error(
        `Error fetching README for ${repository.full_name}:`,
        error,
      );
      return [];
    }
  },
};

const getFullUrlPath = (
  repository: GithubRepository,
  rawUrl: string,
): string => {
  if (ABSOLUTE_URL_REGEX.test(rawUrl)) {
    return rawUrl;
  }

  const repoBase = repository.html_url.replace(TRAILING_SLASHES_REGEX, '');
  const base = `${repoBase}/blob/master/`;

  try {
    return new URL(rawUrl, base).href;
  } catch {
    return rawUrl;
  }
};
