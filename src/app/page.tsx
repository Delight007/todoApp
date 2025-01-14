"use client";
import { useEffect, useState } from "react";
import Login from "./Login/page";
import { auth } from "./Components/firebase/firebase";
import { useRouter } from "next/navigation";
import { User } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false); // Loading complete after auth state is determined
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  useEffect(() => {
    if (user) {
      router.push("/Todo");
    }
  }, [user, router]);

  if (isLoading) {
    return <div>Loading...</div>; // Optional: Add a loading spinner or animation
  }

  return <div>{user ? null : <Login />}</div>;
}
