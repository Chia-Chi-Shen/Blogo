'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";
import { Octokit, RequestError } from "octokit";


const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export default function Home() {
  const router = useRouter();
  const loginWithGithub = () => {
    router.push("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
  }
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (code) {
      console.log("code", code);
    }
  },[]);

  useEffect(() => {
    const octokit = new Octokit({
    })
    const getInitIssues = async () => {
      
      try {
        const result = await octokit.request("GET /repos/{owner}/{repo}/issues", {
          owner: "curl",
          repo: "curl",
          per_page: 4,
        });
      
        const titleAndAuthor = result.data.map(issue => ({title: issue.title, 
                                                          authorID: issue.user ? issue.user.id : null}))
        const linkHeader = result.headers.link;
        console.log(titleAndAuthor)
        console.log("linkHeader: ",linkHeader)
      
      } catch (error: any) {
        console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
      }

    }
    getInitIssues();
    
  } ,[]);    

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={loginWithGithub} className="bg-black text-white p-4 rounded-md">Login with Github</button>
    </main>
  );
}
