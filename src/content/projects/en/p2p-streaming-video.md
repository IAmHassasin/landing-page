---
title: P2P Streaming Video
tagline: Stream films from a home PC to a phone over WebRTC, with no server in between.
category: media
status: prototype
year: '2026'
order: 6
stack: [Python, FastAPI, aiortc, PyAV, WebRTC, Tailscale]
highlights:
  - The phone pairs with the PC by scanning a QR code; traffic stays on the Tailscale network.
  - Seeking, sidecar SRT/VTT subtitles and quality presets.
  - Testbed for the latency and NAT-traversal ideas behind my work on remote operation.
links:
  - { kind: repo, url: 'https://github.com/IAmHassasin/p2p-streaming-video' }
---

A FastAPI host decodes the file with PyAV and streams it peer to peer through aiortc. It is a private alternative to uploading a library anywhere, and a place to try out media-path ideas cheaply.
