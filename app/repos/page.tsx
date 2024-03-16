'use client'
import { useEffect, useState } from "react"
import { useToken } from "@/containers/hook/useToken";
import ListElement from "@/components/listElement";

interface Repo {
    name: string;
}

export default function Repos() {
    const { token, user } = useToken();
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
        if (user)
            getRepos();
    }, [user])

    if (token)
    return (
        <div className="container">
            <h1 className="w-full text-4xl font-bold mb-12 text-[--primary] text-left">My Repositories</h1>
            <div className="grid grid-cols-2 gap-4 w-full">
            {
            (repos.length !== 0) ?
            repos.map((repo, index) => 
                <ListElement key={index} title={repo.name} link={`/repos/${repo.name}`} number={index+1}/>)
                : <></>
            }
            </div>
        </div>
    )
    else
        return <div className="text-2xl font-bold rounded border border-[--primary]">Please Login First</div>;
}