import { Octokit } from "octokit";
import { cookies } from 'next/headers'


const octokit = new Octokit();
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo")?? "chia-chi-shen/test";
  const page = searchParams.get("page");

  if (!repo) 
      return Response.json({ error: "repo is required" });
  const q = encodeURIComponent(`repo:${repo} is:open is:issue`);
  let url = `https://api.github.com/search/issues?q=${q}&sort=created&per_page=10&page=${page}`

  try {
    const result = await octokit.request(`GET ${url}`, {
        // per_page: 10,
    });
    // console.log(result.data.items[0]);
    const newTitleAndNumber = result.data.items.map((issue:any) => ({
      title: issue.title, 
      number: issue.number ? issue.number : null
    }))

  //   console.log("newTitleAndNumber: ",newTitleAndNumber)
    const linkHeader = result.headers.link;
    // console.log("linkHeader: ", linkHeader);
  
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="next")/i;
    const nextUrl = linkHeader?.match(nextPattern)?.[0] ?? "";
    const isEnd = nextUrl==="";

    return Response.json({ newTitleAndNumber,  isEnd });
  
  } catch (error: any) {
    console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
    return error;
  }
};
