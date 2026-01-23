import { apiClient } from "@/services/api";
import { GITHUB_API_BASE_URL } from "@/constants/github";
import { GithubReadmeResponse, GithubSearchResponse } from "./types";

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
