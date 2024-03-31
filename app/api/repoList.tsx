import { graphql } from "@octokit/graphql"

type Response = {
  user: {
    repositories: {
      nodes: {
        name: string
      }[]
    }
  }
}

export const getRepoList = async(user:string, token:string) => {

    const graphqlWithAuth = graphql.defaults({
        headers: {
            authorization: "token " + token,
        },
        });
    
    const response:Response = await graphqlWithAuth(
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
    const repoList = response.user.repositories.nodes.map((repo) => repo.name);
    return repoList;
}