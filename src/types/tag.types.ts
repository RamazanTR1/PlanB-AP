import type { Page } from "./user.types";

export interface Tag {
  id: number;
  name: string;
}

export interface TagRequest {
  name: string;
}

export interface TagList {
  content: Tag[];
  page: Page;
}
