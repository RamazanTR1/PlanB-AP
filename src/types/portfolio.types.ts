import type { Page } from "./user.types";

interface Asset {
  asset?: string;
  isCovered: boolean;
}

export interface PortfolioRequest {
  title: string;
  description: string;
  excerpt: string;
  outSourceLink?: string; // optional
  publishDate: string;
  assets?: Asset[]; // optional
}

export interface Portfolio {
  id: number;
  title: string;
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
