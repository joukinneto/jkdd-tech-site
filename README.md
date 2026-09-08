# JKDD TECH Institutional Website

Status: Development / Preview  
Production: UNTOUCHED

## Purpose
Official institutional hub for JKDD TECH and its product portfolio.

## Stable institutional product routes
- `/field/` → JKDD Field
- `/connect/` → JKDD Connect
- `/leads/` → JKDD Leads
- `/family-finance/` → JKDD Family Finance

Each route stays stable under JKDD TECH. When a product marketing site receives a verified canonical public URL, only the route destination is updated.

## Product-site status
- JKDD Field: marketing site URL not yet verified; application Development/Test is separate.
- JKDD Connect: marketing site URL not yet verified.
- JKDD Leads: public marketing repository `joukinneto/jkdd-leads-site` exists; public site URL not yet verified.
- JKDD Family Finance: marketing site URL not yet verified.

## Lead architecture
`JKDD TECH → Product Site → JKDD Leads → governed handoff → CRM`

JKDD Leads remains the Lead Source of Truth. Pipeline and Opportunity remain CRM-owned.

## Safety boundary
No backend, secrets, database, migrations or live lead persistence in this preview. Production remains untouched.
