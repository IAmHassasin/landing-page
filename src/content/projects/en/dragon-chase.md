---
title: Dragon Chase
tagline: A slither-style dragon whose body is a real physics chain.
category: games
status: prototype
year: '2026'
order: 7
stack: [TypeScript, Rapier2D, Canvas 2D, Vite, Playwright]
highlights:
  - The mouse steers the head; 22 segments follow through motor-driven joints.
  - The body keeps real inertia when it eats, hits obstacles or rams other creatures.
  - Playwright scripts check the simulation after long runs.
---

Most snake games fake the body by replaying the head's path. Here every segment is a rigid body, so turns swing, collisions push back and the dragon feels heavy.
