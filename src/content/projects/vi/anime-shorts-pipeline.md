---
title: Anime Shorts Pipeline
tagline: Đưa vào một link wiki, nhận về video anime dọc có lồng tiếng Việt.
category: ai
status: working
year: '2026'
order: 3
stack: [Python, Remotion, React, ffmpeg, Gemini, faster-whisper]
highlights:
  - 'Trọn quy trình: lấy nội dung wiki, viết kịch bản bằng LLM, lồng tiếng, căn phụ đề, render.'
  - Lồng tiếng Việt bằng TTS, phụ đề karaoke căn từng từ bằng Whisper.
  - Hàng đợi chạy hàng loạt và chế độ bàn giao để người không biết code cũng dùng được.
---

Pipeline đọc một trang Fandom wiki, chuyển thành kịch bản ngắn bằng Gemini hoặc OpenAI, tạo giọng đọc, căn từng từ bằng faster-whisper rồi render video 9:16 từ template Remotion.
