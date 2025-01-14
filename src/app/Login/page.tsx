"use client";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth, googleProvider } from "../Components/firebase/firebase";
import { useRouter } from "next/navigation";

export interface login {
  email: string;
  password: string;
}
export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const router = useRouter();
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsAdding(true);
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      router.push("/Todo");
      setIsAdding(false);
    } catch (err) {
      console.log("cannot login", err);
      setIsAdding(false);
    }
  }
  async function signInwithGoogle() {
    try {
      setIsAdding(true);
      await signInWithPopup(auth, googleProvider);
      router.push("/Todo");
      setIsAdding(false);
    } catch (err) {
      console.log("error", err);
      setIsAdding(false);
    }
  }
  return (
    <div className="w-[1300px] h-screen flex justify-center items-center">
      <div className="w-[400px] h-[500px] flex  items-center flex-col py-6 shadow-lg rounded-lg">
        <form className="flex flex-col" onSubmit={handleLogin}>
          <h1 className="font-semibold text-2xl text-center text-blue-600 my-4">
            Login
          </h1>
          <div>
            <label className="flex flex-col font-medium">Email</label>
            <input
              type="email"
              placeholder="Email..."
              className="w-[250px] h-[40px] p-2 border border-blue-600 rounded-lg focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="flex flex-col font-medium mt-4">Password</label>
            <input
              type="password"
              placeholder="Password"
              className="w-[250px] h-[40px] p-2 border border-blue-600 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={isAdding}
            className="w-[250px] h-[50px] bg-blue-400 text-white font-medium mt-6 rounded-lg focus:outline-none"
          >
            {isAdding ? "Signing in...." : "Login"}
          </button>

          <button
            disabled={isAdding}
            className="w-[250px] h-[50px] bg-blue-400 text-white font-medium mt-6 rounded-lg focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              signInwithGoogle();
            }}
          >
            {isAdding ? "Signing in ...." : " SignIn With Google"}
          </button>
        </form>
      </div>
    </div>
  );
}
