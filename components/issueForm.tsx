type Submit = () => Promise<void>;

const IssueForm  = ({ submit, setIssue, issue } : 
                    { submit: Submit, setIssue: any , issue: any }) => {
    return (
        <div className="mx-12 my-7 w-full">
        <h1>Edit Issue</h1>
        <form>
            <label htmlFor="title">Title</label>
            <input id="title" className="rounded outline-0 border border-slate-200 w-[70%] block" 
                    type="text" placeholder="Title" value={issue?.title}
                    onChange={(e) => setIssue ? setIssue({...issue, title: e.target.value}):{}}/>
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