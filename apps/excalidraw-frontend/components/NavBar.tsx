"use client";
import { Button } from "@repo/ui/button";
import { Palette, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem("token"));
  }, []);

  const handleSignOut = () => {
    localStorage.clear();
    setHasToken(false);
  };

  return (
    // fixed container
    <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-sm border-b border-gray-100 z-50">
      {/* content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* horizntal flex layout  */}
        <div className="flex items-center justify-between h-16">
          {/* logo section  */}

          <Link className="flex space-x-2 items-center" href={"/"}>
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg ">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-900 font-bold text-xl ">
              DrawTogether
            </span>
          </Link>
          {/* navigation  */}
          <div className="hidden md:flex items-center space-x-8 text-lg">
            <Link
              href={"/#features"}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href={"/#how-it-works"}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              How it works
            </Link>

            {hasToken ? (
              <Link href={"/"}>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign out
                </Button>
              </Link>
            ) : (
              <Link href={"/signin"}>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
            <Link href={"/dashboard"}>
              <Button variant="primary" size="sm">
                Start Drawing
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
