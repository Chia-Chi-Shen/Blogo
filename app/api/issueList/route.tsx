import { Octokit } from "octokit";
import { cookies } from 'next/headers'


const octokit = new Octokit();
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const repo = searchParams.get("repo");
  const isFirst = searchParams.get("isfirst");
  const cookie = cookies()
  
  if (isFirst === "true") {
    cookie.delete('nextUrl');
  }
  let url = cookie.get('nextUrl')?.value;

  // check if url for next page is in cookie
  if (!url) {
    if (!repo) 
      return Response.json({ error: "repo is required" });
    const q = encodeURIComponent(`repo:${repo} is:open is:issue`);
    url = `https://api.github.com/search/issues?q=${q}&sort=created&per_page=10`
  }
  try {
      // console.log("url: ", url);
      const result = await octokit.request(`GET ${url}`, {
          // per_page: 10,
      });
  //   console.log(result.data.items[0]);
    const newTitleAndNumber = result.data.items.map((issue:any) => ({
      title: issue.title, 
      number: issue.number ? issue.number : null
  }))

  //   console.log("newTitleAndNumber: ",newTitleAndNumber)
    const linkHeader = result.headers.link;
    const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
    const nextUrl = linkHeader?.match(nextPattern)?.[0] ?? "";
    const isEnd = nextUrl==="";

    return Response.json({ newTitleAndNumber,  isEnd }, {
      headers :{ 'Set-cookie': `nextUrl=${nextUrl}`}
    });
  
  } catch (error: any) {
    console.log(`Error! Status: ${error.status}. Message: ${error.response.data.message}`)
    return error;
  }
};
