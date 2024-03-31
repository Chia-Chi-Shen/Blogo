'use client'
import { Octokit } from "octokit";
import { useState, useEffect } from "react";
import { useToken } from "@/containers/hook/useToken";
import { useRouter, useSearchParams } from "next/navigation";
import IssueForm from "@/components/issueForm";

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

return (
    <div className="container">
        <h1 className="text-2xl text-bold">New Issue</h1>
        <IssueForm submit={submit} issue={null} setIssue={null} options={options}/>
    </div>
)

}
