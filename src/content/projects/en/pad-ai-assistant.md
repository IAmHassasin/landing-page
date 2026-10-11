---
title: PAD AI Assistant
tagline: Ask questions about Puzzle & Dragons in plain language.
category: ai
status: prototype
year: '2026'
order: 8
stack: [Python, Gemini, SQLite, ChromaDB, Docker]
highlights:
  - Gemini turns a question into structured filters.
  - SQLite applies the hard constraints; ChromaDB narrows results by meaning.
  - Answers come back in Vietnamese with the monsters that match.
---

The AI side of the PAD tool family. Hybrid search keeps the answers grounded in real data: the language model plans the query and writes the answer, but the database decides what is true.
