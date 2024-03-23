'use client'
import { Octokit } from "octokit";
import { useState, useEffect } from "react";
import { useToken } from "@/containers/hook/useToken";
import { useRouter, useSearchParams } from "next/navigation";
import IssueForm from "@/components/issueForm/issueForm";

export default function CreateIssue() {
    const { token, user } = useToken();
    const [options, setOptions] = useState([] as string[]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner')?? "chia-chi-shen";

    const getRepos = async () => {
        const res = await fetch(`/api/repo?user=${owner}`,{
            method: 'GET',
            headers: {
                'authorization': token
            }
        });
        const {user: {repositories}} = await res.json();
        setOptions(repositories.nodes
                                .map((repo: {name: string}) => repo.name));
    }
    useEffect(() => {
        if (token)
            getRepos();
    }, [token])

    const submit = async(title: string, 
                         body: string, 
                         repo?: string) => {
        const result = await fetch(`/api/issue?owner=${owner}&repo=${repo}`, {
            method: 'POST',
            headers: {
                'authorization': token
            },
            body: JSON.stringify({ title, body })
        });
        const number = await result.json();

        // redirect to issue page
        router.replace(`repos/${repo}/${number}?owner=${owner}`);
    }

    const postIssue = async() => {

        const title = (document.getElementById('title') as HTMLInputElement).value;
        const repo = (document.getElementById('repo') as HTMLSelectElement).value;
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
            router.replace(`repos/${repo}/${number}?owner=${owner}`);
        }
        else {
            window.alert("Title and Body are required");
        }
    }
return <IssueForm submit={submit} issue={null} setIssue={null} options={options}/>

}
