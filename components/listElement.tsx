interface ListElementProps {
    title: string;
}

const ListElement = ({title} : ListElementProps) =>{
    return (
        <div className="w-[60%] p-7 bg-white shadow rounded">
        <h1>{title}</h1>
        </div>
    )
}

export default ListElement;