'use client'
import { useEffect, useState } from "react"
import { useToken } from "@/containers/hook/useToken";
import ListElement from "@/components/listElement";
import NoPermission from "@/components/noPermission";

interface Repo {
    name: string;
}

export default function Repos() {
    const { token, user, tokenScope } = useToken();
    const [repos, setRepos] = useState([] as Repo[]);

    const getRepos = async () => {
        const res = await fetch(`/api/repo?user=${user}`,{
            method: 'GET',
            headers: {
                'authorization': token
            }
        });
        const {user: {repositories}} = await res.json();
        setRepos(repositories.nodes);
        console.log(repositories.nodes);
    }

    useEffect(() => {
        if (user && token)
            getRepos();
    }, [user])

    if (tokenScope === "repo")
    return (
        <div className="container">
            <h1 className="w-full text-4xl font-bold mb-12 text-[--primary] text-left">My Repositories</h1>
            <div className="grid grid-cols-2 gap-4 w-full">
            {
            (repos.length !== 0) ?
            repos.map((repo, index) => 
                <ListElement key={index} title={repo.name} link={`/repos/${repo.name}`} number={index+1}
                            body={null} comments={null} updated_at={null}/>)
                : <></>
            }
            </div>
        </div>
    )
    else
        return <NoPermission/>
}