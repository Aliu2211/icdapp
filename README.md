# ICDAPP - Internet Computer Dashboard Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) that provides a dashboard for managing Internet Computer projects.

## Getting Started

First, copy the environment variables:

```bash
cp .env.example .env.local
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- Dashboard with project statistics
- Project management (create, read, update, delete)
- User authentication
- File-based database for development
- Support for Internet Computer deployments

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/data` - JSON files for development database
- `/public` - Static assets
- `/src` - Source code
  - `/components` - React components
  - `/contexts` - React contexts
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions and libraries
  - `/types` - TypeScript type definitions
  - `/utils` - Helper functions

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Internet Computer, check:
- [Internet Computer Documentation](https://internetcomputer.org/docs)
