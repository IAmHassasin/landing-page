# Promo video — Kha Pham (Hassasin) · Handoff brief

> Bộ tài liệu bàn giao cho một phiên Claude khác (máy không có source code các dự án) để dựng video
> promotion bằng **HyperFrames** (HTML + CSS + GSAP → MP4) và React khi cần.
> Thu thập ngày 2026-10-11 từ các repo cá nhân của chủ (GitHub `IAmHassasin`) và landing page `hassasin.com`.

## Đọc theo thứ tự

| File                                                         | Nội dung                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [01-persona-and-brand.md](01-persona-and-brand.md)           | Chủ video là ai, số liệu CV, giọng điệu, màu, font, motif, ảnh chân dung |
| [02-projects.md](02-projects.md)                             | Danh sách dự án được phép đưa, mô tả, stack, cách minh hoạ, link         |
| [03-storyboard.md](03-storyboard.md)                         | Kịch bản 60s (16:9) + bản cắt 30s (9:16), timing, text trên màn hình     |
| [04-production-hyperframes.md](04-production-hyperframes.md) | Spec kỹ thuật, cấu trúc project, asset cần chép sang, checklist QA       |

## Mục tiêu video

- Giới thiệu **Kha Pham aka Hassasin**: senior full-stack engineer, R&D / product lead, thích làm game indie và tool tự động hoá.
- Khoe **dự án cá nhân** + năng lực, đậm chất game (save file, HUD, quest, level, achievement).
- Gợi tò mò về các dự án **sắp làm** (chỉ teaser, xem "Locked Levels").
- Kêu gọi xem tiếp: landing page, game portfolio, CV, GitHub.
- Ngôn ngữ trên màn hình: **English** là bản chính; có thể xuất thêm bản phụ đề / text tiếng Việt (text VI đã soạn sẵn trong storyboard).

## Luật bắt buộc (không được vi phạm)

1. **Không đưa nội dung dự án công ty** ngoài mức CV đang public: chỉ tên công ty, vai trò, số liệu tổng (xem 01). Không screenshot, không sơ đồ, không tên khách hàng ngoài những gì đã có trong CV public.
2. **Dự án chưa làm: chỉ teaser**, không mô tả cụ thể (không nêu tên thật, thể loại, công nghệ, cốt truyện). Dùng đúng các tiêu đề teaser trong [02-projects.md](02-projects.md#locked-levels--teaser).
3. **Easy Animation: chỉ text**, badge "IN PROGRESS", không dùng hình / video / GIF của dự án (dù repo có media).
4. **Không dùng asset có bản quyền của bên thứ ba**:
   - PvZ: không dùng art / âm thanh của EA / PopCap (kể cả quay màn hình game). Tự vẽ minh hoạ trừu tượng.
   - PAD (Puzzle & Dragons): không dùng ảnh monster / logo GungHo. Dùng hình học trừu tượng (orb màu).
   - Anime Shorts Pipeline: không dùng frame anime hay tên nguồn nội dung có bản quyền.
   - Portfolio RPG: không quay tileset / sprite trong game (license chưa xác minh). Chỉ dùng motif pixel tự vẽ.
   - Matrix intro: chỉ mượn ý tưởng "viên thuốc đỏ / xanh" và terminal xanh; **không** dùng câu thoại phim, ASCII Morpheus.
5. **Không hiển thị tiền thưởng**; ảnh nhận giải có teammate **chưa được đồng ý** → không dùng ảnh người, chỉ dùng đồ hoạ cúp.
6. Email `phamduckha21123@gmail.com` đã được chủ cho phép public, nhưng ưu tiên CTA là link web.
7. Mọi nhạc / SFX / font phải có license rõ ràng (ghi lại nguồn trong `CREDITS.md` của project video).

## Câu hỏi còn mở (hỏi chủ trước khi chốt)

- Thời lượng / nền tảng đích chính: LinkedIn, Facebook, YouTube Shorts, TikTok? (đề xuất: master 60s 16:9 + cut 30s 9:16).
- Có voice-over không? Nếu có: giọng thật của chủ, TTS, hay chỉ nhạc + text (đề xuất mặc định: nhạc + text + SFX).
- `hassasin.com` hiện **vẫn là trang parked của Hostinger** (kiểm tra 2026-10-11). Chỉ để CTA `hassasin.com` khi landing page đã lên; nếu chưa, dùng `game.hassasin.com` + `onepage.hassasin.com`.
- Ảnh chân dung bản "áo trắng" (dark theme) cần chủ export lại dạng PNG nền trong suốt (xem 04, mục Assets).
