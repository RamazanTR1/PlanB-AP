import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginState } from "@/hooks/use-login-state";

export default function RegisterPage() {
  const { isLoggedIn } = useLoginState();
  const navigate = useNavigate();

  // Giriş yapmış kullanıcıyı dashboard'a yönlendir
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Register Page</h1>
        <p className="text-gray-600">This page is under development.</p>
      </div>
    </div>
  );
}
