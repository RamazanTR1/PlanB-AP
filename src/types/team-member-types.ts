import type { Page } from "./user.types";

export interface TeamMember {
  id: number;
  name: string;
  title: string;
  quote: string;
  profilePhoto: string;
  linkedinUrl: string;
  orderNumber: number;
}

export interface TeamMemberRequest {
  name: string;
  title: string;
  quote: string;
  linkedinUrl: string; //Optional
  orderNumber: number; // int32 equivalent
  profilePhoto: File | null; //Optional
}

export interface TeamMemberList {
  content: TeamMember[];
  page: Page;
}
