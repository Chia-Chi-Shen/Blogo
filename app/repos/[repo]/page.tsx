'use client'

import { useState, useEffect, useCallback } from "react";
import ListElement from "@/components/listElement";
import { useToken } from "@/containers/hook/useToken";
import { editIcon } from "@/components/icon";

type issueElement = {
  title: string;
  number: number;
}

export default function Repo({ params }: { params: { repo: string }}) {
  
  const [titleAndNumber, setTitleAndNumber] = useState([] as issueElement[]);
  const [isEnd, setIsEnd] = useState(false);
  const [page, setPage] = useState(1);
  const { user, token } = useToken();


  const getInitIssues = async (titleAndNumber: issueElement[], isFirst: boolean) => {
    const res = await fetch(`/api/issueList?page=${page}&repo=${user.toLowerCase()}/${params.repo}`,{
      method: 'GET',
      headers: { 'authorization': token}
    });
    const { newTitleAndNumber, isEnd } = await res.json();

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
      <div className="header-title container z-[2] self-center gap-2 mt-16">
        <h1 className="text-5xl text-[--primary] font-bold md:text-7xl self-start">{params.repo}</h1>
      </div>      
      <div className="absolute w-full h-full bg-[url('/images/home-header.jpg')] bg-cover bg-center opacity-60">
      </div>
    </header>
    <main className="container gap-3 md:gap-4 md:pt-52 ">
        {
        (titleAndNumber.length === 0) ?
        <div className="text-2xl font-bold">No issue yet</div>:
        titleAndNumber.map((issue, index) => (
          <ListElement key={index} title={issue.title} 
                      link={`/repos/${params.repo}/${issue.number}?owner=${user.toLowerCase()}`}
                      number={null}/>
        ))}
    </main>
    </>
  );
}
