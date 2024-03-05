interface ListElementProps {
    title: string;
    // repo: string;
    number: number;
}

const ListElement = ({title, number} : ListElementProps) =>{
    return (
        <div className="w-[60%] h-[10%] p-7 bg-white shadow rounded ring ring-slate-100 hover:ring-blue-300">
        <a href={`/${number}?title=${title}`} className="block w-full h-full" ><h1>{title}</h1></a>
        </div>
    )
}

export default ListElement;