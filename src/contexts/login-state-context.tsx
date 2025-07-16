import type { LoginRequest } from "@/types/auth-types";
import { createContext } from "react";

export interface LoginStateContextType {
	isLoggedIn: boolean;
	isLoading: boolean;
	isStarted: boolean;
	isActionable: boolean;
	handleLogout: () => Promise<void>;
	handleLogin: (request: LoginRequest) => Promise<void>;
}

export const LoginStateContext = createContext<
	LoginStateContextType | undefined
>(undefined);
