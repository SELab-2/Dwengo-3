# React + TypeScript + Vite

You can run the app in development mode using the following command:

```bash
npm run dev
```

This will start a local development server and open the app in your default web browser.
The app will automatically reload if you make changes to the source files.
You can also build the app for production using the following command:

```bash
npm run build
```

This will create a production-ready build of the app in the `dist` directory.
You can then serve the app using a static file server or deploy it to a hosting service.

## Authentication

To enable authentication on the frontend, create a `.env` file in `client/`. Add the following environment variables
to it:

- `VITE_GOOGLE_CLIENT_ID` - The value is the same as used in the `.env` of the server (`GOOGLE_CLIENT_ID`)
- `VITE_API_URL` - The root url to the API.
