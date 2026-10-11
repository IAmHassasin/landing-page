---
title: synthvox
tagline: Engine chuyển văn bản thành giọng nói có cá tính, điều khiển bằng markup ngay trong câu.
category: ai
status: working
year: '2026'
order: 5
stack: [Python, Piper, ONNX, pyworld, pedalboard, Typer, pytest]
highlights:
  - 'Ngôn ngữ markup nhỏ cho cảm xúc, nhịp, nhấn và ngắt: --sarcastic--, [tired], |800|.'
  - Điều chỉnh ngữ điệu, chất giọng và hiệu ứng glitch cho nhân vật kiểu game.
  - Kiểm tra bằng nhận dạng giọng nói để giọng vẫn nghe rõ khi chồng nhiều hiệu ứng.
---

synthvox chạy trên giọng tiếng Việt của Piper và nắn lại cách đọc theo từng câu. Có hồ sơ giọng và CLI để dùng trong script, mọi thay đổi đều được đo bằng điểm nhận dạng thay vì chỉ nghe bằng tai.
