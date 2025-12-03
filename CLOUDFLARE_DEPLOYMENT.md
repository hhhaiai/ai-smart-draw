# Cloudflare Deployment Guide

This guide explains how to deploy the AI Smart Draw application to Cloudflare Pages using two different approaches:

1. Static Site Generation (SSG) - simpler deployment, but with some limitations
2. Server Side Rendering (SSR) with `@cloudflare/next-on-pages` - full functionality

## Prerequisites

1. A Cloudflare account with Pages enabled
2. `wrangler` CLI installed globally:
   ```bash
   npm install -g wrangler
   ```
3. Login to Cloudflare:
   ```bash
   wrangler login
   ```

## Option 1: Static Site Generation (SSG) Deployment

This approach generates a static version of your site that can be deployed directly to Cloudflare Pages.

### Build and Deploy

1. Make sure your [next.config.ts](file:///D:/workspace/ai-smart-draw/next.config.ts) has the `output: 'export'` option (already configured)

2. Build the static site:
   ```bash
   npm run build
   ```

3. Deploy using Wrangler:
   ```bash
   wrangler pages deploy .next/standalone --project-name ai-smart-draw
   ```

OR

Connect your GitHub repository to Cloudflare Pages:
1. Go to Cloudflare Dashboard > Pages > Create a project
2. Connect your GitHub account and select your repository
3. Set the build settings:
   - Build command: `npm run build`
   - Build output directory: `.next/standalone`
4. Add environment variables if needed (see below)
5. Save and deploy

## Option 2: Server Side Rendering (SSR) Deployment

This approach uses `@cloudflare/next-on-pages` to enable full SSR functionality on Cloudflare Pages.

### Setup

1. Install the required dependencies (already done):
   ```bash
   npm install -D @cloudflare/next-on-pages
   ```

2. The following scripts have been added to your [package.json](file:///D:/workspace/ai-smart-draw/package.json):
   ```json
   {
     "pages:build": "npx @cloudflare/next-on-pages",
     "preview": "npm run pages:build && wrangler pages dev",
     "deploy": "npm run pages:build && wrangler pages deploy"
   }
   ```

### Development

Test your application locally with Cloudflare simulation:
```bash
npm run preview
```

### Production Deployment

Deploy to Cloudflare Pages:
```bash
npm run deploy
```

OR

Connect your GitHub repository to Cloudflare Pages:
1. Go to Cloudflare Dashboard > Pages > Create a project
2. Connect your GitHub account and select your repository
3. Set the build settings:
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`
4. Add environment variables if needed (see below)
5. Save and deploy

## Environment Variables

If you're using API keys or other environment variables, you'll need to set them in the Cloudflare Pages project settings:

1. Go to your Pages project > Settings > Environment variables
2. Add your variables:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `OPENAI_MODEL` - (Optional) Specific model to use
   - `OPENAI_BASE_URL` - (Optional) Custom base URL for OpenAI-compatible APIs

## Limitations & Considerations

### SSG Approach Limitations:
- API routes won't work as expected since there's no server-side execution
- Some dynamic features might not work properly
- Environment variables marked as `secret` won't be available

### SSR Approach Benefits:
- Full Next.js functionality including API routes
- Server-side rendering capabilities
- Access to environment variables
- Better handling of dynamic content

## Troubleshooting

1. If you encounter build errors with the SSR approach, make sure all dependencies are properly listed in your [package.json](file:///D:/workspace/ai-smart-draw/package.json).

2. If you have issues with the SSG approach, check that all pages can be statically rendered (no reliance on server-only features).

3. For both approaches, ensure your environment variables are correctly set in the Cloudflare Pages project settings.