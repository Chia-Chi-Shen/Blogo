import { graphql } from "@octokit/graphql";
import type { GraphQlQueryResponseData } from "@octokit/graphql";

const getInitIssuesGraphql = async () => {
    const response = await graphql(
      `
        {
          repository(owner: "octokit", name: "graphql.js") {
            issues(last: 3) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      `,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log(response);
  }