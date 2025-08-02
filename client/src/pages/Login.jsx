import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IndustryIllustration from "../Animations/IndustryIllustration";
import { GoogleLogin } from "@react-oauth/google";
import Input from "../components/input/input";
import NextUIButton from "../components/button/button";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
    // Handle login logic
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full font-inter bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
      {/* Left - Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#f0f0f0] dark:bg-zinc-800 p-10">
        <div className="max-w-[500px] w-full">
          <h2 className="mt-6 text-4xl font-bold text-center text-zinc-700 dark:text-white">
            Project Pragya
          </h2>
          <p className="mt-2 text-center text-zinc-500">
            Industrial Intelligence, Redefined.
          </p>
          <IndustryIllustration style={{ width: "100%", height: "auto" }} />
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex w-full md:w-1/2 items-center md:items-center justify-center p-6 min-h-screen">
        <div className="w-full max-w-md space-y-6 p-8 rounded-3xl shadow-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Sign in</h1>
            <p className="text-sm text-zinc-500">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <NextUIButton type="submit">Sign In</NextUIButton>
          </form>

          <div className="flex items-center gap-4 my-6">
            <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
            <span className="text-sm text-zinc-500">OR</span>
            <hr className="flex-grow border-zinc-200 dark:border-zinc-700" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(res) => console.log(res)}
              onError={() => console.log("Google Login Failed")}
              useOneTap
              width="300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
