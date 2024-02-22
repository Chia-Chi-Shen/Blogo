'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Octokit, RequestError } from "octokit";
import ListElement from "@/components/listElement";


const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

export default function Home() {
  const router = useRouter();
  const octokit = new Octokit();
  const searchParams = useSearchParams();

  const [nextUrl, setNextUrl] = useState("/repos/curl/curl/issues");
  const [titleAndAuthor, setTitleAndAuthor] = useState([] as {title: string, authorID: string}[]);

  const loginWithGithub = () => {
    router.push("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID);
  }
  
  const getInitIssues = async (url:string) => {
    if (url !== "") 
    try {
      const result = await octokit.request(`GET ${url}`, {
        per_page: 10,
      });
      const newTitleAndAuthor = result.data.map((issue:any) => ({title: issue.title, 
                                                                  authorID: issue.user ? issue.user.id : null}))
      setTitleAndAuthor([...titleAndAuthor, ...newTitleAndAuthor])
      console.log("newTitleAndAuthor: ",newTitleAndAuthor)
      const linkHeader = result.headers.link;
      const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
      setNextUrl(linkHeader?.match(nextPattern)?.[0] ?? "");

      // console.log("linkHeader: ",linkHeader)
      // console.log(titleAndAuthor)
      // console.log("nextLink: ",nextUrl)
    
    } catch (error: any) {
      console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
    }

  };
  

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      console.log("code", code);
    }

    getInitIssues(nextUrl);
  },[]);

  useEffect(() => {
    
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
        getInitIssues(nextUrl);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
    
  } ,[nextUrl]);    

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 gap-3">
      <button onClick={loginWithGithub} className="bg-black text-white p-4 rounded-md">Login with Github</button>
        {titleAndAuthor.map((issue, index) => (
          <ListElement key={index} title={issue.title} />
        ))}
    </main>
  );
}
