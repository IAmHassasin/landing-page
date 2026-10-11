---
title: synthvox
tagline: A text-to-speech engine for voices with character, steered by inline markup.
category: ai
status: working
year: '2026'
order: 5
stack: [Python, Piper, ONNX, pyworld, pedalboard, Typer, pytest]
highlights:
  - 'A small markup language for mood, pacing, stress and pauses: --sarcastic--, [tired], |800|.'
  - Pitch contour, voice quality and glitch effects for game-style characters.
  - Speech-recognition checks keep the output intelligible as effects stack up.
---

synthvox sits on top of a Piper Vietnamese voice and reshapes the delivery line by line. Voice profiles and a CLI make it usable from scripts, and every change is measured against recognition scores instead of judged by ear alone.
