'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import ListElement from "@/components/listElement";
import { useToken } from "@/containers/hook/useToken";
import { editIcon } from "@/components/icon";
import { Parallax, ParallaxBanner, ParallaxBannerLayer } from "react-scroll-parallax";

type issueElement = {
  title: string;
  number: number;
}
const repo = "react", owner = "facebook";

export default function Home() {
  
  const searchParams = useSearchParams();
  const [titleAndNumber, setTitleAndNumber] = useState([] as issueElement[]);
  const [isEnd, setIsEnd] = useState(false);
  const [page, setPage] = useState(1);
  const { setCode } = useToken();


  const getInitIssues = async (titleAndNumber: issueElement[], isFirst: boolean) => {
    const res = await fetch(`/api/issueList?page=${page}&repo=${owner.toLowerCase()}/${repo}`);
    const { newTitleAndNumber, isEnd } = await res.json();
    setIsEnd(isEnd);
    setTitleAndNumber([...titleAndNumber, ...newTitleAndNumber])
    setPage(page+1);
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

  //'/images/home-header.jpg'

  return (
    <>
    <header className="absolute top-0 flex flex-col items-start justify-center w-full h-52 z-[-1] gap-2 \
                      md:h-[340px]">
      <Parallax speed={10} className="header-title container z-[2] self-center gap-2 mt-16">
        <h4 className="text-lg text-[--primary] font-medium self-start">Wellcome to</h4>
        <h1 className="text-5xl text-[--primary] font-bold md:text-7xl self-start">Blogo</h1>
      </Parallax>
      <div className="absolute w-full h-full bg-[url('/images/home-header.jpg')] bg-cover bg-center opacity-60">
      </div>
    </header>
    <main className="container gap-3 md:gap-4 md:pt-52 ">
        {titleAndNumber.map((issue, index) => (
          <ListElement key={index} title={issue.title} number={index+1}
                      link={`/repos/${repo}/${issue.number}?owner=${owner}`}/>
        ))}
    </main>
    {/* <a className="fixed w-[60px] h-[60px] bottom-[50px] right-[50px] rounded-full \
                  z-[2] bg-slate-200 flex items-center justify-center" 
            href="/createIssue">
      {editIcon}
    </a> */}
    </>
  );
}
