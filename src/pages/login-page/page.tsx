import { useState, useEffect } from "react";
import { useLogin } from "@/hooks/use-auth";
import { useLoginState } from "@/hooks/use-login-state";
// import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const { mutateAsync, isPending } = useLogin();
	const { isLoggedIn } = useLoginState();
	// const navigate = useNavigate();

	const [form, setForm] = useState({ email: "", password: "" });

	useEffect(() => {
		if (isLoggedIn) {
			window.location.reload();
			// navigate("/", { replace: true });
		}
	}, [isLoggedIn]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await mutateAsync(form);
	};

	return (
		<div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
				<input
					name="email"
					type="email"
					placeholder="Email"
					value={form.email}
					onChange={handleChange}
					required
					style={{ display: "block", marginBottom: 12, width: "100%" }}
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					value={form.password}
					onChange={handleChange}
					required
					style={{ display: "block", marginBottom: 12, width: "100%" }}
				/>
				<button type="submit" disabled={isPending} style={{ width: "100%" }}>
					{isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
