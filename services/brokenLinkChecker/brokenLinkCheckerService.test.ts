import { beforeEach, describe, expect, it, vi } from "vitest";
import { brokenLinkCheckerService } from "./brokenLinkCheckerService";

const mockPost = vi.fn();

vi.mock("@/services/api", () => ({
  apiClient: {
    post: (...args: unknown[]) => mockPost(...args),
  },
}));

describe("brokenLinkCheckerService", () => {
  beforeEach(() => {
    mockPost.mockReset();
  });

  describe("checkSingleUrl", () => {
    it("returns url check result for a single URL", async () => {
      const mockResponse = {
        success: true,
        data: {
          url: "https://example.com",
          isBroken: false,
          statusCode: 200,
          responseTime: 100,
        },
      };

      mockPost.mockResolvedValue({ data: mockResponse });

      const result = await brokenLinkCheckerService.checkSingleUrl(
        "https://example.com"
      );

      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining("/api/check-url"),
        { url: "https://example.com" }
      );
      expect(result).toEqual(mockResponse);
      expect(result.success).toBe(true);
      expect(result.data.isBroken).toBe(false);
      expect(result.data.url).toBe("https://example.com");
    });

    it("returns broken status when URL is invalid", async () => {
      mockPost.mockResolvedValue({
        data: {
          success: true,
          data: {
            url: "https://invalid.example",
            isBroken: true,
            error: "Request failed",
            responseTime: 5000,
          },
        },
      });

      const result = await brokenLinkCheckerService.checkSingleUrl(
        "https://invalid.example"
      );

      expect(result.data.isBroken).toBe(true);
      expect(result.data.error).toBe("Request failed");
    });
  });

  describe("checkMultipleUrls", () => {
    it("returns results for multiple URLs", async () => {
      const mockResponse = {
        success: true,
        data: {
          results: [
            {
              url: "https://example.com",
              isBroken: false,
              statusCode: 200,
              responseTime: 100,
            },
            {
              url: "https://broken.com",
              isBroken: true,
              error: "Request failed",
              responseTime: 5000,
            },
          ],
          summary: { total: 2, broken: 1, working: 1 },
        },
      };

      mockPost.mockResolvedValue({ data: mockResponse });

      const result = await brokenLinkCheckerService.checkMultipleUrls([
        "https://example.com",
        "https://broken.com",
      ]);

      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining("/api/check-urls"),
        {
          urls: ["https://example.com", "https://broken.com"],
        }
      );
      expect(result.data.results).toHaveLength(2);
      expect(result.data.summary).toEqual({
        total: 2,
        broken: 1,
        working: 1,
      });
    });

    it("throws when more than 10 URLs are passed", async () => {
      const urls = Array.from({ length: 11 }, (_, i) => `https://example${i}.com`);

      await expect(
        brokenLinkCheckerService.checkMultipleUrls(urls)
      ).rejects.toThrow("Maximum 10 URLs allowed per request");

      expect(mockPost).not.toHaveBeenCalled();
    });
  });
});
