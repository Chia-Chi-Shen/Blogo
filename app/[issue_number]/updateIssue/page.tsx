//[issue_number]/updateIssue/page.tsx

'use client'
import { Octokit } from "octokit";
import { useToken } from "@/containers/hook/useToken";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateIssue( { params }: { params: { issue_number: string } }) {
    const [issue, setIssue] = useState({title: "", body: ""});
    const { token, user, authorizedOctokit } = useToken();
    const router = useRouter();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner')?? "chia-chi-shen";
    const repo = searchParams.get('repo')?? "test";

    useEffect(() => {
        const getIssue = async () => {
            const res = await fetch(
                `/api/issue?issue_number=${params.issue_number}&owner=${owner}&repo=${repo}`,{
                    headers: { 'authorization': token }
            });
            const { issue } = await res.json();
            setIssue(issue);
        }
        getIssue();
    },[]);

    const updateIssue = async() => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const body = (document.getElementById('body') as HTMLTextAreaElement).value;

        if (title && body) {
            const result = await fetch(`/api/issue?owner=${owner}&repo=${repo}&issue_number=${params.issue_number}`, {
                method: 'PATCH',
                headers: {
                    'authorization': token
                },
                body: JSON.stringify({ title, body })
            });
            const number = await result.json();

            // redirect to issue page
            router.replace(`/${number}?owner=${owner}&repo=${repo}&title=${title}`);
        }
        else {
            window.alert("Title and Body are required");
        }
    }

return(
    <div className="mx-12 my-7 w-full">
        <h1>Edit Issue</h1>
        <form>
            <label htmlFor="title">Title</label>
            <input id="title" className="rounded outline-0 border border-slate-200 w-[70%] block" 
                    type="text" placeholder="Title" value={issue.title}
                    onChange={(e) => setIssue({...issue, title: e.target.value})}/>
            <label htmlFor="body">Body</label>
            <textarea id="body" className="rounded outline-0 border border-slate-200 w-[70%] h-[200px] block" 
                    placeholder="Body" value={issue.body}
                    onChange={(e) => setIssue({...issue, body: e.target.value})}/>
        </form>
        <button className="rounded py-2 px-4 bg-slate-300" onClick={updateIssue}>Submit Edit</button>
    </div>
)

}
