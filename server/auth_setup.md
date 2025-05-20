# Authentication Setup

## .env

Add following environment variables to the .env in the root of the project:

- SESSION_SECRET: a secret value used by express-session to encrypt the cookies send to the clients
- GOOGLE_CLIENT_ID: an ID retrieved in the google cloud console (see later)
- GOOGLE_CLIENT_SECRET: a secret retrieved from the same console

## Google

Go to [console](https://console.cloud.google.com) and create a new project. After creation, select `API and SERVICES`
and go to Credentials. Under this tab, create a new Credential. Select `oauth client id`. For application type: select
`web application`. For name, choose something such that you will recognize this later. Under section
`authorized redirect uris`, add the following:

- http://localhost:3001/api/auth/callback/google
- https://sel2-3.ugent.be/api/auth/callback/google
  Press save, the changes may take 5min to a few hours before they're live. The `CLIENT ID` and `CLIENT SECRET` are also
  visible on the same page. Copy and paste them in the .env file.

## Notes

For the google setup, you might need to create a branding page. For app name, fill in `Dwengo`. For support email, you
can only choose the email coupled to the current google account used to set this all up. Since this is only for local
testing, this is not an issue. Under `Authorized domains`, add `ugent.be`.
