---
title: PAD Searching Tool
tagline: A Puzzle & Dragons monster finder that filters by what skills actually do.
category: tools
status: live
year: 2024 – 2026
order: 2
stack:
  [NestJS, TypeORM, SQLite, React, TanStack Query, Capacitor, Docker, Terraform, Cloudflare Workers]
highlights:
  - Regex skill-pattern filters on top of classic monster filters, in a three-panel UI.
  - NestJS API over the community DadGuide database, with an admin data refresh.
  - Self-hosted on an Oracle Cloud VM behind a Cloudflare Worker, provisioned with Terraform; Android build via Capacitor.
links:
  - { kind: live, url: 'https://pst.hassasin.com' }
  - { kind: repo, url: 'https://github.com/IAmHassasin/pad-searching-tool' }
---

It started in 2024 as a static quick-search page for the NA community after the third-party tools shut down. It grew into my most active side project: a full-stack app I run end to end, from the database import to the infrastructure.
