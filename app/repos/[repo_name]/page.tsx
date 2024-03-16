'use client'

import { useState, useEffect, useCallback } from "react";
import ListElement from "@/components/listElement";
import { useToken } from "@/containers/hook/useToken";
import { editIcon } from "@/components/icon";

type issueElement = {
  title: string;
  number: number;
}

export default function Repo({ params }: { params: { repo_name: string }}) {
  
  const [titleAndNumber, setTitleAndNumber] = useState([] as issueElement[]);
  const [isEnd, setIsEnd] = useState(false);
  const [page, setPage] = useState(1);
  const { user, token } = useToken();


  const getInitIssues = async (titleAndNumber: issueElement[], isFirst: boolean) => {
    const res = await fetch(`/api/issueList?page=${page}&repo=${user.toLowerCase()}/${params.repo_name}`,{
      method: 'GET',
      headers: {
        'authorization': token
      }
    });
    const { newTitleAndNumber, isEnd } = await res.json();

    console.log(`repo: repo=${user.toLowerCase()}/${params.repo_name}`)
    console.log("newTitleAndNumber: ", newTitleAndNumber);
    setIsEnd(isEnd);
    setTitleAndNumber([...titleAndNumber, ...newTitleAndNumber])
    setPage(page+1);
  }

  useEffect(() => {
    if (user)
      getInitIssues(titleAndNumber, true);
  },[user]);

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

  //'/images/home-header.jpg'

  return (
    <>
    <header className="absolute top-0 flex flex-col items-start justify-center w-full h-52 z-[-1] gap-2 \
                      md:h-80">
      <div className="absolute w-full h-full bg-[url('/images/home-header.jpg')] bg-cover bg-center opacity-60">
      </div>
    </header>
    <main className="w-full flex min-h-screen flex-col items-center justify-start gap-3 p-4 pt-32 \
                     md:p-24 md:gap-3 md:pt-52 ">
        {
        (titleAndNumber.length === 0) ?
        <div className="text-2xl font-bold">No issue yet</div>:
        titleAndNumber.map((issue, index) => (
          <ListElement key={index} title={issue.title} 
                      link={`/repos/${params.repo_name}/${issue.number}?owner=${user.toLowerCase()}`}
                      number={null}/>
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
