'use client'
import { useEffect, useState } from "react";

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
            if (bodyValue.length < 30)
                body.style.border = "1.5px solid red";
        }
    }

    useEffect(() => {
        var options = document.querySelector<HTMLElement>('.options')
        if (options)
        {
            options.style.display = open ? "none" : "block";
            options.style.height = open ? "0" : "20vh";
        }
    }, [open])

    return (
        <div className="container">
        <h1 className="text-2xl text-bold">{options? "New Issue":"Edit Issue"}</h1>
        <form className="w-full flex flex-col mt-10">
            <div className="w-full flex gap-2">
            {/* Title */}
            <label htmlFor="title" className="hidden">Title</label>
            <input id="title" className="w-full rounded outline-0 border border-slate-200 block" 
                    type="text" placeholder="Title" value={issue?.title}
                    onChange={(e) => setIssue ? setIssue({...issue, title: e.target.value}):{}}/>
            {/* Repository */}
            {
                options?
                <>
                <label htmlFor="selector" className="hidden">Repository</label>
                <div className="relative block text-left w-full">
                    <input type="button" id="repo" value={selected} 
                            className="selector py-1 px-2 bg-slate-200 border-0 rounded w-full" 
                            onClick={() => setOpen(!open)}></input>
                    <button className="absolute right-4 top-0 z-[2]" type="button"
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
            <label htmlFor="body">Content</label>
            <textarea id="body" className="rounded outline-0 border border-slate-200 w-full h-[200px] block" 
                    placeholder="Content should be over 30 words. " value={issue?.body}
                    onChange={(e) => setIssue ? setIssue({...issue, body: e.target.value}):{}}/>
        </form>
        <button className="rounded py-2 px-4 bg-slate-300" onClick={validateSubmit}>Submit Edit</button>
        </div>
    )
}

export default IssueForm;