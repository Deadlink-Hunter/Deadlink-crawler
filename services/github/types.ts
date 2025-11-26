export interface GithubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  created_at: string;
  updated_at: string;
  topics: string[];
}

export interface GithubSearchResponse {
  total_count: number;
  items: GithubRepository[];
}
