export default function Error ({ status } : { status: number|null }) {
    return (
        <div className="container mt-10 rounded bg-white p-3">
            <h1 className="text-2xl font-medium">{ status?
            `Status ${status}`
            : "Oops!"
            }</h1>
            <p className="my-4">Something went wrong.😢</p>
        </div>
    );
}