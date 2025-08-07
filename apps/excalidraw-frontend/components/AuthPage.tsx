"use client";

import toast, { Toaster } from "react-hot-toast";
import { loginUser, signupUser } from "@/app/api/auth";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  async function handleAuth() {
    if (isSignIn) {
      const token: string = await loginUser(email, password);
      if (!token) {
        toast.error("Invalid credentials / user not found");
        setTimeout(() => {
          router.push("/signup");
        }, 2000);
        return;
      }
      localStorage.setItem("token", token);

      toast.success("Signed in Successfully");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      const token: string = await signupUser(name, email, password);

      if (!token) {
        toast.error("Invalid credentials");
        setTimeout(() => {
          router.push("/signup");
        }, 2000);
        return;
      }
      localStorage.setItem("token", token);

      toast.success("Signed up Successfully");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-black text-white">
      <div className="m-2 p-6 bg-gray-600 rounded">
        {!isSignIn && (
          <div className="m-2">
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 rounded text-black"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="m-2">
          <input
            type="text"
            placeholder="Email"
            className="w-full p-2 rounded text-black"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="m-2">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded text-black"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="pt-2">
          <Button variant={"primary"} size="sm" onClick={handleAuth}>
            {isSignIn ? "Sign in" : "Sign up"}
          </Button>
          <Toaster />
        </div>
      </div>
    </div>
  );
}
