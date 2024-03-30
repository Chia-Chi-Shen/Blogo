'use client'
// handle requirements for different repo
import { useState, useEffect } from "react";
import ListElement from "@/components/listElement";

interface IssueListProps {
    owner: string;
    repo: string;
}
type issueElement = {
    title: string;
    number: number;
  }

export default function IssueList({ owner, repo }: IssueListProps) {
    const [titleAndNumber, setTitleAndNumber] = useState([] as issueElement[]);
    const [isEnd, setIsEnd] = useState(false);
    const [page, setPage] = useState(1);

    const getIssues = async (page:number) => {
        const res = await fetch(`/api/issueList?page=${page}&repo=${owner.toLowerCase()}/${repo}`);
        const { newTitleAndNumber, isEnd } = await res.json();
        console.log("isEnd: ",isEnd)
        console.log("page: ", page)
        setIsEnd(isEnd);
        setTitleAndNumber(prev => [...prev, ...newTitleAndNumber])
        setPage(prev => prev + 1);
    }

    useEffect(() => {
        getIssues(page);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === 
          document.documentElement.offsetHeight) {
            if (!isEnd)
            getIssues(page);
        }
        };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [isEnd, page]);

    return(
        <>
        {
        titleAndNumber.map((issue, index) => (
            (titleAndNumber.length === 0) ?
            <div className="text-2xl font-bold">No issue yet</div>
            :    
            <ListElement key={index} title={issue.title} number={index+1}
                      link={`/repos/${repo}/${issue.number}?owner=${owner}`}/>
        ))}
        </>
    )
}
