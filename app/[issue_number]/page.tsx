'use client'
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import parse from "html-react-parser";
import { useToken } from "@/containers/hook/useToken";
import { editIcon, deleteIcon } from "@/components/icon";

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
    const { token, user, avatar } = useToken();
    
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
        <div className="px-8 pt-4">
        <div className="prose">
            
            <div className="flex gap-3 items-center">
                {
                avatar? 
                <img src={avatar} className="profile w-6 h-6 rounded-full m-0"/> : 
                <button className="profile rounded-full bg-sky-300 w-6 h-6"></button>
                }
                <div>{user}</div>
            </div>

            <div className="issue-header flex gap-3 justify-between items-center my-5">
            <h1 className="m-0">{searchParams.get("title")}</h1>
            {
                token?
                <div className="flex gap-1">
                    <a 
                        href={`${params.issue_number}/updateIssue?owner=${owner}&repo=${repo}`} 
                        className="px-2 text-dark"
                        >{editIcon}</a>
                    <button 
                        onClick={deleteIssue}
                        className="px-2 text-dark"
                        >{deleteIcon}</button>
                </div>
                :
                <></>
            }
            </div>
            <div className="bg-white rounded p-2 my-9" >
                {parse(issue.body)}
                <p>{issue.updated_at}</p>
            </div>
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
        </div></div>
    );
}