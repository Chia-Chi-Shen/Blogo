import { Octokit } from "@octokit/core";
import {
  createOAuthAppAuth,
  createOAuthUserAuth,
} from "@octokit/auth-oauth-app";
import { request } from "@octokit/request";

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const POST = async (req: Request) => {

    const token = "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"
    var user;

    if (CLIENT_ID && CLIENT_SECRET){
        const auth = createOAuthAppAuth({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        });

        const { data: user } = await auth.hook(
            request,
            "POST /applications/{client_id}/token",
            {
            client_id: CLIENT_ID,
            access_token: token,
            },
        );
        console.log("user", user);
    }

    return Response.json({user})
}