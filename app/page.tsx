'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";


const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export default function Home() {
  const router = useRouter();
  const loginWithGithub = () => {
    router.push("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
  }
  const searchParams = useSearchParams();

  useEffect(() => {
    
    const code = searchParams.get("code");

    // const params = new URLSearchParams(window.location.search);
    // const code = params.get("code");
    if (code) {
      console.log("code", code);
    }
  },[]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={loginWithGithub} className="bg-black text-white p-4 rounded-md">Login with Github</button>
    </main>
  );
}
