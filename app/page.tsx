'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import ListElement from "@/components/listElement";
import { useToken } from "@/containers/hook/useToken";

type issueElement = {
  title: string;
  number: number;
}

export default function Home() {
  // const octokit = new Octokit();
  const searchParams = useSearchParams();
  const [titleAndNumber, setTitleAndNumber] = useState([] as issueElement[]);
  const [isEnd, setIsEnd] = useState(false);
  const { setCode } = useToken();

  const getInitIssues = async (titleAndNumber: issueElement[], isFirst: boolean) => {
    const res = await fetch(`/api/issueList?repo=chia-chi-shen/test&isfirst=${isFirst}`);
    const { newTitleAndNumber, isEnd } = await res.json();
    setIsEnd(isEnd);
    setTitleAndNumber([...titleAndNumber, ...newTitleAndNumber])
    console.log("issues: ", newTitleAndNumber);
    // setNextUrl(nextUrl);
  }

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) 
      setCode(code);
    getInitIssues(titleAndNumber, true);
  },[]);

  useEffect(() => {
    if (!isEnd)
    {
      const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
          getInitIssues(titleAndNumber, false);
          console.log("isEnd: ", isEnd)
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  } ,[titleAndNumber]);    

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 gap-3">
        {titleAndNumber.map((issue, index) => (
          <ListElement key={index} title={issue.title} number={issue.number}/>
        ))}
    </main>
  );
}
