'use client'
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import parse from "html-react-parser";
import { useToken } from "@/containers/hook/useToken";

type Issue = {
    title: string, 
    body: string, 
    updated_at: string
};
type Comment = {
    user: string, 
    body: string, 
    updated_at: string
};

export default function Page({ params }: { params: { issue_number: string } }) {
    
    const [issue, setIssue] = useState({title: "", body: "", updated_at: ""} as Issue);
    const [comments, setComments] = useState([] as Comment[]);
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner')?? "chia-chi-shen";
    const repo = searchParams.get('repo')?? "test";
    const { token } = useToken();
    
    useEffect(() => {
        // if navigate to /createIssue, redirect to home page
        console.log("pathName: ", pathName);
        if (pathName === "/createIssue") {
            router.push("/");
        }
        
      }, [pathName])

    useEffect(() => { 
        const getIssue = async () => {
            // if no owner and repo specified, use default
            const res = await fetch(`/api/issue?issue_number=${params.issue_number}&owner=${owner}&repo=${repo}&parse=true`);
            const { issue, comments } = await res.json();
            setIssue(issue);
            setComments(comments);
        } 
        getIssue();  
    }
    ,[]);

    const deleteIssue = async() => {
        const result = await fetch(
            `/api/issue?owner=${owner}&repo=${repo}&issue_number=${params.issue_number}`, {
            method: 'DELETE',
            headers: {
                'authorization': token
            }
        });
        const number = await result.json();
        router.push("/");
    }

    return (
        <div className="prose">
            <h1>{searchParams.get("title")}</h1>
            {
                token?
                <div>
                    <a 
                        href={`${params.issue_number}/updateIssue?owner=${owner}&repo=${repo}`} 
                        className="bg-slate-600 px-4 text-white">edit</a>
                    <button 
                        onClick={deleteIssue}
                        className="bg-slate-600 px-4 text-white"
                        >delete</button>
                </div>
                :
                <></>
            }
            {parse(issue.body)}
            <p>{issue.updated_at}</p>
            <h2>Comments</h2>
            <ul>
            {comments.map((comment:Comment, index:number) => (
                <li key={index}>
                    <p>{comment.user}</p>
                    <p>{comment.body}</p>
                    <p>{comment.updated_at}</p>
                </li>
            ))}
            </ul>
        </div>
    );
}