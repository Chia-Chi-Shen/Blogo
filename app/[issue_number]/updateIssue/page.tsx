//[issue_number]/updateIssue/page.tsx

'use client'
import { Octokit } from "octokit";
import { useToken } from "@/containers/hook/useToken";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function UpdateIssue( { params }: { params: { issue_number: string } }) {
    const [issue, setIssue] = useState({title: "", body: ""});
    const { token, user } = useToken();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner')?? "chia-chi-shen";
    const repo = searchParams.get('repo')?? "test";

    const authorizedOctokit = new Octokit({
        auth: token
    }); 

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

    const postIssue = async() => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const body = (document.getElementById('body') as HTMLTextAreaElement).value;
        console.log("title: ", title, "body: ", body);

        if (title && body) {
            const result = await authorizedOctokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
                owner: searchParams.get('owner')?? "chia-chi-shen",
                repo: searchParams.get('repo')?? "test",
                title: title,
                body: body,
                issue_number: Number(params.issue_number),
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28'
                }
            })
            console.log(result);
        }
        else {
            window.alert("Title and Body are required");
        }
    }

    const titleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        ;
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
        <button className="rounded py-2 px-4 bg-slate-300" onClick={postIssue}>Create Issue</button>
    </div>
)

}
