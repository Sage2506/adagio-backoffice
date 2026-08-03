# adagio-backoffice

Adagio backoffice is a React + TypeScript frontend for operational management.
It connects to `adagio_backend` APIs and provides authenticated workflows for:

- students and guardians
- subscriptions and subscription payments
- plans and products
- orders

## 1) Onboarding Quick Start (10-15 minutes)

Use this path for a reliable first-day setup.

### Prerequisites

- Node.js 20+ (recommended for current Vite versions)
- npm
- Running backend API (`adagio_backend`)

### Step-by-step

1. Install dependencies

```bash
npm install
```

2. Create environment file

Create `.env.local` in project root with:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1/
```

3. Start development server

```bash
npm run dev
```

4. Open app

- Default Vite URL is shown in terminal (usually `http://localhost:5173`)
- Login with a valid backend/Cognito user

## 2) First-Day Operational Checklist

Run this checklist in order:

- [ ] App boots without build/runtime errors
- [ ] Login screen loads at `/login`
- [ ] Login returns token and redirects into protected area
- [ ] Navigation to `alumns`, `orders`, `plans`, `products`, `subscriptions` works
- [ ] API requests succeed against configured backend
- [ ] `npm run lint` passes
- [ ] `npm run build` passes

If any item fails, jump to troubleshooting.

## 3) Local Development Runbook

### Daily start

```bash
npm run dev
```

### Quality gates

```bash
npm run lint
npm run build
```

### Production preview (optional)

```bash
npm run preview
```

## 4) Environment Configuration

The app currently uses this environment variable:

- `VITE_API_BASE_URL`: backend base URL used by Axios client

Example:

```env
VITE_API_BASE_URL=http://localhost:3000/api/v1/
```

Notes:

- Include `/api/v1/` so service paths resolve as expected.
- If backend runs on a different host/port, update this value accordingly.

## 5) Auth and Session Behavior

- Login calls backend `POST auth/login` through the configured base URL.
- Token (`id_token`) is stored in `localStorage` or `sessionStorage`.
- Axios automatically sends `Authorization: Bearer <token>` on requests.
- On `401` or network errors, token is removed and app emits `unauthorized` event.

## 6) Application Map

### Routing

- Public routes: `/login`, `/logout`
- Protected shell: dashboard layout wrapped by auth guard
- Main sections:
  - `/` (students list)
  - `/alumns/form`, `/alumns/form/:id`
  - `/orders`, `/orders/form`
  - `/plans`, `/plans/form`, `/plans/form/:id`
  - `/products`, `/products/form`, `/products/form/:id`
  - `/subscriptions`, `/subscriptions/pay`

### Key folders

- `src/components/auth`: login/logout/protected route/auth hook
- `src/components/dashboard`: business views and forms
- `src/services`: API clients per domain
- `src/types`: TypeScript models/contracts
- `src/layouts`: dashboard shell

## 7) Backend Integration Expectations

For stable local development:

- Backend should be reachable at `VITE_API_BASE_URL`
- Backend CORS must allow this frontend origin (commonly `http://localhost:5173`)
- Backend auth endpoint must return valid `id_token`

## 8) Troubleshooting

### Blank page or startup failure

- Confirm `npm install` completed successfully
- Check terminal for TypeScript/Vite errors
- Verify Node version compatibility

### Login fails

- Verify `VITE_API_BASE_URL` points to backend `/api/v1/`
- Verify backend is running and Cognito credentials are valid
- Confirm browser sends expected login payload

### Unauthorized loops / forced logout

- Inspect browser storage for `id_token`
- Verify token is not expired/invalid
- Check backend token verification against the same Cognito pool/client

### CORS errors

- Ensure backend CORS includes frontend origin
- Confirm frontend is calling the intended backend host/port

## 9) Build and Release Notes

- Build command: `npm run build`
- Output folder: `dist/`
- Use `npm run preview` for local validation of production build
