//[issue_number]/updateIssue/page.tsx

'use client'
import { useToken } from "@/containers/hook/useToken";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import IssueForm from "@/components/issueForm/issueForm";

export default function UpdateIssue({ params }: { params: { repo_name: string, issue_number: string } }) {
    const [issue, setIssue] = useState({title: "", body: ""});
    const { token, user } = useToken();
    const router = useRouter();
    const searchParams = useSearchParams();
    const owner = searchParams.get('owner')?? "chia-chi-shen";
    const repository = params.repo_name;

    useEffect(() => {
        const getIssue = async () => {
            const res = await fetch(
                `/api/issue?issue_number=${params.issue_number}&owner=${owner}&repo=${repository}`,{
                    headers: { 'authorization': token }
            });
            const { issue } = await res.json();
            setIssue(issue);
        }
        if (token)
            getIssue();
    },[token]);

    const submit = async(title: string,
                            body: string,
                            repo=repository) => {
        const result = await fetch(`/api/issue?owner=${owner}&repo=${repo}&issue_number=${params.issue_number}`, {
            method: 'PATCH',
            headers: {
                'authorization': token
            },
            body: JSON.stringify({ title, body })
        });
        const number = await result.json();

        // redirect to issue page
        router.back();
    }

    

return <IssueForm submit={submit} issue={issue} setIssue={setIssue} options={null}/>;

}
