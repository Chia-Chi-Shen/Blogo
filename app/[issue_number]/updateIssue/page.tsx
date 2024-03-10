//[issue_number]/updateIssue/page.tsx

'use client'
import { useToken } from "@/containers/hook/useToken";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import IssueForm from "@/components/issueForm";

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

        if (title && body.length >= 30) {
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

return <IssueForm submit={updateIssue} issue={issue} setIssue={setIssue}/>;

}
