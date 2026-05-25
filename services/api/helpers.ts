import { apiClient } from "@/services/api";
import { GITHUB_API_BASE_URL } from "@/constants/github";
import { GithubReadmeResponse, GithubRepository, GithubSearchResponse } from "../github/types";

const getRepositoryTopics = (repo: any): string[] => {
  if (repo.topics?.length) {
    return repo.topics;
  }
  if (repo.parent?.topics?.length) {
    return repo.parent.topics;
  }
  return repo.source?.topics ?? [];
};

const mapGithubRepository = (repo: any): GithubRepository => {
  return {
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    html_url: repo.html_url,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    language: repo.language,
    owner: {
      login: repo.owner.login,
      avatar_url: repo.owner.avatar_url,
      html_url: repo.owner.html_url,
    },
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    topics: getRepositoryTopics(repo),
  };
};

export const searchGithubRepositories = async (
  page: number
): Promise<GithubSearchResponse> => {
  const response = await apiClient.get<GithubSearchResponse>(
    `${GITHUB_API_BASE_URL}/search/repositories`,
    {
      params: {
        q: "stars:>0",
        sort: "stars",
        order: "desc",
        page,
      },
    }
  );

  return response.data;
};

export const getGithubRepository = async (
  fullName: string
): Promise<GithubRepository> => {
  const response = await apiClient.get<any>(
    `${GITHUB_API_BASE_URL}/repos/${fullName}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    }
  );
  return mapGithubRepository(response.data);
};

export const getRepositoryReadme = async (
  fullName: string
): Promise<string> => {
  const response = await apiClient.get<GithubReadmeResponse>(
    `${GITHUB_API_BASE_URL}/repos/${fullName}/readme`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    }
  );
  const decodedContent = Buffer.from(response.data.content, "base64").toString(
    "utf-8"
  );
  return decodedContent;
};
