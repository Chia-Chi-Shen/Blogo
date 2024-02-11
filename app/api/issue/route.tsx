const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const GET = async (request: Request) => {
    console.log("request", request);
    const { searchParams } = new URL(request.url)
    console.log("searchParams", searchParams);
    const code = searchParams.get('code')

    //未測試
    const param = "client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET + "&code=" + code;
    await fetch("https://api.github.com/"+param)
    .then(res => res.json())
    .then(data => {Response.json({data})})
}; 