import type { Page } from "./user.types";

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  description: string;
}

export interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  description: string;
  createdAt: string;
}

export interface ContactList {
  content: Contact[];
  page: Page;
}
