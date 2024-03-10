'use client'
import { Octokit } from "octokit";
import { useToken } from "@/containers/hook/useToken";
import { useRouter, useSearchParams } from "next/navigation";
import IssueForm from "@/components/issueForm";

export default function CreateIssue() {
    const { token, user } = useToken();
    const router = useRouter();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner')?? "chia-chi-shen";
    const repo = searchParams.get('repo')?? "test";


    const postIssue = async() => {

        const title = (document.getElementById('title') as HTMLInputElement).value;
        const body = (document.getElementById('body') as HTMLTextAreaElement).value;

        if (title && body.length >= 30) {
            const result = await fetch(`/api/issue?owner=${owner}&repo=${repo}`, {
                method: 'POST',
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
return <IssueForm submit={postIssue} issue={null} setIssue={null}/>

}
