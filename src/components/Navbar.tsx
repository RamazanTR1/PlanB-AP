import { Link } from "react-router-dom";
import { useLoginState } from "@/hooks/use-login-state";

const Navbar = () => {
	const { isLoggedIn } = useLoginState();
	return (
		<nav className="flex gap-4 mb-4">
			<Link to="/">Ana Sayfa</Link>
			{!isLoggedIn ? (
				<>
					<Link to="/login">Login</Link>
					<Link to="/register">Register</Link>
				</>
			) : (
				<button onClick={handleLogout} disabled={isPending}>
					{isPending ? (
						<Loader forceShow className="static inline" />
					) : (
						"Logout"
					)}
				</button>
			)}
		</nav>
	);
};

export default Navbar;
