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

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## CI/CD

Every push and pull request on `main` runs `.github/workflows/ci.yml`, which installs
dependencies with Bun, runs ESLint and a full production build. A change is only
considered ready for production once this workflow is green.

Add these repository secrets (Settings → Secrets and variables → Actions) so the
build step can resolve the backend configuration:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

Production hosting stays on Lovable: commits made here sync to Lovable automatically,
and the site goes live from the Publish action in the Lovable editor. Backend changes
(database, server functions) apply immediately.
