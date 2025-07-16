import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/main/page";
import LoginPage from "./pages/login-page/page";
import RegisterPage from "./pages/register-page/page";
import { useLoginState } from "@/hooks/use-login-state";

export default function App() {
	const { isLoggedIn } = useLoginState();
	return (
		<Routes>
			<Route path="/" element={<MainPage />} />
			<Route
				path="/login"
				element={!isLoggedIn ? <LoginPage /> : <Navigate to="/" replace />}
			/>
			<Route
				path="/register"
				element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/" replace />}
			/>
		</Routes>
	);
}
