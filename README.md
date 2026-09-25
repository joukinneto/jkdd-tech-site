# JKDD TECH — Institutional Website

Official repository for the JKDD TECH institutional website and product portal.

## Governance

- Environment: Development / Preview
- Production: UNTOUCHED
- Public institutional hub: JKDD TECH
- Product websites remain product-owned
- Lead Source of Truth: JKDD Leads
  - **Owner-approved interim exception (2026-09-25):** the `/contact/` form posts to
    `https://jkdd-contato.vercel.app/api/contato` (source: `joukinneto/jogos-daniel/jkdd-contato`),
    which stores messages in the Neon project `jkdd-tech` (table `contact_messages`).
    JKDD Leads has no server-side intake yet (browser-local state only). When it exposes an
    intake API, point `ENDPOINT` in `contact/index.html` to it and migrate the stored messages.
- CRM owns Pipeline and Opportunity
- Shared identity/security capabilities must reuse JKDD TECH Foundation when applicable
- Do not present PLANNED, SPECIFIED or SCAFFOLDED capabilities as PRODUCTION

## Development flow

Website work is developed outside the production path and validated before any production/domain activation.

Current target: zero-cost Development/Test preview using GitHub Pages.

## Current preview stack

- Semantic HTML5
- Responsive CSS
- Vanilla JavaScript
- No paid dependency
- PT-BR / EN language toggle
- Technical SEO baseline
- Accessibility and reduced-motion support
- Static architecture suitable for GitHub Pages

## Brand palette

- JKDD Blue: `#145F94`
- Deep Blue: `#073251`
- Graphite: `#191919`
- Metallic Gray: `#D3D3D3`
- White: `#FFFFFF`
- Orange: `#FF830D`
- Red: `#B82F2F`

## Product portal

Initial ecosystem cards:

- JKDD Field
- JKDD Family Finance
- JKDD Leads
- JKDD Connect

Dedicated product websites are intentionally not hard-linked until each product has an approved public URL.

## GitHub Pages preview

In the repository, open **Settings → Pages** and choose:

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/(root)`

Expected preview URL:

`https://joukinneto.github.io/jkdd-tech-site/`

## Official logo rule

Do not redraw or approximate the official JKDD TECH logo. The canonical master remains the approved JKDD TECH brand asset. Until an approved optimized derivative is committed to this public website repository, the page uses a text brand lockup instead of a substitute logo.

## Domain rule

`jkddtech.com` must only be connected after the GitHub Pages preview is reviewed and approved. Do not alter Production DNS destructively during preview work.
