import { LoginStateContext } from "@/contexts/login-state-context";
import { refreshTokens } from "@/utils/fetch-client";
import { hasAccessToken, setAccessToken } from "@/utils/token-manager";
import { Login, Logout } from "@/services/auth-services";
import type { LoginRequest } from "@/types/auth-types";
import { useQueryClient } from "@tanstack/react-query";

import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

interface LoginStateProviderProps {
	children: ReactNode;
}

export const LoginStateProvider = ({ children }: LoginStateProviderProps) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isStarted, setIsStarted] = useState<boolean>(false);
	const effectRan = useRef(false);
	const isActionable = isStarted && !isLoading;
	const queryClient = useQueryClient();
	const setTimer = useCallback(() => {
		const timer = setTimeout(async () => {
			await refreshTokens();
			if (hasAccessToken()) {
				setTimer();
			}
		}, 1000 * 60 * 12); // 12 minutes
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		setIsStarted(true);
		if (effectRan.current) return;
		effectRan.current = true;

		const refreshTokenFn = async () => {
			setIsLoading(true);

			await refreshTokens();
			const isLoggedIn = hasAccessToken();

			setIsLoggedIn(isLoggedIn);
			if (isLoggedIn) {
				setTimer();
			}
			setIsLoading(false);
		};

		refreshTokenFn();
	}, [setTimer]);

	const handleLogout = async () => {
		setIsLoading(true);
		await Logout();
		setAccessToken(null);
		setIsLoggedIn(false);
		setIsLoading(false);
		queryClient.removeQueries();
	};

	const handleLogin = async (request: LoginRequest) => {
		queryClient.removeQueries();

		try {
			const response = await Login(request);

			if (response.accessToken) {
				const accessToken = response.accessToken;
				setAccessToken(accessToken);
				setIsLoggedIn(true);
			} else {
				setAccessToken(null);
				setIsLoggedIn(false);
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<LoginStateContext.Provider
			value={{
				isLoggedIn,
				isLoading,
				isStarted,
				isActionable,
				handleLogout,
				handleLogin,
			}}
		>
			{children}
		</LoginStateContext.Provider>
	);
};
