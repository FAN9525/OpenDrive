// API response types for eValue8 integration
export interface ApiResponse<T = unknown> {
  result: number;
  message?: string;
  data?: T;
}

export interface MakesResponse extends ApiResponse {
  data: Array<{
    mmMakeShortCode: string;
    mmMakeLongName?: string;
  }>;
}

export interface ModelsResponse extends ApiResponse {
  Variants: Array<{
    mvCode: string;
    mvModel: string;
    mmMakeShortCode: string;
  }>;
}

export interface YearsResponse extends ApiResponse {
  Years: Array<{
    mmYear: number;
  }>;
}

export interface AccessoriesResponse extends ApiResponse {
  Optional: Array<{
    OptionCode: string;
    Description: string;
    Retail: string;
    Trade: string;
  }>;
}

export interface ValuationResponse extends ApiResponse {
  data: {
    mmMakeShortCode: string;
    mvModel: string;
    mmYear: number;
    mmCode: string;
    mmNew: string;
    mmRetail: string;
    mmTrade: string;
    mmGuide: string;
    mmEstimator?: string;
  };
}
