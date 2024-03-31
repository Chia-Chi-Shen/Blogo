import { Octokit } from "octokit"

type Comment = {
    user: string, 
    body: string, 
    updated_at: string
};

export const getIssue =  async (owner:string, repo:string, parse:boolean, issue_number:number, token?: string) => {
    
    const octokit = new Octokit({ auth: token });

    const { data: issueResult } = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
        owner,
        repo,
        issue_number,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    // console.log(issueResult);

    let issueBody = "";
    if (issueResult.body) {
        if (parse) {
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
            updated_at: issueResult.updated_at,
            author: issueResult.user?.login,
            avatar: issueResult.user?.avatar_url
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

    return ({ issue, comments });

}

export const postIssue = async (title:string, body:string, owner:string, repo:string, token?:string) => {

    const octokit = new Octokit({ auth: token });
    const { data: { number } } = await octokit.request('POST /repos/{owner}/{repo}/issues', {
        owner,
        repo,
        title,
        body,
        headers: {
            'X-GitHub-Api-Version': '2022-11-28'
        }
        })
    return number;
    
}


export const patchIssue = async (title:string, body:string, owner:string, repo:string, 
                                 issue_number:number, token?:string) => {

    if ( issue_number ) {
        const octokit = new Octokit({ auth: token });
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
        return number;
    }
}

export const deleteIssue = async (owner:string, repo:string, 
                                  issue_number:number, token?:string) => {

    if ( issue_number ) {
        const octokit = new Octokit({ auth: token });
        await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
            owner,
            repo,
            issue_number: Number(issue_number),
            state: "closed",
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
        return issue_number;
    }
}
