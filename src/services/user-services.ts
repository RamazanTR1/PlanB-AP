import { fetchClient } from "../utils/fetch-client";
import type { User } from "../types/auth.types";
import type {
	CreateUserRequest,
	UpdateUserRequest,
	UserListResponse,
} from "@/types/user.types";

export const getMe = async (): Promise<User> => {
	return await fetchClient<void, User>("/admin/users/me", {
		method: "GET",
	});
};

export const getUserList = async (
	search: string,
	page: number,
	size: number,
	sort: string
) => {
	return await fetchClient<void, UserListResponse>(
		`/admin/users?search=${search}&page=${page}&size=${size}&sort=${sort}`,
		{
			method: "GET",
		}
	);
};

export const getUserById = async (id: number) => {
	return await fetchClient<void, User>(`/admin/users/${id}`, {
		method: "GET",
	});
};

export const deleteUserById = async (id: number) => {
	return await fetchClient<void, void>(`/admin/users/${id}`, {
		method: "DELETE",
	});
};

export const updateUser = async (
	userId: number,
	userData: UpdateUserRequest
) => {
	return await fetchClient<UpdateUserRequest, User>(`/admin/users/${userId}`, {
		method: "PUT",
		body: userData,
	});
};

export const createUser = async (
	userData: CreateUserRequest
): Promise<User> => {
	return await fetchClient<CreateUserRequest, User>("/admin/users", {
		method: "POST",
		body: userData,
	});
};
