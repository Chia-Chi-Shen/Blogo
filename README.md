# [Blogo](https://blogo.vercel.app/)
A blog website used for editing and sharing GitHub issue articles.
( using [facebook/react repository](https://github.com/facebook/react/issues) as an example )
<img width="644" alt="image" src="https://github.com/Chia-Chi-Shen/Blogo/assets/79575871/0114abde-0c87-408a-bb20-4a9ca9ce9c08">

- Framework - [Next.js 14](https://nextjs.org/) with [App Router](https://nextjs.org/docs#app-router-vs-pages-router)
- Language - [TypeScript](https://www.typescriptlang.org/)
- Styling - [Tailwind CSS](https://tailwindcss.com/)
Cover photo by <a href="https://unsplash.com/@anikeevxo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Vladimir Anikeev</a> on <a href="https://unsplash.com/photos/white-sky-photography-IM8ZyYaSW6g?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>

## Overview
1. [Features](#features)
    - [Github Login](#github-login)
    - [Post Management](#post-management)
    - [User Interface](#user-interface)
2. [How to use](#how-to-use)
3. [Architecture Design](#architecture-design)

## Features
### GitHub Login
- 使用者以 GitHub 帳號登入，採用 [GitHub Oauth](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps) 驗證，以便使用 [GitHub REST API](https://docs.github.com/en/rest?apiVersion=2022-11-28)
- 使用者登入時若無開放權限，將無法使用完整功能
- 成功登入後使用者資訊記錄於```local storage```，毋須重複登入
- 登出即可將資訊清除

### Post Management
- GitHub Issue 作為部落格貼文
- 使用者無須登入即可查看作者所有的文章內容及留言，但無編輯權限
- 使用者登入後:
  - 可以瀏覽自己的所有repositories，及其中的所有issues和留言
  - 可以編輯自己的貼文以及刪除貼文（即關閉該 issue）
  - 可以在自己的任意repository新增貼文

### User Interface
#### 文章列表頁
- ```infinite scrolling```:  每次載入 10 筆，滾到底部時才會載入額外 10 筆,直到沒有更多文章
#### 文章內頁
- 顯示轉譯過的 markdown 內容、作者、上次更新時間及留言
- 使用[Post Management](#post-management)的功能
#### 新增及編輯文章
- ```form validation```:  標題為必填，內文至少需要 30 字，新增文章需選擇目標repository
- ```avoiding resubmission```:  送出後自動跳轉至該文章內頁，再按上一頁即返回文章列表，避免重複送出表單
#### Navbar
- 頁面下滑自動縮小，擴增視野

## How to Use
### Vercel App
Blogo has been deployed on [https://blogo.vercel.app/](https://blogo.vercel.app/)
( using [facebook/react repository](https://github.com/facebook/react/issues) as an example )
### On your computer
0. Please install [Node.js](https://nodejs.org/en/) before launching the project
1. ```git clone``` to download this repository
2. Register a new OAuth application to get your own client id and secret [here](https://github.com/settings/applications/new)
    - please set **Homepage URL** and **Authorization callback URL** to ```https://127.0.0.1:3000/```
      ( GitHub official documentation recommends using '127.0.0.1' over 'localhost'. )
3. Set necessary environment variables:
    - add a new ```.env.local``` file under root directory
    - add following environment variables:
   ```
   NEXT_PUBLIC_USER={your_github_username}
   NEXT_PUBLIC_REPO={your_blog_repo}
   NEXT_PUBLIC_GITHUB_CLIENT_ID={your_client_id}
   GITHUB_CLIENT_ID={your_client_id}
   GITHUB_CLIENT_SECRET={your_client_secret}
   ```
4. Run following commands under this repository 
    ```
    npm install
    npm run build
    ```
5. Open "https://127.0.0.1:3000/" on browser
   (please remind that ```localhost``` is different from ```127.0.0.1```)
## Architecture Design
Grouping by file type
- [components/](#components)
- [containers/](#containers)
- [app/](#app)

### components/
打包多個頁面都會用到的元素，以利重複使用
#### [navbar](./components/navbar.tsx)
#### [issueForm](./components/issueForm.tsx)
編輯及新增issue的表單（包含表單驗證）
#### [listElement](./components/listElement.tsx)
列表頁使用的元素，呈現issue標題、內文預覽及留言數
#### [noPermission](./components/noPermission.tsx)
部分功能需要確認使用者權限，如使用者未登入或登入後未開啟權限，會顯示此畫面
### containers/
#### [containers/hook/](./containers/hook/)
- [useToken](./containers/hook/useToken.tsx)
  - GitHub OAuth登入
  - user token驗證權限
  - 儲存、更新使用者資訊
  - 提供使用者資訊context給其他頁面
- [useParallax](./containers/hook/useParallax.tsx)
  - 使用[react-scroll-parallax](https://react-scroll-parallax.damnthat.tv/docs/intro)套件，目前僅於首頁使用
#### [containers/issueList](./containers/issueList.tsx)
處理issues列表頁面的邏輯，包含api串接以及infinite scrolling

### app/
```
├── page.tsx （首頁，呈現部落格文章列表）
├── api
├── createIssue
├── repos
```
#### app/api/
處理所有串接GitHub API的邏輯，以及免於將client secret暴露在瀏覽器中
```
├── api
│   ├── issue
│   ├── issueList
│   ├── login
│   ├── repo
│   └── token
```
#### app/repos/
```
├── repos
│   ├── [repo]
│   │   ├── [issue_number]
│   │   │   ├── page.tsx
│   │   │   └── updateIssue
│   │   │       └── page.tsx
│   │   └── page.tsx
│   └── page.tsx
```
#### app/createIssue/




