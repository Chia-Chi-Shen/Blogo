'use client'
import { Octokit } from "octokit";
import { useState, useEffect } from "react";
import { useToken } from "@/containers/hook/useToken";
import { useRouter, useSearchParams } from "next/navigation";
import IssueForm from "@/components/issueForm";
import { postIssue } from "../api/issue";
import { getRepoList } from "../api/repoList";

export default function CreateIssue() {
    const { token, user } = useToken();
    const [options, setOptions] = useState([] as string[]);
    const router = useRouter();
    const owner = user.toLowerCase();

    // get repo list for options
    const getRepos = async () => {
        const res = await getRepoList(owner, token);
        setOptions(res);
    }
    useEffect(() => {
        if (token)
            getRepos();
    }, [token])

    const submit = async(title: string, 
                         body: string, 
                         repo?: string) => {
        if (repo)
        {
            const number = await postIssue(title, body, owner, repo, token);

            // redirect to issue page
            router.replace(`repos/${repo}/${number}?owner=${owner}`);
        }
    }

return (
    <div className="container">
        <h1 className="text-2xl text-bold">New Issue</h1>
        <IssueForm submit={submit} issue={null} setIssue={null} options={options}/>
    </div>
)

}
