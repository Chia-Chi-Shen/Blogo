// containers/useToken.js
'use client'
import { useContext, createContext, useState, useEffect, useMemo } from "react";
import { Octokit } from "@octokit/core";


type TokenContextType = {
    code: string;
    setCode: (value: string) => void;
    token: string;
    setToken: (value: string) => void;
    // authorizedOctokit: Octokit;
    user: string;
    avatar: string;
    tokenScope: string;
};

const TokenContext = createContext<TokenContextType>(
    {
        code: "",
        setCode: () => {},
        token: "",
        setToken: () => {},
        // authorizedOctokit: new Octokit(),
        user: "",
        avatar: "",
        tokenScope: ""
    }
);

export const TokenProvider = ({children,}: Readonly<{children: React.ReactNode;}>) => {
    const [code, setCode] = useState("");
    const [token, setToken] = useState("");
    const [tokenScope, setTokenScope] = useState("")
    const [user, setUser] = useState("");
    const [avatar, setAvatar] = useState("");
    // var authorizedOctokit = new Octokit();

    // reset token if code changes, code expires after 10 minutes
    useEffect(() => {
        const savedCode = localStorage.getItem('code'); 
        // prevent from requesting again

        if (code){
            // if code is not saved or is different from the saved code
            if ( savedCode !== code) {
                const login = async () => {
                    const res = await fetch("/api/login?code=" + code)
                    const { token, user, avatar } = await res.json()
                    setToken(token);
                    setUser(user);
                    setAvatar(avatar);
                }
                try {
                    login();
                }
                catch (error: any) {
                    console.log(`Fail to login! Status: ${error.status}. Message: ${error.response.data.message}`)
                }
                   
                localStorage.setItem('code', code);
            }
            // if code has not been saved
            else if (!savedCode){
                localStorage.setItem('code', code);
            }
        }
        
    }, [code]);

    // get token and user from local storage
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            setToken(savedToken);
        }
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(savedUser);
        }
        const savedAvatar = localStorage.getItem('avatar');
        if (savedAvatar) {
            setAvatar(savedAvatar);
        }
        console.log("render useToken");
    }, []);

    // set token in local storage, and create authorized Octokit
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            const checkToken = async () => {
                const res = await fetch(`/api/token`, {
                    method: 'POST',
                    headers: {'authorization': token} 
                })
                const scope = await res.json();
                setTokenScope(scope);
            } 
            checkToken();
        } 
    }, [token]);

    // save avatar
    useEffect(() => {
        if (avatar) {
            localStorage.setItem('avatar', avatar);
        }
    }, [avatar]);

    // save user name 
    useEffect(() => {
        if (user) {
            localStorage.setItem('user', user);
        }
    }, [user]);

    // save token scope
    useEffect(() => {
        if (tokenScope) {
            localStorage.setItem('tokenScope', tokenScope);
        }
    }, [tokenScope])



    return (
        <TokenContext.Provider value={{ code, setCode, token, setToken, 
                                     user, avatar, tokenScope}}>
            {children}
        </TokenContext.Provider>
    );
};

export const useToken = () => useContext(TokenContext);
