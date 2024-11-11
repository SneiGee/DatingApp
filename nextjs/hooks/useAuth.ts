// interface User {
//     username: string;
//     knownAs: string;
//     gender: string;
//     token: string;
// }

export function useAuth() {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const knownAs = localStorage.getItem("knownAs");
    const gender = localStorage.getItem("gender");

    const user = token && username && knownAs && gender
        ? { token, username, knownAs, gender }
        : null;

    return { user, isLoggedIn: Boolean(user) };
}
