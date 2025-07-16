import React from "react";
import { Link } from "react-router-dom";
import { useLoginState } from "@/hooks/use-login-state";
import { useLogout } from "@/hooks/use-auth";

export default function MainPage() {
	const { isLoggedIn } = useLoginState();
	const { mutateAsync: logout, isPending } = useLogout();

	const handleLogout = async () => {
		await logout();
		window.location.reload();
	};

	return (
		<div>
			<nav style={{ display: "flex", gap: 16, marginBottom: 24 }}>
				<Link to="/">Ana Sayfa</Link>
				{!isLoggedIn ? (
					<>
						<Link to="/login">Login</Link>
						<Link to="/register">Register</Link>
					</>
				) : (
					<button onClick={handleLogout} disabled={isPending}>
						Logout
					</button>
				)}
			</nav>
			<h1>Main Page</h1>
		</div>
	);
}
