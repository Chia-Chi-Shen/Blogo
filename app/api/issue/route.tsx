const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const GET = async (request: Request) => {
    console.log("request", request);
    const { searchParams } = new URL(request.url)
    console.log("searchParams", searchParams);
    const code = searchParams.get('code')

    // get the token
    const param = "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + code;
    console.log("param", param);
    const res = await fetch("https://github.com/login/oauth/access_token?"+param, 
                    {
                        method: "POST",
                        headers: {
                            "Accept": "application/json"
                        }
                    
                    })
    const data = await res.json()


    return Response.json(data.access_token)
}; 