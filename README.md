# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Local Market Yard Apps

This repo is moving toward the three-app architecture from the build guide:

- Public website and Trader login: `npm run dev`
- Separate Admin Hub: `npm run dev:admin`
- Shared Backend API: `npm run dev:backend`

Local URLs currently used:

- Public website: `http://127.0.0.1:8083`
- Admin Hub: `http://127.0.0.1:8090`
- Backend API: `http://127.0.0.1:4007/api/v1/health`

The backend reads database credentials from `.env` only. Do not hardcode MSG91,
Cloudflare R2, AiSensy, or other secrets in source files.

Useful backend checks:

```sh
npm run db:init
curl http://127.0.0.1:4007/api/v1/health
```

## Built with

- Vite React
- TypeScript
- React
- Tailwind CSS
