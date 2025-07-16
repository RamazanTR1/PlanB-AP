export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

export interface AdminUserRequest {
	username: string;
	email: string;
	password: string;
}

export interface AdminUserResponse {
	id: number;
	username: string;
	email: string;
}
