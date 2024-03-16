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

export default function Page({ params }: { params: { repo_name: string, issue_number: string } }) {
    
    const [issue, setIssue] = useState({title: "", body: "", updated_at: ""} as Issue);
    const [comments, setComments] = useState([] as Comment[]);
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner')?? "chia-chi-shen";
    const repo = params.repo_name;
    const { token, user, avatar } = useToken();
    
    useEffect(() => {
        // if navigate to /createIssue, redirect to home page
        console.log("pathName: ", pathName);
        if (pathName === "/createIssue") {
            router.push(`{/repos/${repo}}`);
        }
        
      }, [pathName])

    useEffect(() => { 
        const tooltip = document.querySelector<HTMLElement>(".tooltip");
        if (tooltip) {
            tooltip.style.visibility = "hidden";
        }

        const getIssue = async () => {
            // if no owner and repo specified, use default
            const res = await fetch(`/api/issue?issue_number=${params.issue_number}&owner=${owner}&repo=${repo}&parse=true`);
            const { issue, comments } = await res.json();
            setIssue(issue);
            setComments(comments);
        } 
        // getIssue();  
    }
    ,[]);

    const showTooltip = () => {
        const tooltip = document.querySelector<HTMLElement>(".tooltip");
        if (tooltip) {
            tooltip.style.visibility = "visible";
        }
    }
    const hideTooltip = () => {
        const tooltip = document.querySelector<HTMLElement>(".tooltip");
        if (tooltip) {
            tooltip.style.visibility = "hidden";
        }
    }

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
        <div className="w-[100vw] flex md:justify-center">
        <div className="prose px-8 pt-4 w-full md:w-[70vw] flex flex-col items-center">
        
            <div className="flex gap-3 items-center self-start">
                {
                avatar? 
                <img src={avatar} className="profile w-6 h-6 rounded-full m-0"/> : 
                <button className="profile rounded-full bg-sky-300 w-6 h-6"></button>
                }
                <div>{user}</div>
            </div>
            
            <div className="tooltip relative top-5 text-sm text-[--primary] \
                            border border-[--primary] rounded p-1 self-end opacity-60" >
                close this issue
            </div>
            <div className="issue-header flex gap-3 justify-between items-end my-5 w-full">
            <div className="m-0 text-3xl font-bold leading-[0.8] ">{issue.title}</div>
            {
                token?
                <div className="flex gap-2 opacity-70 items-end ">
                    <a 
                        href={`${params.issue_number}/updateIssue?owner=${owner}`} 
                        className="px-2 text-[--primary]"
                        >{editIcon}</a>
                    
                    <button 
                        onClick={deleteIssue}
                        onMouseOver={showTooltip}
                        onMouseOut={hideTooltip}
                        className="delete-btn px-2 text-[--primary]"
                        >{deleteIcon}</button>
                    </div>
                
                :
                <></>
            }
            </div>
            <div className="w-full bg-white rounded p-2 my-9" >
                {parse(issue.body)}
                <p>{issue.updated_at}</p>
            </div>
            <h2 className="text-[--primary] self-start "
                >Comments</h2>
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