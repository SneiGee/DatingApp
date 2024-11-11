import { UserProp } from "@/types/auth";

export function useAuth() {
    // Retrieve user data from localStorage if available
    const user: UserProp | null = (() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    })();

    return { user, isLoggedIn: Boolean(user) };
}
