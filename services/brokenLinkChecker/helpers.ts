import { apiClient } from "@/services/api";
import {
  BROKEN_LINK_CHECKER_BASE_URL,
  BROKEN_LINK_CHECKER_MAX_URLS_PER_REQUEST,
} from "@/constants/brokenLinkChecker";
import { CheckUrlResponse, CheckUrlsResponse } from "./types";

export const checkSingleUrl = async (
  url: string
): Promise<CheckUrlResponse> => {
  const response = await apiClient.post<CheckUrlResponse>(
    `${BROKEN_LINK_CHECKER_BASE_URL}/api/check-url`,
    { url }
  );
  return response.data;
};

export const checkMultipleUrls = async (
  urls: string[]
): Promise<CheckUrlsResponse> => {
  if (urls.length > BROKEN_LINK_CHECKER_MAX_URLS_PER_REQUEST) {
    throw new Error(
      `Maximum ${BROKEN_LINK_CHECKER_MAX_URLS_PER_REQUEST} URLs allowed per request`
    );
  }

  const response = await apiClient.post<CheckUrlsResponse>(
    `${BROKEN_LINK_CHECKER_BASE_URL}/api/check-urls`,
    { urls }
  );
  return response.data;
};
