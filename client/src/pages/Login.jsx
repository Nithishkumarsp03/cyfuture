import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IndustryIllustration from "../Animations/IndustryIllustration";
import { GoogleLogin } from "@react-oauth/google";
import Input from "../components/input/input";
import NextUIButton from "../components/button/button";
import { useToast } from "../components/Toast/ToastContext";
import { ClipLoader } from "react-spinners";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const api = import.meta.env.VITE_API_URL;

  //   {
  //   "message": "User registered successfully",
  //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiN2RkNjdmNGQtNWRiYy00MmM3LTliZTktNjE0YjlmNzI0MWZjIiwiZW1haWwiOiJuaXRoaXNoa3VtYXIuY3MyM0BiaXRzYXRoeS5hYy5pbiJ9LCJpYXQiOjE3NTQ3MzAzMzUsImV4cCI6MTc1NDczMzkzNX0.CNNmOoV_EsTGMGDxe4mx6rNqaQGpZbJyiyG4_YttojE",
  //   "user": {
  //     "id": "7dd67f4d-5dbc-42c7-9be9-614b9f7241fc",
  //     "name": "NITHISH KUMAR",
  //     "email": "nithishkumar.cs23@bitsathy.ac.in"
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      addToast("Both Email & Password are required!", "error");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${api}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        throw new Error(data.message || "Invalid email or password");
      }

      addToast(`Authenticated as ${email}`, "success");
      localStorage.setItem("name", data.user.name);
      localStorage.setItem("id", data.user.id);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("token", data.token);

      navigate("/");
    } catch (error) {
      addToast(error.message, "error"); // ✅ safer
    } finally {
      setLoading(false); // ✅ always reset
    }
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
            <NextUIButton type="submit">
              {loading ? "Signing in..." : "Sign in"}
              {loading ? (
                <ClipLoader color="white" loading={loading} size={24} />
              ) : (
                ""
              )}
            </NextUIButton>
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
