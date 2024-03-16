'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToken } from "@/containers/hook/useToken";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

const Navbar = () => {
    const router = useRouter();
    const { token, user, avatar } = useToken();
    const [isFuncOpen, setIsFuncOpen] = useState(false);
    const loginWithGithub = () => {
        router.push("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + "&scope=repo");
      }
    useEffect(() => {
        const userFunc = document.querySelector<HTMLElement>(".user-func");
        if (userFunc)
            userFunc.style.display = isFuncOpen? "": "none";
            
    }, [isFuncOpen])

    useEffect(() => {
        
        let lastScrollTop = 0;

        const navBar = document.querySelector<HTMLElement>(".navbar");
        const userBar = document.querySelector<HTMLElement>(".user-bar");
        const userFunc = document.querySelector<HTMLElement>(".user-func");
        
        window.addEventListener("scroll", function() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollY == 0) {
            if(navBar) {
                navBar.style.display = "";
                navBar.style.top = "";
            }
            if(userBar)
                userBar.style.backgroundColor = ""
            if (userFunc)
                userFunc.style.top = "";
        } else {
            if(navBar) {
                navBar.style.display = "fixed";
                navBar.style.top = "70px";
            }
            if(userBar) 
                userBar.style.backgroundColor = "rgb(203 213 225 / 0.6)";
            if (userFunc)
                userFunc.style.top = "134px";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
    }, [])

    return (
        <>
        <nav className={`navbar m-0 px-4 md:px-20 bg-[transparent] w-full sticky top-0 flex \
                         justify-center z-[3] transition-[top]`}>
            <div className="w-full flex justify-end items-center gap-2">
            <div className="logo w-9 h-9 bg-contain bg-no-repeat my-3 bg-center bg-white">
                <a href="/" className="inline-block w-full h-full"/>
            </div>
            <div className="flex justify-end gap-x-9 items-center user-bar rounded-full px-3 \
                             py-2 transition duration-300">
            { 
                token? 
                <div className="flex gap-3 items-center">
                    <div className="text-[--primary]">{user}</div>
                    {
                    avatar? 
                    <button className={`profile rounded-full w-6 h-6 md:w-9 md:h-9 hover:ring-4 hover:ring-[--primary-light]`}
                            onClick={() =>setIsFuncOpen(!isFuncOpen)}>
                        <img src={avatar} className="w-full h-full rounded-full"/>
                    </button>:
                    <button className="profile rounded-full bg-sky-300 w-6 h-6"></button>
                    }
                    
                </div>
                :
                <div className="flex gap-3 items-center border border-[--primary] p-1.5 rounded-md ">
                <button onClick={loginWithGithub} 
                        className="text-[--primary] text-sm font-light \"
                        >Login with Github</button>
                <img src="/images/github-icon.png" className="w-6 h-6 rounded-full"/>
                </div>
            }
            </div></div>
        </nav>
        <div className="user-func fixed right-4 md:right-24 top-16 flex flex-col gap-3 \
                         items-center rounded bg-white shadow p-1">
                <a href={`/repos?user=${user}`} 
                    className="p-2 text-[--primary] hover:bg-[--primary-light]">My Repo</a>
                <a href="/createIssue" 
                    className="p-2 text-[--primary] hover:bg-[--primary-light]">New Post</a>
        </div>
        </>
    )
    
}

export default Navbar;
