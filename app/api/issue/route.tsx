import { Octokit } from "octokit"

type Comment = {
    user: string, 
    body: string, 
    updated_at: string
};

export const GET =  async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { headers } = request;

    const issue_number = searchParams.get("issue_number");
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    const parse = searchParams.get("parse");
    

    if ( issue_number && owner && repo) {

    const octokit = new Octokit({ auth: headers.get('authorization')});

    const { data: issueResult } = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
        owner: owner,
        repo: repo,
        issue_number: Number(issue_number),
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    // console.log(issueResult);

    let issueBody = "";
    if (issueResult.body) {
        if (parse === "true") {
        ({ data: issueBody } = await octokit.request('POST /markdown', {
        text: issueResult.body,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
        }))
        }
        else 
            issueBody = issueResult.body;
    }

    const issue = {
            title: issueResult.title, 
            body: issueBody, 
            updated_at: issueResult.updated_at
        };
    const { data: commentsResult } = await octokit.request(`GET ${issueResult.comments_url}`);
    const comments:Comment[] = commentsResult.map(
        (comment: { 
            user: { login: string }, 
            body: string, 
            updated_at: string 
        }) => ({
            user: comment.user.login, 
            body: comment.body, 
            updated_at: comment.updated_at 
        }));

    return Response.json({ issue, comments });
    }

}

export const POST = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { headers } = request;
    const { title, body } = await request.json();

    const owner = searchParams.get("owner")?? "chia-chi-shen";
    const repo = searchParams.get("repo")?? "test";

    const octokit = new Octokit({ auth: headers.get('authorization')});
    const { data: { number } } = await octokit.request('POST /repos/{owner}/{repo}/issues', {
        owner,
        repo,
        title,
        body,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
        })
    return Response.json(number);
    
}


export const PATCH = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { headers } = request;
    const { title, body } = await request.json();

    const issue_number = searchParams.get("issue_number");
    const owner = searchParams.get("owner")?? "chia-chi-shen";
    const repo = searchParams.get("repo")?? "test";

    if ( issue_number ) {
        const octokit = new Octokit({ auth: headers.get('authorization')});
        const { data: { number } } = await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
            owner,
            repo,
            issue_number: Number(issue_number),
            title,
            body,
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
        return Response.json(number);
    }
}

export const DELETE = async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const { headers } = request;
    const issue_number = searchParams.get("issue_number");
    const owner = searchParams.get("owner")?? "chia-chi-shen";
    const repo = searchParams.get("repo")?? "test";

    if ( issue_number ) {
        const octokit = new Octokit({ auth: headers.get('authorization')});
        await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
            owner,
            repo,
            issue_number: Number(issue_number),
            state: "closed",
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
        return Response.json(issue_number);
    }
}
