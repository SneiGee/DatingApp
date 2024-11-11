"user server";

import { LoginProp, UserProp } from "@/types/auth";
import { z } from "zod";

// Define the Zod schema for validation
const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
});

export async function loginAction(formData: LoginProp) {
    // Validate the input data
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
        return { success: false, message: result.error.errors[0].message };
    }

    const { username, password } = result.data;

    try {
        const response = await fetch("https://localhost:5001/api/account/login", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to login");
        }

        // Parse the response JSON
        const data = await response.json();

        // Create user object to store in localStorage
        const user: UserProp = {
            token: data.token,
            username: data.username,
            firstName: data.firstName,
            knownAs: data.knownAs,
            gender: data.gender,
            roles: data.roles,
        };
        
        // Store user object as JSON string in localStorage
        localStorage.setItem("user", JSON.stringify(user));

        return { success: true, user };
    } catch (error) {
        // Improved error handling
        let errorMessage = "An unexpected error occurred"; // Default error message

        if (error instanceof Error) {
            errorMessage = error.message; // Get the message if it's an instance of Error
        } else if (typeof error === "string") {
            errorMessage = error; // If the error is a string, use it directly
        }

        console.error("Login error:", error);
        return {
            success: false,
            message: errorMessage,
        };
    }
}