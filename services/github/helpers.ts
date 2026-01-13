import { apiClient } from "../api";
import { GITHUB_API_BASE_URL } from "../../constants/github";
import { GithubSearchResponse } from "./types";

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

interface GithubReadmeResponse {
  content: string;
  encoding: string;
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
}

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

  // Decode base64 content
  const content = Buffer.from(response.data.content, "base64").toString(
    "utf-8"
  );
  return content;
};
