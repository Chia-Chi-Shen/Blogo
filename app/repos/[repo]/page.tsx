'use client'
import IssueList from "@/containers/issueList";
import { useToken } from "@/containers/hook/useToken";

export default function Repo({ params }: { params: { repo: string }}) {
  
  const { user, token } = useToken();

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
      { user && <IssueList owner={user.toLowerCase()} repo={params.repo}/> }
    </main>
    </>
  );
}
