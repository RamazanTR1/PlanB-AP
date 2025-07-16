import { useContext } from "react";
import {
	LoginStateContext,
	type LoginStateContextType,
} from "@/contexts/login-state-context";

export const useLoginState = (): LoginStateContextType => {
	const context = useContext(LoginStateContext);

	if (!context) {
		throw new Error("useLoginState must be used within an LoginStateContext");
	}

	return context;
};
