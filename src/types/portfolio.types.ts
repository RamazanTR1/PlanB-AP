import type { Page } from "./user.types";

export interface Asset {
  asset: string;
  isCovered: boolean;
}

// Used when creating/updating: carries the actual binary file
export interface AssetUpload {
  file: File;
  isCovered: boolean;
}

export interface PortfolioRequest {
  name: string;
  description: string;
  excerpt: string;
  outSourceLink?: string; // optional
  publishDate: string;
  // For requests, we send files; will be flattened to multipart keys
  assets?: AssetUpload[]; // optional
}

export interface Portfolio {
  id: number;
  name: string;
  description: string;
  excerpt: string;
  outSourceLink?: string;
  publishDate: string;
  assets?: Asset[];
}

export interface PortfolioList {
  content: Portfolio[];
  page: Page;
}
