import type { AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkLinksInBatches } from "./linkCheck";

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn<AxiosInstance["post"]>(),
}));

vi.mock("@/services/api", () => ({
  apiClient: {
    post: mockPost,
  },
}));

describe("checkLinksInBatches", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  it("returns LinkCheckDisplayResult with display names preserved", async () => {
    mockPost.mockResolvedValue({
      data: {
        success: true,
        data: {
          results: [
            { url: "https://example.com", isBroken: false, responseTime: 100 },
            { url: "https://github.com", isBroken: false, responseTime: 80 },
          ],
          summary: { total: 2, broken: 0, working: 2 },
        },
      },
    });

    const links = [
      { displayName: "Example", url: "https://example.com" },
      { displayName: "GitHub", url: "https://github.com" },
    ];

    const result = await checkLinksInBatches(links);

    expect(result).toEqual([
      {
        urlDisplayNameInTheREADME: "Example",
        fullUrl: "https://example.com",
        isBroken: false,
      },
      {
        urlDisplayNameInTheREADME: "GitHub",
        fullUrl: "https://github.com",
        isBroken: false,
      },
    ]);
  });

  it("splits 11 links into 2 server calls and merges into single result", async () => {
    const allLinks = Array.from({ length: 11 }, (_, i) => ({
      displayName: `Link ${i}`,
      url: `https://example${i}.com`,
    }));
    const [batch1, batch2] = [allLinks.slice(0, 10), allLinks.slice(10)];

    mockPost
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            results: batch1.map((l) => ({
              url: l.url,
              isBroken: false,
              responseTime: 50,
            })),
            summary: { total: 10, broken: 0, working: 10 },
          },
        },
      })
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            results: batch2.map((l) => ({
              url: l.url,
              isBroken: true,
              responseTime: 5000,
            })),
            summary: { total: 1, broken: 1, working: 0 },
          },
        },
      });

    const result = await checkLinksInBatches(allLinks);

    expect(mockPost).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(11);
    expect(result[0].urlDisplayNameInTheREADME).toBe("Link 0");
    expect(result[10].urlDisplayNameInTheREADME).toBe("Link 10");
    expect(result[10].isBroken).toBe(true);
  });

  it("makes exactly one server call when there are exactly 10 links", async () => {
    const links = Array.from({ length: 10 }, (_, i) => ({
      displayName: `Link ${i}`,
      url: `https://example${i}.com`,
    }));

    mockPost.mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          results: links.map((l) => ({
            url: l.url,
            isBroken: false,
            responseTime: 50,
          })),
          summary: { total: 10, broken: 0, working: 10 },
        },
      },
    });

    const result = await checkLinksInBatches(links);

    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(10);
    expect(result[9].urlDisplayNameInTheREADME).toBe("Link 9");
  });

  it("returns empty array when no links provided", async () => {
    const result = await checkLinksInBatches([]);

    expect(result).toEqual([]);
    expect(mockPost).not.toHaveBeenCalled();
  });

  it("throws when a batch fails after a previous batch succeeded", async () => {
    const allLinks = Array.from({ length: 11 }, (_, i) => ({
      displayName: `Link ${i}`,
      url: `https://example${i}.com`,
    }));
    const batch1 = allLinks.slice(0, 10);

    mockPost
      .mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            results: batch1.map((l) => ({
              url: l.url,
              isBroken: false,
              responseTime: 50,
            })),
            summary: { total: 10, broken: 0, working: 10 },
          },
        },
      })
      .mockRejectedValueOnce(new Error("API error"));

    await expect(checkLinksInBatches(allLinks)).rejects.toThrow("API error");
    expect(mockPost).toHaveBeenCalledTimes(2);
  });
});
