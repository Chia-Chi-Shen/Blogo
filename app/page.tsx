'use client'

import { useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useToken } from "@/containers/hook/useToken";
import IssueList from "@/containers/issueList";
import { Parallax } from "react-scroll-parallax";
import Image from "next/image";

const repo = process.env.NEXT_PUBLIC_REPO?.toLowerCase() || "react"
      , owner = process.env.NEXT_PUBLIC_USER?.toLowerCase() || "facebook";

export default function Home() {
  
  const searchParams = useSearchParams();
  const { setCode } = useToken();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) 
      setCode(code);
  },[]);

  //'/images/home-header.jpg'

  return (
    <>
    <header className="absolute top-0 flex flex-col items-start justify-center w-full h-52 z-[-1] gap-2 \
                      md:h-[340px]">
      <Parallax speed={10} className="header-title container z-[2] self-center gap-2 mt-16">
        <h4 className="text-lg text-[--primary] font-medium self-start">Wellcome to</h4>
        <div className="w-full flex gap-2 justify-start">
          <h1 className="text-5xl text-[--primary] font-bold md:text-7xl self-start">Blogo</h1>
          <Image className="invisible max-h-[30px] md:visible" src="/images/blogo.png" width={30} height={30} alt="blogo"/>
        </div>
      </Parallax>
      <div className="absolute w-full h-full bg-[url('/images/home-header.jpg')] bg-cover bg-center opacity-60">
      </div>
    </header>
    <main className="container pt-32 gap-3 md:gap-4 md:pt-52 ">
        <IssueList owner={owner} repo={repo}/>
    </main>
    </>
  );
}
