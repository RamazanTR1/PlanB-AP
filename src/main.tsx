import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { LoginStateProvider } from "./providers/login-state-provider.tsx";
import QueryProvider from "./providers/query-client-provider.tsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<StrictMode>
			<QueryProvider>
				<LoginStateProvider>
					<Toaster />
					<App />
				</LoginStateProvider>
			</QueryProvider>
		</StrictMode>
	</BrowserRouter>
);
