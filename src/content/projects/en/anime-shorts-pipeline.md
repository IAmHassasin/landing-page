---
title: Anime Shorts Pipeline
tagline: One wiki link in, a vertical anime short with Vietnamese voice-over out.
category: ai
status: working
year: '2026'
order: 3
stack: [Python, Remotion, React, ffmpeg, Gemini, faster-whisper]
highlights:
  - 'End to end: scrape the wiki page, write the script with an LLM, voice it, align subtitles, render.'
  - Vietnamese TTS voice-over with word-level karaoke subtitles aligned by Whisper.
  - Batch queues and a hand-off mode so non-developers can run it.
---

The pipeline reads a Fandom wiki page, turns it into a short script with Gemini or OpenAI, generates the voice-over, aligns every word with faster-whisper and renders a 9:16 video from Remotion templates.
