//[issue_number]/updateIssue/page.tsx

'use client'
import { useToken } from "@/containers/hook/useToken";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import IssueForm from "@/components/issueForm";
import { patchIssue, getIssue } from "@/app/api/issue";

export default function UpdateIssue({ params }: { params: { repo: string, issue_number: string } }) {
    const [issue, setIssue] = useState({title: "", body: ""});
    const { token, user } = useToken();
    const router = useRouter();
    const owner = user.toLowerCase();
    const repository = params.repo;

    useEffect(() => {
        const renderIssue = async () => {
            const { issue } = await getIssue(owner, repository, false, Number(params.issue_number), token);
            setIssue(issue);
        }
        if (token)
            renderIssue();
    },[token]);

    const submit = async(title: string,
                            body: string,
                            repo=repository) => {

        const number = await patchIssue(title, body, owner, repo, Number(params.issue_number), token);
        // redirect to issue page
        router.back();
    }

    

return (
    <div className="container">
        <h1 className="text-2xl text-bold">Edit Issue</h1>
        <IssueForm submit={submit} issue={issue} setIssue={setIssue} options={null}/>
    </div>
)

}
