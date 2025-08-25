'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from '@/context/user-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { UserRole } from '@/context/user-context';

const AppLogo = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-primary"
  >
    <rect width="32" height="32" rx="8" fill="currentColor" />
    <path
      d="M8 20L14 14L18 18L24 12"
      stroke="hsl(var(--primary-foreground))"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 12H24V17"
      stroke="hsl(var(--primary-foreground))"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function LoginForm() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");

  // Helper: get users from localStorage
  const getUsers = () => {
    if (typeof window !== "undefined") {
      const users = localStorage.getItem("users");
      return users ? JSON.parse(users) : [];
    }
    return [];
  };

  const saveUser = (user: any) => {
    const users = getUsers();
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.target as HTMLFormElement);
    const role = formData.get('role') as UserRole;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (isSignup) {
      const confirmPassword = formData.get('confirmPassword') as string;

      // Check confirm password
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      // Check if already registered
      const users = getUsers();
      if (users.find((u: any) => u.email === email)) {
        setError("User already registered. Please login.");
        return;
      }

      // Save user
      saveUser({ email, password, role });
      alert("Account created successfully! Please login.");
      setIsSignup(false); // go back to login
    } else {
      // LOGIN flow
      const users = getUsers();
      const user = users.find((u: any) => u.email === email);

      if (!user) {
        setError("Not registered. Please create an account.");
        return;
      }

      if (user.password !== password) {
        setError("Invalid password.");
        return;
      }

      // ✅ Successful login
      setUser({
        name: "Registered User",
        role: user.role,
        email: user.email,
      });

      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <AppLogo />
            <h1 className="text-3xl font-bold tracking-tight">predicTo</h1>
          </div>
          <CardTitle className="text-2xl text-center">
            {isSignup ? "Create Account" : "Login"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignup
              ? "Sign up to start using the application."
              : "Login with your registered account."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {isSignup && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" defaultValue="Product Manager">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Product Manager">Product Manager</SelectItem>
                  <SelectItem value="Marketing Team">Marketing Team</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                  <SelectItem value="Administrator">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" className="w-full">
              {isSignup ? "Sign Up" : "Login"}
            </Button>
          </form>

          {/* Toggle link */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setError("");
                  }}
                  className="text-primary hover:underline"
                >
                  Login here
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(true);
                    setError("");
                  }}
                  className="text-primary hover:underline"
                >
                  Create one
                </button>
              </>
            )}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
