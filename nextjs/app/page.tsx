"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    localStorage.clear();
    router.push("/login");
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (typeof window !== "undefined" && !isLoggedIn) return null; // Wait for redirect if not logged in

  return (
    <Card className="mx-auto max-w-md p-6 mt-10">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome, {user?.knownAs || "User"}!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Gender:</strong> {user?.gender}</p>
        </div>
        <Button variant="destructive" onClick={handleLogout}>
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
