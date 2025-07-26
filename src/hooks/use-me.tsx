import { useAuthQuery } from "./use-auth-query";
import { getMe } from "../services/me-service";

export const useMe = () => {
    return useAuthQuery({
        queryKey: ["me"],
        queryFn: getMe,
    });
}