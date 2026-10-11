---
title: Dragon Chase
tagline: Con rồng kiểu slither có thân là một chuỗi vật lý thật.
category: games
status: prototype
year: '2026'
order: 7
stack: [TypeScript, Rapier2D, Canvas 2D, Vite, Playwright]
highlights:
  - Chuột điều khiển đầu rồng; 22 đốt thân bám theo qua các khớp có motor.
  - Thân rồng giữ quán tính thật khi ăn, va chướng ngại vật hay húc sinh vật khác.
  - Script Playwright kiểm tra mô phỏng sau những lượt chạy dài.
---

Phần lớn game rắn giả lập thân bằng cách lặp lại đường đi của đầu. Ở đây mỗi đốt là một vật thể rắn, nên khi rẽ thân sẽ văng, va chạm sẽ bị đẩy lại và con rồng có cảm giác nặng.
