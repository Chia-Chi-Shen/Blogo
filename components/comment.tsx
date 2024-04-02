'use client'
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { Octokit } from 'octokit';

type Comment = {
    user: string, 
    body: string, 
    updated_at: string
};

export default function Comment({ comment } : { comment: Comment }) {
    const [commentBody, setCommentBody] = useState("");
    
    const parseComment = async () => {
        const octokit = new Octokit();
        const { data: commentBody } = await octokit.request('POST /markdown', {
            text: comment.body,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
            })
        setCommentBody(commentBody);
    }

    useEffect(() => {
        parseComment();
    }, []);

    return (
        <div className="w-full px-4 py-2 border-b">
            <div className="flex justify-between items-center mt-1">
                <div className="font-semibold text-[--text-color]">{comment.user}</div>
                <div className="text-slate-400 text-xs font-light">
                    {new Date(comment.updated_at).toLocaleString().toLowerCase()}</div>
            </div>
            <p className="w-full ml-3">{ parse(commentBody) }</p>
        </div>
    )
}