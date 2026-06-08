import { describe, it, expect, vi, beforeEach } from "vitest";
import { getGithubRepository } from "./helpers";
import type { GithubRepository } from "../github/types";

const { mockGet } = vi.hoisted(() => ({
  mockGet: vi.fn(),
}));

vi.mock("@/services/api", () => ({
  apiClient: {
    get: mockGet,
  },
}));

describe("getGithubRepository", () => {
  beforeEach(() => {
    mockGet.mockReset();
  });

  it("should fetch repository and return mapped GithubRepository object", async () => {
    const MOCK_RAW_RESPONSE = {
      id: 1234567,
      name: "deadlink-crawler",
      full_name: "user/deadlink-crawler",
      description: "A tool to find broken links",
      html_url: "https://github.com/user/deadlink-crawler",
      stargazers_count: 100,
      forks_count: 20,
      language: "TypeScript",
      owner: {
        login: "user",
        avatar_url: "https://avatars.githubusercontent.com/u/1",
        html_url: "https://github.com/user",
      },
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      topics: ["crawler", "links"],
    };

    mockGet.mockResolvedValue({ data: MOCK_RAW_RESPONSE });

    const result = await getGithubRepository("user/deadlink-crawler");

    expect(result).toMatchObject({
      id: 1234567,
      name: "deadlink-crawler",
      full_name: "user/deadlink-crawler",
      description: "A tool to find broken links",
      html_url: "https://github.com/user/deadlink-crawler",
      stargazers_count: 100,
      forks_count: 20,
      language: "TypeScript",
      owner: {
        login: "user",
        avatar_url: "https://avatars.githubusercontent.com/u/1",
        html_url: "https://github.com/user",
      },
      topics: ["crawler", "links"],
    } as GithubRepository);
  });
});
