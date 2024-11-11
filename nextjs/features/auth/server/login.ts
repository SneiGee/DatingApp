"user server";

import { z } from "zod";

// Define the Zod schema for validation
const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(6),
});

export async function loginAction(formData: {
    username: string;
    password: string;
}) {
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
                tenant: "root", // Include any other necessary headers
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
        
        // Store the token and user data in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("knownAs", data.knownAs);
        localStorage.setItem("gender", data.gender);

        return {
            success: true,
            token: data.token,
            username: data.username,
            knownAd: data.knownAd,
            gender: data.gender,
        };
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