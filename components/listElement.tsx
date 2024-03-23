import Link from 'next/link';
interface ListElementProps {
    title: string;
    // repo: string;
    link: string;
    number: number|null;
}

const ListElement = ({ title, link, number } : ListElementProps) =>{
    return (
        <div className="w-full h-[100px] rounded p-7 bg-white border-b border-r border-[--primary-semilight] \
                         md:rounded md:shadow ">
        <Link href={link} className="block w-full h-full" >
            <div className="w-full h-full flex justify-between">
                <h1 className="truncate font-medium text-xl md:text-2xl text-[--text-color] ml-2 max-w-[70%]">{title}</h1>
                {number &&
                <div className="bg-[--primary-light] w-6 h-6 text-center text-white rounded text-sm relative bottom-4 left-4"
                    >{number}</div>}
            </div>
        </Link>
        </div> 
    )
}

export default ListElement;