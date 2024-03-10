'use client'
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToken } from "@/containers/hook/useToken";

const CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;

const Navbar = () => {
    const router = useRouter();
    const { token, user, avatar } = useToken();
    const loginWithGithub = () => {
        router.push("https://github.com/login/oauth/authorize?client_id=" + CLIENT_ID + "&scope=repo");
      }
    

    useEffect(() => {
        
        let lastScrollTop = 0;

        const navBar = document.querySelector<HTMLElement>(".navbar");
        const userBar = document.querySelector<HTMLElement>(".user-bar");
        
        window.addEventListener("scroll", function() {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollY == 0) {
            if(navBar) {
                navBar.style.display = "";
                navBar.style.top = "";
            }
            if(userBar)
                userBar.style.backgroundColor = ""
        } else {
            if(navBar) {
                navBar.style.display = "fixed";
                navBar.style.top = "5%";
            }
            if(userBar) 
                userBar.style.backgroundColor = "rgb(203 213 225 / 0.6)";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
    }, [])

    return (
        <nav className={`navbar m-0 px-4 md:px-24 bg-[transparent] w-full sticky top-0 flex \
                         justify-between items-center z-[3] transition-[top]`}>
            <div className="logo w-9 h-9 bg-contain bg-no-repeat my-3 bg-center bg-white">
                <a href="/" className="inline-block w-full h-full"/>
            </div>
            <div className="flex justify-end gap-x-9 items-center user-bar rounded-full px-3 \
                             py-2 transition">
            { 
                token? 
                <div className="flex gap-3 items-center">
                    <div>{user}</div>
                    {
                    avatar? 
                    <img src={avatar} className="profile w-6 h-6 rounded-full"/> : 
                    <button className="profile rounded-full bg-sky-300 w-6 h-6"></button>
                    }
                    
                </div>
                :
                <button onClick={loginWithGithub} className="bg-black text-white p-4 rounded-md">Login with Github</button>
            }
            </div>
        </nav>
    )
    
}

export default Navbar;
