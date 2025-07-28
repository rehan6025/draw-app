"use client";

import { Button } from "@repo/ui/button";

export function AuthPage({ isSignIn }: { isSignIn: boolean }) {
  const handleAuth = () => {
    if (isSignIn) {
      console.log("Signing in...");
    } else {
      console.log("Signing up...");
    }
  };

  return (
    <div className="flex w-screen h-screen items-center justify-center bg-black text-white">
      <div className="m-2 p-6 bg-gray-600 rounded">
        <div className="m-2">
          <input
            type="text"
            placeholder="Email"
            className="w-full p-2 rounded text-black"
          />
        </div>
        <div className="m-2">
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 rounded text-black"
          />
        </div>

        <div className="pt-2">
          <Button variant={"primary"} size="sm" onClick={handleAuth}>
            {isSignIn ? "Sign in" : "Sign up"}
          </Button>
        </div>
      </div>
    </div>
  );
}
