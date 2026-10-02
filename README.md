# Adagio Backoffice

## Project description

Adagio Backoffice is the React web application used to operate the Adagio
platform. Staff use it to manage students and guardians, plans and products,
subscriptions and payments, and orders. It communicates with the Adagio
Backend API, whose routes are available under `/api/v1`.

## Tech stack

- React 19 and TypeScript 5.8
- Vite 7 for development and bundling
- Tailwind CSS 4 and Headless UI for styling and accessible UI components
- React Router 7 for navigation
- TanStack Query 5 and Axios for data fetching and API requests
- ESLint 9 and Vitest 4 for linting and tests

## Run locally

### Requirements

- Node.js 24.x (also specified in `.nvmrc` and `package.json`)
- npm
- A running Adagio Backend API and a valid Cognito account to sign in

### Setup and start

1. Install and activate Node.js 24.x. For example, with `nvm`:

   ```bash
   nvm install
   nvm use
   ```

2. From the project root, install the locked dependencies:

   ```bash
   npm ci
   ```

3. Create `.env.local` in the project root with the backend API URL:

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api/v1/
   ```

   If the backend runs on another host or port, set the URL accordingly. The
   backend must allow the frontend origin (`http://localhost:5173`) in its CORS
   configuration and support credentialed requests.
4. Start the Vite development server:

   ```bash
   npm run dev
   ```

5. Open the local URL printed by Vite (normally `http://localhost:5173`) and
   sign in with a valid backend/Cognito user.

The frontend sends and receives the backend's HTTP-only authentication cookies.
You do not need to configure or store an API token in frontend browser storage.
Without a running backend, the app can start but login and API-backed pages
will not work.

### Environment variables

- `VITE_API_BASE_URL` (required): backend API base URL, including `/api/v1/`.
- `VITE_GA_MEASUREMENT_ID` (optional): Google Analytics measurement ID. Analytics
  is initialized only in production builds and only when this value is set.

Vite embeds `VITE_` variables into the client bundle; do not put secrets in
these variables.

### Common commands

```bash
npm run dev       # Start the local development server
npm run test      # Run the Vitest test suite
npm run lint      # Run ESLint
npm run build     # Type-check, build client/server bundles, and prerender
npm run preview   # Preview the production build locally
```

## Authentication and backend integration

- Login uses the backend endpoint `POST /api/v1/auth/login`.
- The API client sends credentialed requests so the browser can use the
  backend's HTTP-only JWT and refresh-token cookies.
- Backend CORS must allow the frontend origin and credentialed requests.
- Login and protected API routes require the backend's AWS Cognito integration
  and a valid account.
- The API client emits an `unauthorized` event for HTTP 401 and network errors;
  the auth flow handles session refresh and sign-out.

## Application map

- `src/components/auth`: login, logout, protected routes, and session handling
- `src/components/dashboard`: business views and forms
- `src/services`: API clients and domain services
- `src/types`: TypeScript models and API contracts
- `src/layouts`: dashboard shell
- `src/routes`: application route definitions

## Troubleshooting

### The app will not start or build

- Confirm `node --version` reports Node 24.x.
- Run `npm ci` to install dependencies from `package-lock.json`.
- Check the terminal for Vite, TypeScript, or ESLint errors.

### Login fails or API requests are blocked

- Confirm the backend is running and `VITE_API_BASE_URL` ends in `/api/v1/`.
- Confirm the backend is configured with valid Cognito credentials and user
  details.
- Confirm backend CORS allows `http://localhost:5173` with credentials.
- Restart Vite after changing `.env.local` so it reloads the environment.

### Production build

`npm run build` writes generated files to `dist/`. Use `npm run preview` to
check the production build locally before deployment.
