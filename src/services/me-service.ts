import { fetchClient } from "../utils/fetch-client";
import type { User } from "../types/auth.types";

export const getMe = async (): Promise<User> => {
    return await fetchClient<void, User>("/admin/users/me", {
        method: "GET",
    });
}
