import {
  checkSingleUrl as checkSingleUrlApi,
  checkMultipleUrls as checkMultipleUrlsApi,
} from "./helpers";

export const brokenLinkCheckerService = {
  checkSingleUrl: checkSingleUrlApi,
  checkMultipleUrls: checkMultipleUrlsApi,
};
