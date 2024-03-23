'use client'
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import parse from "html-react-parser";
import { useToken } from "@/containers/hook/useToken";
import { editIcon, deleteIcon } from "@/components/icon";
import Link from "next/link";

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

export default function Page({ params }: { params: { repo: string, issue_number: string } }) {
    
    const [issue, setIssue] = useState({title: "", body: "", updated_at: ""} as Issue);
    const [comments, setComments] = useState([] as Comment[]);
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner')?? "chia-chi-shen";
    const repo = params.repo;
    const { token, user, avatar, tokenScope } = useToken();
    
    useEffect(() => {
        // if navigate to /createIssue, redirect to home page
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
        getIssue();  
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
            {/* author */}
            {
            user === owner? 
            <div className="flex gap-3 items-center self-start">
                {avatar?
                <img src={avatar} className="profile w-6 h-6 rounded-full m-0"/> : 
                <button className="profile rounded-full bg-slate-300 w-6 h-6"></button>
                }
                <div>{owner}</div>
            </div>: <></>
            }
            <div className="tooltip relative top-5 text-sm text-[--primary] \
                            border border-[--primary] rounded p-1 self-end opacity-60" >
                close this issue
            </div>

            {/* issue header */}
            {issue.title? 
            <div className="issue-header flex flex-col my-5 w-full">
            <div className="m-0 text-3xl font-bold ">{issue.title}</div>

            <div className="flex gap-3 justify-end items-end">
                <div className="text-slate-400 text-sm">
                    {new Date(issue.updated_at).toLocaleString()}</div>
                {
                user===owner && tokenScope === 'repo'?
                <div className="flex gap-2 opacity-70 items-end ">
                    <Link 
                        href={`${params.issue_number}/updateIssue?owner=${owner}`} 
                        className="px-2 text-[--primary]"
                        >{editIcon}</Link>
                    
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

            </div>
            :
            <div className="m-0 h-10 w-full gradient-bg rounded"></div>
            }

            {/* issue body */}
            {issue.body?
            <div className="w-full bg-white rounded px-4 py-2 my-5" >
                {parse(issue.body)}
            </div>
            :
            <div className="w-full gradient-bg h-[40vh] my-9 rounded"></div>
            }
            
            {/* issue comments */}
            <h2 className="text-[--primary] self-start "
                >Comments</h2>
            {
            comments.length === 0?
            <></>
            :
            <div className="bg-white/90 rounded">
            {comments.map((comment:Comment, index:number) => (
                <div key={index} className="w-full px-3 py-1 border-b">
                    <div className="flex justify-between items-center mt-1">
                        <div className="font-semibold">{comment.user}</div>
                        <div className="text-slate-400 text-xs">
                            {new Date(comment.updated_at).toLocaleString()}</div>
                    </div>
                    <p className="w-full ">{comment.body}</p>
                </div>
            ))}
            </div>
            }
        </div></div>
    );
}