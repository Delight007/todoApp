"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { auth, db } from "../Components/firebase/firebase";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface User {
  id: string;
  firstName: string;
  email: string;
  password: string;
}
export default function Regiter() {
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setIsPending(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstName: firstName,
          password: password,
        });
      }
      console.log("registered successfully");
      setFirstName("");
      setEmail("");
      setPassword("");
      setIsPending(false);
      router.push("/Login");
    } catch (err) {
      console.log("error", err);
      setIsPending(false);
    }
  }
  return (
    <div className="w-[1300px] h-screen flex justify-center items-center">
      <div className="w-[400px] h-[500px] flex  items-center flex-col py-6 shadow-lg rounded-lg">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <h1 className="font-semibold text-2xl text-center text-blue-600 my-4">
            Register
          </h1>
          <div className="">
            <label className="flex flex-col my-2 font-medium">Name</label>
            <input
              type="text"
              placeholder="Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-2  border-blue-600 w-[250px] h-[40px] rounded-lg"
            />

            <label className="flex flex-col my-2 font-medium"> Email </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 border-blue-600 w-[250px] h-[40px] rounded-lg"
            />
            <label className="flex flex-col my-2 font-medium">Password</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 border-blue-600 w-[250px] h-[40px] rounded-lg"
            />
          </div>
          <button
            disabled={isPending}
            className="bg-blue-400 text-white w-[250px] h-[40px] rounded-lg my-4 font-medium"
          >
            {isPending ? "Registering ...." : "Register"}
          </button>
        </form>
        <p className="mt-4">
          Don't have an account?{" "}
          <Link href="/Login" className="text-blue-400 font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
