'use client'
import { Octokit } from "octokit";
import { useToken } from "@/containers/hook/useToken";

export default function CreateIssue() {
    const { token, user } = useToken();

    const authorizedOctokit = new Octokit({
        auth: token
    }); 
    const postIssue = async() => {
        const title = (document.getElementById('title') as HTMLInputElement).value;
        const body = (document.getElementById('body') as HTMLTextAreaElement).value;
        console.log("title: ", title, "body: ", body);

        if (title && body) {
            const result = await authorizedOctokit.request('POST /repos/{owner}/{repo}/issues', {
                owner: "Chia-Chi-Shen",
                repo: 'test',
                title: title,
                body: body,
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
return(
    <div className="mx-12 my-7 w-full">
        <h1>Create Issue</h1>
        <form>
            <label htmlFor="title">Title</label>
            <input id="title" className="rounded outline-0 border border-slate-200 w-[70%] block" type="text" placeholder="Title"/>
            <label htmlFor="body">Body</label>
            <textarea id="body" className="rounded outline-0 border border-slate-200 w-[70%] h-[200px] block" placeholder="Body"/>
        </form>
        <button className="rounded py-2 px-4 bg-slate-300" onClick={postIssue}>Create Issue</button>
    </div>
)

}
