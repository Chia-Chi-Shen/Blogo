import { Octokit } from "octokit"
import { graphql } from "@octokit/graphql"

export const GET = async(request: Request) => {
    const { searchParams } = new URL(request.url);

    const token = request.headers.get('authorization');
    const user = searchParams.get('user')?.toLowerCase();
    
    if (!token) 
        return new Response("Unauthorized", { status: 401 });

    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: "token " + token,
        },
        });
    
    const response = await graphqlWithAuth(
        `
        query {
            user(login: "${user}") {
              repositories(first: 100) {
                nodes {
                  name
                }
              }
            }
          }
        `,
      );
    return Response.json(response);
}