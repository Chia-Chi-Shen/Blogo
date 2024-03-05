'use client'
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

const Navbar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const loginWithGithub = () => {
        router.push("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + "&scope=repo");
      }

    useEffect(() => {
        
    }, [])

    return (
        <div className="navbar m-0 px-24 bg-white w-full sticky top-0 flex justify-between items-center shadow z-[3]">
        <div className="logo w-9 h-9 bg-contain bg-no-repeat my-3 bg-center">
            <a href="/main" className="inline-block w-full h-full"/>
        </div>
        <div className="flex justify-end gap-x-9 items-center">
        <nav className="">
            <ul className="flex gap-x-4 w-[250px] justify-end items-center">
            <li><a href="#">home</a></li>
            </ul>
        </nav>
        { 
            searchParams.get("code")? 
            <a href="/login" className="profile rounded-full bg-sky-300 w-6 h-6"></a> :
            <button onClick={loginWithGithub} className="bg-black text-white p-4 rounded-md">Login with Github</button>
        }
        </div>
        </div>
    )
}

export default Navbar;
