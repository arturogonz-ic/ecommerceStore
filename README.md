# Ecommerce Store

User-facing storefront for the Ecommerce ecosystem, built with Next.js and deployed to GitHub Pages.

**Live:** https://arturogonz-ic.github.io/ecommerceStore/

## Stack

- Next.js (App Router, static export)
- Tailwind CSS
- React Context for shared auth and cart state

## Features

- Homepage with deals, best-sellers, and category sidebar
- Catalog with name search (with autocomplete), category multiselect filter, and price range filter
- Product detail page with add-to-cart
- Cart with quantity management (persisted in localStorage)
- Checkout — requires login and a saved billing address
- Order history and order detail with print / save as PDF
- Account settings (billing address)
- Floating suggestion box for logged-in users

## Getting started

```bash
pnpm install
pnpm dev -- -p 3001
```

Store runs on `http://localhost:3001`. Requires the API running on `http://localhost:4000`.

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the Ecommerce API (default: `http://localhost:4000`) |

## Deployment

Deployed automatically to GitHub Pages on every push to `main` via GitHub Actions. Set `NEXT_PUBLIC_API_URL` as a repository variable in GitHub Actions settings before deploying.

## Architecture

Follows screaming architecture — top-level folders are domain names (`catalog`, `cart`, `orders`, `user-auth`, etc.). Components are dumb: they only render what hooks provide. All API calls, state, and business logic live in hooks.
