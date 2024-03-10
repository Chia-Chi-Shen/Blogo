interface ListElementProps {
    title: string;
    // repo: string;
    number: number;
}

const ListElement = ({title, number} : ListElementProps) =>{
    return (
        <div className="w-full h-[100px] rounded p-7 bg-white border-b border-slate-200 md:rounded md:shadow ">
        <a href={`/${number}?title=${title}`} className="block w-full h-full" >
            <h1 className="font-bold text-xl">{title}</h1>
        </a>
        </div>
    )
}

export default ListElement;