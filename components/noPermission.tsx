export default function NoPermission() {
    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <h1 className="text-4xl">No Permission</h1>
            <p className="text-lg">
                You don't have permission to access this page. <br/>
                Please change your permission on Github settings, and login again.
            </p>
        </div>
    )
}