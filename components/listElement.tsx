import Link from 'next/link';
import { commentIcon } from './icon';
import { comment } from 'postcss';

interface ListElementProps {
    title: string;
    body: string|null;
    // repo: string;
    link: string;
    number: number|null;
    comments: number|null;
    updated_at: string|null;
}

const ListElement = ({ title, body, link, number, comments, updated_at } : ListElementProps) =>{

    const toDaySpan = (updated_at: string) => {
        const now = new Date().getTime();
        const updated = new Date(updated_at).getTime();
        const day_span = (now - updated)/1000/60/60/24;
        if (day_span < 31)
            return Math.floor(day_span) + " days ago";
        else if (day_span < 365)
            return Math.floor(day_span/30) + " months ago";
        else
            return Math.floor(day_span/365) + " years ago";
    }

    return (
        <div className="w-full rounded p-7 bg-white border-b border-r border-[--primary-semilight] \
                         md:rounded md:shadow ">
        <Link href={link} className="block w-full h-full" >
            <div className="w-full h-full flex justify-between">
                <div className='h-full flex flex-col gap-3 ml-2 max-w-[70%]'>
                <h1 className="title truncate font-medium text-xl md:text-2xl text-[--text-color]">{title}</h1>
                {body &&
                <p className="body truncate text-sm md:text-base text-[--primary-semilight]">{body}</p>}
                {comments != null?
                <div className='flex gap-2 items-center mt-2'>
                    {commentIcon}
                    <p className="comments text-[--text-color] text-xs md:text-sm">{comments}</p>
                    {updated_at && <p className="updated-at text-[--text-color] text-xs md:text-sm ml-3">
                        {toDaySpan(updated_at)}</p>}
                </div>:<></>}
                </div>
                {number &&
                <div className="bg-[--primary-light] min-w-6 h-6 text-center text-white rounded text-sm relative bottom-4 left-4"
                    >{number}</div>}
            </div>
        </Link>
        </div> 
    )
}

export default ListElement;