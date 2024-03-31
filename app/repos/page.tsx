'use client'
import { useEffect, useState } from "react"
import { useToken } from "@/containers/hook/useToken";
import ListElement from "@/components/listElement";
import NoPermission from "@/components/noPermission";
import { getRepoList } from "../api/repoList";

export default function Repos() {
    const { token, user, tokenScope } = useToken();
    const [repos, setRepos] = useState([] as string[]);

    const renderRepoList = async () => {
        const res = await getRepoList(user, token);
        setRepos(res);
    }

    useEffect(() => {
        if (user && token)
            renderRepoList();
    }, [user])

    if (tokenScope === "repo")
    return (
        <div className="container">
            <h1 className="w-full text-4xl font-bold mb-12 text-[--primary] text-left">My Repositories</h1>
            <div className="grid grid-cols-2 gap-4 w-full">
            {
            (repos.length !== 0) ?
            repos.map((repo, index) => 
                <ListElement key={index} title={repo} link={`/repos/${repo}`} number={index+1}
                            body={null} comments={null} updated_at={null}/>)
                : <></>
            }
            </div>
        </div>
    )
    else
        return <NoPermission/>
}