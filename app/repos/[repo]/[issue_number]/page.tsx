'use client'
import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import parse from "html-react-parser";
import { useToken } from "@/containers/hook/useToken";
import { editIcon, deleteIcon, commentIcon } from "@/components/icon";
import Link from "next/link";
import { getIssue, deleteIssue } from "@/app/api/issue";

type Issue = {
    title: string, 
    body: string, 
    updated_at: string,
    author?: string,
    avatar?: string
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

        const renderIssue = async () => {
            const { issue, comments } = await getIssue(owner, repo, true, Number(params.issue_number), token);
            setIssue(issue);
            setComments(comments);
        } 
        renderIssue();  
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

    const closeIssue = async() => {
        await deleteIssue(owner, repo, Number(params.issue_number), token);
        router.push("/repos/"+repo);
    }

    return (
        <div className="w-[100vw] flex md:justify-center">
        <div className="prose max-w-none px-8 pt-4 w-full md:w-[70vw] flex flex-col items-center">
            {/* author */}
            <div className="flex gap-3 items-center self-start">
                {issue.avatar?
                <img src={issue.avatar} className="profile w-6 h-6 rounded-full m-0"/> : 
                <button className="profile rounded-full bg-slate-300 w-6 h-6"></button>
                }
                <div>{issue.author || "unknown"}</div>
            </div>
            <div className="tooltip relative top-12 text-sm text-white \
                            bg-[--primary] rounded p-1 self-end opacity-30" >
                close this issue
            </div>

            {/* issue header */}
            {issue.title? 
            <div className="issue-header flex flex-col mt-5 w-full gap-4">
            <div className="m-0 text-3xl font-bold ">{issue.title}</div>

            <div className="flex gap-3 justify-end items-end">
                <div className="text-slate-400 text-sm tracking-wide font-light">
                    {new Date(issue.updated_at).toLocaleString().toLowerCase()}</div>
                {
                user.toLowerCase()===owner && tokenScope === 'repo'?
                <div className="flex gap-2 opacity-70 items-end ">
                    <Link 
                        href={`${params.issue_number}/updateIssue?owner=${owner}`} 
                        className="px-2 text-[--primary]"
                        >{editIcon}</Link>
                    
                    <button 
                        onClick={closeIssue}
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
            <div className="flex gap-4 text-[--primary] self-start items-center mb-3 mt-5">
            <h2 className="text-[--primary] m-0"
                >Comments</h2>
            {commentIcon}
            </div>
            {
            comments.length === 0?
            <div className="bg-gray-200 rounded h-[10vh] w-full p-5 text-slate-400">
                No comments yet
            </div>
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