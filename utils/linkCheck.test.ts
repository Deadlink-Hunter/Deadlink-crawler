import { beforeEach, describe, expect, it, vi } from "vitest";
import { checkLinksInBatches } from "./linkCheck";

const mockPost = vi.fn();

vi.mock("@/services/api", () => ({
  apiClient: {
    post: (...args: unknown[]) => mockPost(...args),
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

  it("batches links when more than 10", async () => {
    const batch1 = Array.from({ length: 10 }, (_, i) => ({
      displayName: `Link ${i}`,
      url: `https://example${i}.com`,
    }));
    const batch2 = [
      { displayName: "Link 10", url: "https://example10.com" },
    ];
    const allLinks = [...batch1, ...batch2];

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

  it("returns empty array when no links provided", async () => {
    const result = await checkLinksInBatches([]);

    expect(result).toEqual([]);
    expect(mockPost).not.toHaveBeenCalled();
  });
});
