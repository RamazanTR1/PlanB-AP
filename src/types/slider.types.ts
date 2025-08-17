import type { Page } from "./user.types";
import type { Tag } from "./tag.types";

export interface SliderRequest {
  name: string;
  description: string;
  excerpt: string; // optional
  tagIds: number[];
  image: File | null; // optional
}

export interface Slider {
  id: number;
  name: string;
  description: string;
  excerpt: string;
  image: string;
  tags: Tag[];
}

export interface SliderList {
  content: Slider[];
  page: Page;
}
