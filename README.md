# Supabase as OAuth2.1 Server

This repository contains two part

1. Authorization UI to handle redirection from the Supabase OAuth endpoint
   (/auth/v1/oauth/authorize). The redirection happens automatically when the
   client app gets the OAuth endpoint. This Authorization UI is responsible for
   both showing user some UI for logging in, asking for consent, as well as
   handle (approve) the authorization
2. A Client App that uses the OAuth2.1 server for authorization

## Set Up

1. Go to [database.new](https://database.new/) and click on that New project
   button to create a new Supabase project.
2. Head to the Project's Dashboard, select Authentication > OAuth Server, and
   enable the Supabase OAuth 2.1 Server
3. Make sure the authorization path is `/oauth/consent`
4. In the
   [Auth URL Configuration](https://supabase.com/dashboard/project/hxvfocvjyosazvdgonbz/auth/url-configuration),
   set the site url to be `http://localhost:5173`
5. Register an OAuth client under Authentication > OAuth Apps. Set the redirect
   URL to be `http://localhost:3000/oauth-callback` and note down the client ID.
6. Create a `.env.local` within the [AuthUI](./AuthUI/) folder with the
   following variables

```.env
VITE_SUPABASE_URL=https://your_project_id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxx
```

7. Set up the oauth configurations parameters for [Client App](./ClientApp/) in
   [`main.tsx`](./ClientApp/src/main.tsx)

## Start App

1. Run `npm run dev` within [AuthUI](./AuthUI/) folder to start the Auth UI for
   the OAuth server listening to `http://localhost:5173`
2. Run `npm run dev` within [Client App](./ClientApp/) folder to start the
   Client App for the OAuth server listening to `http://localhost:3000`
3. Open `http://localhost:3000` to sign in using the OAuth server

## Demo

![](./demo.gif)
