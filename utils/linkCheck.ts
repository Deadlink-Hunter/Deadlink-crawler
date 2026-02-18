import { checkMultipleUrls } from "@/services/brokenLinkChecker/helpers";
import type { LinkCheckDisplayResult, UrlCheckResult } from "@/services/brokenLinkChecker/types";
import type { ReadmeLink } from "@/services/github/types";
import { BROKEN_LINK_CHECKER_MAX_URLS_PER_REQUEST } from "@/constants/brokenLinkChecker";

const mapBatchResultsToDisplayResults = (
  batch: ReadmeLink[],
  apiResults: UrlCheckResult[]
): LinkCheckDisplayResult[] => {
  return apiResults.map((r, idx) => {
    const link = batch[idx];
    return {
      urlDisplayNameInTheREADME: link.displayName,
      fullUrl: r.url,
      isBroken: r.isBroken,
    };
  });
};

export const checkLinksInBatches = async (
  links: ReadmeLink[]
): Promise<LinkCheckDisplayResult[]> => {
  const allResults: LinkCheckDisplayResult[] = [];
  const batchSize = BROKEN_LINK_CHECKER_MAX_URLS_PER_REQUEST;
  let batch: ReadmeLink[];
  let urls: string[];
  let result: Awaited<ReturnType<typeof checkMultipleUrls>>;
  let displayResults: LinkCheckDisplayResult[];

  for (let i = 0; i < links.length; i += batchSize) {
    batch = links.slice(i, i + batchSize);
    urls = batch.map((l) => l.url);
    result = await checkMultipleUrls(urls);
    displayResults = mapBatchResultsToDisplayResults(batch, result.data.results);
    allResults.push(...displayResults);
  }

  return allResults;
};
