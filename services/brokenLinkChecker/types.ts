export interface UrlCheckResult {
  url: string;
  isBroken: boolean;
  statusCode?: number;
  error?: string;
  responseTime: number;
}

export interface CheckUrlResponse {
  success: boolean;
  data: UrlCheckResult;
  error?: string;
}

export interface CheckUrlsResponse {
  success: boolean;
  data: {
    results: UrlCheckResult[];
    summary: { total: number; broken: number; working: number };
  };
  error?: string;
}

export interface LinkCheckDisplayResult {
  urlDisplayNameInTheREADME: string;
  fullUrl: string;
  isBroken: boolean;
}
