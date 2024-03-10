'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import ListElement from "@/components/listElement";
import { useToken } from "@/containers/hook/useToken";
import { editIcon } from "@/components/icon";

type issueElement = {
  title: string;
  number: number;
}

export default function Home() {
  
  const searchParams = useSearchParams();
  const [titleAndNumber, setTitleAndNumber] = useState([] as issueElement[]);
  const [isEnd, setIsEnd] = useState(false);
  const [page, setPage] = useState(1);
  const { setCode } = useToken();


  const getInitIssues = async (titleAndNumber: issueElement[], isFirst: boolean) => {
    const res = await fetch(`/api/issueList?page=${page}`);
    const { newTitleAndNumber, isEnd } = await res.json();
    setIsEnd(isEnd);
    setTitleAndNumber([...titleAndNumber, ...newTitleAndNumber])
    setPage(page+1);
    console.log("issues: ", newTitleAndNumber);
  }

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) 
      setCode(code);
    
    getInitIssues(titleAndNumber, true);
  },[]);

  useEffect(() => {
    if (!isEnd && page > 1)
    {
      const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === 
          document.documentElement.offsetHeight) {
            getInitIssues(titleAndNumber, false);
        }
      };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  } ,[titleAndNumber]);  

  return (
    <>
    <header className="absolute top-0 flex items-center justify-center w-full h-52 bg-white z-[-1]">
      <h1 className="text-3xl text-slate-500 font-bold z-[2]">Wellcome!</h1>
      <div className="absolute w-full h-full bg-[url('/images/home-header.jpg')] bg-cover bg-center opacity-60">
      </div>
    </header>
    <main className="w-full flex min-h-screen flex-col items-center justify-start gap-2 p-4 pt-[30%] \
                     md:p-24 md:gap-3 ">
        {titleAndNumber.map((issue, index) => (
          <ListElement key={index} title={issue.title} number={issue.number}/>
        ))}
    </main>
    <a className="fixed w-[60px] h-[60px] bottom-[50px] right-[50px] rounded-full \
                  z-[2] bg-slate-200 flex items-center justify-center" 
            href="/createIssue">
      {editIcon}
    </a>
    </>
  );
}
