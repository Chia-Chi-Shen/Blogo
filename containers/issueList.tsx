'use client'
// handle requirements for different repo
import { useState, useEffect } from "react";
import ListElement from "@/components/listElement";
import { useToken } from "./hook/useToken";
import { getIssueList } from "@/app/api/issueList";
import Error from "@/components/error";

type IssueListProps = {
    owner: string;
    repo: string;
}
type issueElement = {
    title: string;
    body: string;
    number: number;
    comments: number;
    updated_at: string;
  }

export default function IssueList({ owner, repo }: IssueListProps) {
    const [issues, setIssues] = useState([] as issueElement[]);
    const [isEnd, setIsEnd] = useState(false);
    const [page, setPage] = useState(1);
    const [status, setStatus] = useState<number|null>(200);
    const { token } = useToken();

    const renderIssueList = async (page:number) => {
        const { issues, isEnd, status } = await getIssueList(`${owner.toLowerCase()}/${repo}`, page.toString(), token);
        if (status == 200) {
            setIsEnd(isEnd);
            setIssues(prev => [...prev, ...issues])
            setPage(prev => prev + 1);
        }
        else
            setStatus(status);
        
    }

    useEffect(() => {
        renderIssueList(page);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === 
          document.documentElement.offsetHeight) {
            if (!isEnd)
            renderIssueList(page);
        }
        };
  
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, [isEnd, page]);

    if (status !== 200) {
        return <Error status={status} />
    }

    return(
        <>
        {
        issues.map((issue, index) => (
            (issues.length === 0) ?
            <div className="text-2xl font-bold">No issue yet</div>
            :    
            <ListElement key={index} title={issue.title} number={index+1} body={issue.body}
                        comments={issue.comments} updated_at={issue.updated_at}
                        link={`/repos/${repo}/${issue.number}?owner=${owner}`}/>
        ))}
        </>
    )
}
