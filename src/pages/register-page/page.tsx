import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminUserRegister } from "@/services/auth-services";
import type { AdminUserRequest } from "@/types/auth-types";
import { toast } from "sonner";
import { useLoginState } from "@/hooks/use-login-state";

const RegisterPage = () => {
	// const navigate = useNavigate();
	const { isLoggedIn } = useLoginState();
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [isPending, setIsPending] = useState(false);

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
		if (form.password !== form.confirmPassword) {
			toast.error("Şifreler eşleşmiyor");
			return;
		}
		setIsPending(true);
		try {
			const req: AdminUserRequest = {
				username: form.username,
				email: form.email,
				password: form.password,
			};
			await AdminUserRegister(req);
			toast.success("Kayıt başarılı!");
			window.location.reload();
			// navigate("/", { replace: true });
		} catch (error: any) {
			toast.error(error?.message || "Kayıt başarısız");
		} finally {
			setIsPending(false);
		}
	};

	return (
		<div style={{ maxWidth: 400, margin: "auto", padding: 32 }}>
			<h2>Register</h2>
			<form onSubmit={handleSubmit}>
				<input
					name="username"
					type="text"
					placeholder="Username"
					value={form.username}
					onChange={handleChange}
					required
					style={{ display: "block", marginBottom: 12, width: "100%" }}
				/>
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
				<input
					name="confirmPassword"
					type="password"
					placeholder="Confirm Password"
					value={form.confirmPassword}
					onChange={handleChange}
					required
					style={{ display: "block", marginBottom: 12, width: "100%" }}
				/>
				<button type="submit" disabled={isPending} style={{ width: "100%" }}>
					{isPending ? "Kayıt yapılıyor..." : "Kayıt Ol"}
				</button>
			</form>
		</div>
	);
};

export default RegisterPage;
