'use client'
import { useEffect, useState } from "react";

type Submit = () => Promise<void>;

const IssueForm  = ({ submit, setIssue, issue, options } : 
                    { submit: Submit, setIssue: any , issue: any, options: null | string[] }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");

    const onClickOption = (option: string) => {
        setSelected(option);
        setOpen(!open);
    };

    const onClickSelector = () => { 
        
        
            
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
        <div className="mx-12 my-7 w-full">
        <h1>Edit Issue</h1>
        <form>
            {/* Title */}
            <label htmlFor="title">Title</label>
            <input id="title" className="rounded outline-0 border border-slate-200 w-[70%] block" 
                    type="text" placeholder="Title" value={issue?.title}
                    onChange={(e) => setIssue ? setIssue({...issue, title: e.target.value}):{}}/>
            {/* Repository */}
            {
                options?
                <>
                <label htmlFor="selector">Repository</label>
                <div className="relative block text-left w-[70%]">
                    <input type="button" id="repo" value={selected} className="selector py-1 px-2 bg-slate-200 border-0 rounded w-full" onClick={() => setOpen(!open)}></input>
                    <div className="options absolute right-0 mt-2 w-[min-content] h-0 overflow-y-auto rounded-md shadow-lg bg-white 
                                    ring-1 ring-black ring-opacity-5 focus:outline-none transition-[height] ease-in duration-150 hidden delay-300">
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
            
            {/* Body */}
            <label htmlFor="body">Body</label>
            <textarea id="body" className="rounded outline-0 border border-slate-200 w-[70%] h-[200px] block" 
                    placeholder="Body" value={issue?.body}
                    onChange={(e) => setIssue ? setIssue({...issue, body: e.target.value}):{}}/>
        </form>
        <button className="rounded py-2 px-4 bg-slate-300" onClick={submit}>Submit Edit</button>
        </div>
    )
}

export default IssueForm;