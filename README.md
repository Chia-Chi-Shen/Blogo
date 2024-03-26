# Blogo
A blog website used for editing and sharing GitHub issue articles.

- Framework - [Next.js 14](https://nextjs.org/) with [App Router](https://nextjs.org/docs#app-router-vs-pages-router)
- Language - [TypeScript](https://www.typescriptlang.org/)
- Styling - [Tailwind CSS](https://tailwindcss.com/)

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
### Vercel
### On your computer
0. Your computer should have downloaded Node.js before（Node >= 14.0.0 and npm >= 5.6）
1. Download this repository via ```git clone```
2. Register a new OAuth application to get your own client id and secret [here](https://github.com/settings/applications/new)
    - Please set **Homepage URL** and **Authorization callback URL** to ```https://127.0.0.1:3000/```
3. Set necessary enviroment variables:
    - add a new ```.env.local``` file under root directory
    - add enviroment variables:
   ```
   NEXT_PUBLIC_GITHUB_CLIENT_ID={your_client_id}
   GITHUB_CLIENT_ID={your_client_id}
   GITHUB_CLIENT_SECRET={your_client_secret}
   ```
4. run following commands under this repository 
    ```
    npm install
    npm run build
    ```
## Architecture Design
### app/
#### app/api/
#### app/page.js
#### app/repos/
#### app/createIssue/

### components/
#### issueForm
#### listElement
#### navbar
#### noPermission

### containers/hook/


