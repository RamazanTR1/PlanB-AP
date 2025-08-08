import type { Page } from "./user.types";

export interface Service {
  id: number;
  icon: string;
  name: string;
  description: string;
}

export interface ServiceRequest {
  name: string;
  description: string;
  icon: string | File | null;
}

export interface ServiceList {
  content: Service[];
  page: Page;
}
