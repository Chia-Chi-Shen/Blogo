import { Octokit } from "octokit";


export const getIssueList = async (repo:string, page:string, token?:string) => {

  const octokit = new Octokit({ auth: token });
  
  if (!repo) 
      return Response.json({ error: "repo is required" });
  const q = encodeURIComponent(`repo:${repo} is:open is:issue`);
  let url = `https://api.github.com/search/issues?q=${q}&sort=created&per_page=10&page=${page}`

  try {
    const result = await octokit.request(`GET ${url}`, {
        // per_page: 10,
    });
    // console.log(result.data.items[0]);
    const issues = result.data.items.map((issue:any) => ({
      title: issue.title, 
      body: issue.body,
      number: issue.number ? issue.number : null,
      comments: issue.comments,
      updated_at: issue.updated_at,
    }))

  //   console.log("newTitleAndNumber: ",newTitleAndNumber)
    const linkHeader = result.headers.link;
    // console.log("linkHeader: ", linkHeader);
  
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="next")/i;
    const nextUrl = linkHeader?.match(nextPattern)?.[0] ?? "";
    const isEnd = nextUrl==="";

    return ({ issues,  isEnd });
  
  } catch (error: any) {
    console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
    return error;
  }
};
