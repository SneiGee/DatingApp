"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { loginAction } from "../server/login";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

// Zod schema for validation
const loginSchema = z.object({
    username: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        // Check for token on page load and redirect if it exists
        const token = localStorage.getItem("token");
        if (token) {
            router.push("/");
        }
    }, [router]);

    const clientAction = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        const result = loginSchema.safeParse({ username, password });
        if (!result.success) {
            toast({
                title: "Login Failed!",
                description: result.error.errors[0].message,
                variant: "destructive"
            })
            return;
        }

        const response = await loginAction({ username, password });
        if (response?.success) {
            router.push("/");
            toast({
                title: "Welcome Back!",
                description: "You are logged in successfully.",
                duration: 5000
            })
        } else {
            toast({
                title: "Login Failed!",
                description: "Please check your credentials.",
                variant: "destructive"
            })
        }
    };
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={clientAction} className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="username"
                            type="username"
                            placeholder="m@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required />
                    </div>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}