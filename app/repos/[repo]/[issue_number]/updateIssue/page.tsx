//[issue_number]/updateIssue/page.tsx

'use client'
import { useToken } from "@/containers/hook/useToken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IssueForm from "@/components/issueForm";
import { patchIssue, getIssue } from "@/app/api/issue";
import Error from "@/components/error";

export default function UpdateIssue({ params }: { params: { repo: string, issue_number: string } }) {
    const [issue, setIssue] = useState({title: "", body: ""});
    const [status, setStatus] = useState<number|null>(200);
    const { token, user } = useToken();
    const router = useRouter();
    const owner = user.toLowerCase();
    const repository = params.repo;

    useEffect(() => {
        const renderIssue = async () => {
            try {
                const { issue, status } = await getIssue(owner, repository, false, Number(params.issue_number), token);
                if (status == 200 && issue)
                    setIssue(issue);
                else
                    setStatus(status);
            } catch (error) {
                setStatus(null);
            }
        }
        if (token)
            renderIssue();
    },[token]);

    const submit = async(title: string,
                            body: string,
                            repo=repository) => {
        try {
        const { status } = await patchIssue(title, body, owner, repo, Number(params.issue_number), token);
        // redirect to issue page
        if (status == 200)
            router.back();
        else
            setStatus(status);
        
        } catch (error) {
            setStatus(null);
        }
    }

    if (status !== 200) {
        return <Error status={status} />
    }

    return (
        <div className="container">
            <h1 className="text-2xl text-bold">Edit Issue</h1>
            <IssueForm submit={submit} issue={issue} setIssue={setIssue} options={null}/>
        </div>
    )

}
