import { checkMultipleUrls } from "@/services/brokenLinkChecker/helpers";
import type {
  CheckUrlsResponse,
  LinkCheckDisplayResult,
  UrlCheckResult,
} from "@/services/brokenLinkChecker/types";
import type { ReadmeLink } from "@/services/github/types";
import { BROKEN_LINK_CHECKER_MAX_URLS_PER_REQUEST } from "@/constants/brokenLinkChecker";

const mapBatchResultsToDisplayResults = (
  links: ReadmeLink[],
  apiResults: UrlCheckResult[]
): LinkCheckDisplayResult[] => {
  return apiResults.map((urlCheckResult, index) => {
    const link = links[index];
    return {
      urlDisplayNameInTheREADME: link.displayName,
      fullUrl: urlCheckResult.url,
      isBroken: urlCheckResult.isBroken,
    };
  });
};

export const checkLinksInBatches = async (
  readmeLinks: ReadmeLink[]
): Promise<LinkCheckDisplayResult[]> => {
  const allResults: LinkCheckDisplayResult[] = [];
  const batchSize = BROKEN_LINK_CHECKER_MAX_URLS_PER_REQUEST;
  let links: ReadmeLink[];
  let urls: string[];
  let result: CheckUrlsResponse;
  let displayResults: LinkCheckDisplayResult[];

  for (let i = 0; i < readmeLinks.length; i += batchSize) {
    links = readmeLinks.slice(i, i + batchSize);
    urls = links.map((l) => l.url);
    result = await checkMultipleUrls(urls);
    displayResults = mapBatchResultsToDisplayResults(links, result.data.results);
    allResults.push(...displayResults);
  }

  return allResults;
};
