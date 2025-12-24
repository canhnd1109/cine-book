# CineBook Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Use this template to create your own changelog with [Nuxt UI](https://ui.nuxt.com).

- [Live demo](https://changelog-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/getting-started/installation/nuxt)

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fchangelog&demo-image=https%3A%2F%2Fui4.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fchangelog-dark.png&demo-url=https%3A%2F%2Fchangelog-template.nuxt.dev%2F&demo-title=Nuxt%20Changelog%20Template&demo-description=A%20changelog%20template%20to%20display%20your%20repository%20releases%20notes%20from%20GitHub%20powered%20by%20Nuxt%20MDC.)

## Config

To customize the GitHub repository that the changelog fetches releases from, update the `repository` key in `app/app.config.ts`:

```ts [app/app.config.ts]
// app/app.config.ts
export default defineAppConfig({
  repository: 'nuxt/ui' // Change this to your GitHub repository (e.g., 'facebook/react')
})
```

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
# API Configuration (Required)
NUXT_PUBLIC_BASE_API_URL=http://localhost:8080
NUXT_PUBLIC_BASE_SOCKET_URL=ws://localhost:8080

# For Production (use wss:// for secure WebSocket)
# NUXT_PUBLIC_BASE_API_URL=https://api.yourdomain.com
# NUXT_PUBLIC_BASE_SOCKET_URL=wss://api.yourdomain.com
```

**Important for Production:**

- Make sure to set `NUXT_PUBLIC_BASE_SOCKET_URL` with the correct WebSocket URL
- Use `wss://` (secure WebSocket) instead of `ws://` in production
- Both API and WebSocket URLs must be accessible from the client browser

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
