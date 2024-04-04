'use client'

import { useState, useEffect } from "react";
import { useToken } from "@/containers/hook/useToken";
import { useRouter, useSearchParams } from "next/navigation";
import IssueForm from "@/components/issueForm";
import { postIssue } from "../api/issue";
import { getRepoList } from "../api/repoList";
import Error from "@/components/error";

export default function CreateIssue() {
    const { token, user } = useToken();
    const [options, setOptions] = useState([] as string[]);
    const [status, setStatus] = useState<number|null>(200);
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
            try {
                const { number, status } = await postIssue(title, body, owner, repo, token);
                if (status == 200) 
                    // redirect to issue page
                    router.replace(`repos/${repo}/${number}?owner=${owner}`);
                else    
                    setStatus(status);
            } catch (error) {
                setStatus(null);
            }
        }
    }
    if (status !== 200) {
        return <Error status={status} />
    }

    return (
        <div className="container">
            <h1 className="text-2xl text-bold">New Issue</h1>
            <IssueForm submit={submit} issue={null} setIssue={null} options={options}/>
        </div>
    )

}
