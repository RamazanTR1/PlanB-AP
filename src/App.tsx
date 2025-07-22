import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginProvider } from "./providers/login-state-provider";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./providers/protected-route";
import AdminLayout from "./components/admin-layout";
import DashboardPage from "./pages/dashboard/dashboard-page";
import UserListPage from "./pages/user/user-list-page";
import LoginPage from "./pages/login/login-page";
import RegisterPage from "./pages/register/register-page";

const queryClient = new QueryClient();

export default function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<LoginProvider>
				<BrowserRouter>
					<Routes>
						<Route element={<ProtectedRoute />} >
							<Route path="/" element={<AdminLayout />} >
								<Route path="/" element={<DashboardPage />} />
								<Route path="/users" element={<UserListPage />} />
							</Route>
						</Route>
						<Route path="/login" element={<LoginPage />} />
						<Route path="/register" element={<RegisterPage />} /> 
						{/* // TODO: Remove Register Page When We Are Done With Testing */}
					</Routes>
				</BrowserRouter>
			</LoginProvider>
		</QueryClientProvider>
	);
}
