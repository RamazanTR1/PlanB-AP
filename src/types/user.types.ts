import type { User } from "./auth.types";

export interface Page {
	size: number;
	number: number;
	totalElements: number;
	totalPages: number;
}

export interface UpdateUserRequest {
	username: string;
	email: string;
	password: string;
	active: boolean;
}

export interface CreateUserRequest {
	username: string;
	email: string;
	password: string;
}

export interface UserListResponse {
	content: User[];
	page: Page;
}
