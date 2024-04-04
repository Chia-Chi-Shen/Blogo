import { Octokit } from "octokit";
import { RequestError } from "@octokit/request-error";


export const getIssueList = async (repo:string, page:string, token?:string) => {

  const octokit = new Octokit({ auth: token });
  
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

    return ({ issues,  isEnd, status: 200});
  
  } catch (error) {
    if (error instanceof RequestError) {
      console.error('Error getting issue:', error);
      return { issues: [], isEnd: true, status: error.response?.status || null };
    }
    else {
      throw error;
    }
  }
};
