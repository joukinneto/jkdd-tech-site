# CONTÍNUO — Visual QA Gate for JKDD TECH Site

Status: Development/Test

This repository uses an evidence-based visual QA gate aligned with JKDD TECH Foundation / CONTÍNUO governance.

## Worker

- Microsoft Playwright (Chromium + WebKit)
- No paid browser service required
- Runs through GitHub Actions

## Current checks

- official brand assets are materialized successfully from the approved source artwork;
- no asset-materializer failures;
- all rendered official assets have non-zero image dimensions;
- no broken `<img>` elements;
- no page JavaScript errors;
- no horizontal overflow;
- desktop Chrome viewport;
- iPhone/WebKit viewport;
- Home, JKDD Field, Family Finance, LIOSYNA AI, and Websites routes.

## Release rule

A deployment must not be considered visually validated merely because GitHub Pages deployed successfully. The Visual QA workflow must pass before promotion when the workflow is available.

## Production safety

The QA worker is read-only against the rendered site. It does not mutate databases, authentication, RLS/RBAC, secrets, customer data, or production application state.
