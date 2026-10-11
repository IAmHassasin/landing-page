---
title: P2P Streaming Video
tagline: Phát phim từ PC ở nhà sang điện thoại qua WebRTC, không cần server trung gian.
category: media
status: prototype
year: '2026'
order: 6
stack: [Python, FastAPI, aiortc, PyAV, WebRTC, Tailscale]
highlights:
  - Điện thoại ghép nối với PC bằng mã QR; dữ liệu chỉ đi trong mạng Tailscale.
  - Tua phim, phụ đề SRT/VTT rời và các mức chất lượng.
  - Nơi thử nghiệm các ý tưởng về độ trễ và NAT traversal cho công việc điều khiển từ xa.
links:
  - { kind: repo, url: 'https://github.com/IAmHassasin/p2p-streaming-video' }
---

Host FastAPI giải mã file bằng PyAV và stream ngang hàng qua aiortc. Đây là cách xem phim riêng tư mà không phải tải thư viện lên đâu cả, đồng thời là nơi thử các ý tưởng về đường truyền media với chi phí thấp.
