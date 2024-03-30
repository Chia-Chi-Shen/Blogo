'use client'
import { use, useEffect, useState } from "react";

type Submit = ((title: string, body: string, repo?: string) => Promise<void>);

const IssueForm  = ({ submit, setIssue, issue, options } : 
                    { submit: Submit, setIssue: any , issue: any, options: null | string[] }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");

    const onClickOption = (option: string) => {
        setSelected(option);
        setOpen(!open);
    };

    const validateSubmit = async() => {
        const title = document.getElementById('title') as HTMLInputElement;
        const titleValue = title.value;
        const body = document.getElementById('body') as HTMLTextAreaElement;
        const bodyValue = body.value;
        const repo = document.getElementById('repo') as HTMLInputElement;
        const repoValue = repo?.value;
        const warning = document.querySelector('.warning') as HTMLElement;


        if (title && bodyValue.length >= 30) {
            if(!options)
                await submit(titleValue, bodyValue);
            else if (options && repo)
                await submit(titleValue, bodyValue, repoValue);
            else
                repo.style.border = "1.5px solid red";
        }
        else {
            if (titleValue === "")
                title.style.border = "1.5px solid red";
            if (bodyValue.length < 30){
                warning.style.display = "block";
                body.style.border = "1.5px solid red";
            }
            if (!repoValue)
                repo.style.border = "1.5px solid red";
        }
    }

    useEffect(() => {
        var options = document.querySelector<HTMLElement>('.options')
        if (options)
        {
            options.style.display = open ? "block" : "none"  ;
            options.style.height = open ? "20vh" : "0"  ;
        }
    }, [open])

    return (
        <div className="container">
        <h1 className="text-2xl text-bold">{options? "New Issue":"Edit Issue"}</h1>
        <form className="w-full flex flex-col my-10">
            <div className="w-full flex gap-7 justify-between">
            {/* Title */}
            <label htmlFor="title" className="hidden">Title</label>
            <input id="title" className="w-full rounded outline-0 border border-slate-200 block p-2" 
                    type="text" placeholder="Title" value={issue?.title}
                    onChange={(e) => setIssue ? setIssue({...issue, title: e.target.value}):{}}/>
            {/* Repository */}
            {
                options?
                <>
                <label htmlFor="selector" className="hidden">Repository</label>
                <div className="relative block text-left w-[300px]">
                    <input type="button" id="repo" value={selected} 
                            className="selector py-1 px-2 bg-slate-200 border-0 rounded w-full h-full" 
                            onClick={() => setOpen(!open)}></input>
                    <button className="absolute right-4 top-2 z-[2]" type="button"
                            onClick={() => setOpen(!open)}>▾</button>
                    <div className="options absolute right-0 mt-2 w-[min-content] h-0 overflow-y-auto rounded-md shadow-lg bg-white
                                    ring-1 ring-black ring-opacity-5 focus:outline-none transition-[height] ease-in duration-150 delay-300">
                        <div className="py-1">
                        {options.map((option, index) => 
                            <input type="button" key={index} className="block px-4 py-2 text-sm text-gray-700 w-full hover:bg-gray-100" 
                                value={option} onClick={() => onClickOption(option)}/>)}
                        </div>
                    </div>
                </div>
                </>:
                <></>
            }
            </div>
            
            {/* Body */}
            <label htmlFor="body" className="mt-8 mb-3 text-lg font-semibold">Content</label>
            <textarea id="body" className="rounded outline-0 border border-slate-200 w-full h-[50vh] block p-2" 
                    placeholder="Content should be over 30 words. " value={issue?.body}
                    onChange={(e) => setIssue ? setIssue({...issue, body: e.target.value}):{}}/>
            <p className="warning text-red-400 text-sm mt-1" style={{display: "none"}}>* Content should be over 30 words.</p>
        </form>
        
        <button className="rounded py-2 px-4 bg-slate-300 hover:bg-[--primary] hover:text-white" onClick={validateSubmit}>Submit</button>
        </div>
    )
}

export default IssueForm;