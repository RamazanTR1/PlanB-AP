import type {
	LoginRequest,
	LoginResponse,
	AdminUserRequest,
	AdminUserResponse,
} from "@/types/auth-types";
import { fetchClient } from "@/utils/fetch-client";

export const Login = async (request: LoginRequest) => {
	return await fetchClient<LoginRequest, LoginResponse>("/api/v1/auth/login", {
		body: request,
		method: "POST",
		credentials: "include",
	});
};

export const Logout = async () => {
	const response = await fetchClient("/api/v1/auth/logout", {
		method: "POST",
		credentials: "include",
	});
	return response;
};

export const AdminUserRegister = async (request: AdminUserRequest) => {
	return await fetchClient<AdminUserRequest, AdminUserResponse>(
		"/api/v1/auth/admin/users",
		{
			body: request,
			method: "POST",
			credentials: "include",
		}
	);
};
