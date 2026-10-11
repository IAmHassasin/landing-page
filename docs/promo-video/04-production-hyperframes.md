# 04 — Production (HyperFrames + React)

## Tool

**HyperFrames** (HeyGen, open source): viết composition bằng HTML + CSS + GSAP, render ra MP4 qua headless browser + FFmpeg.

Đã kiểm tra sơ bộ (2026-10-11, qua tài liệu bên thứ ba — **phải đối chiếu lại docs chính thức**
https://github.com/heygen-com/hyperframes trước khi code):

- CLI có các bước init → preview (live reload trên browser) → render MP4.
- Cần Node.js 22+ và FFmpeg; có chế độ Docker để render ổn định giữa các máy.
- Clip trong composition được định thời bằng data attribute (ví dụ `data-start`, `data-duration`, `data-track-index`) —
  chưa xác minh ngữ nghĩa chính xác.
- Có skill cho Claude Code: `npx skills add heygen-com/hyperframes` — nên cài và đọc trước.

### React dùng ở đâu

HyperFrames nhận HTML thuần. Cách an toàn:

1. Viết scene bằng HTML/CSS + GSAP timeline (đường chính).
2. Nếu muốn React: dùng React để **sinh HTML tĩnh** cho phần lặp (ví dụ 7 quest card từ 1 mảng JSON qua
   `renderToStaticMarkup`) rồi đưa vào composition. Kiểm tra docs HyperFrames xem có hỗ trợ React trực tiếp không
   trước khi chọn cách khác.
3. Phương án dự phòng nếu HyperFrames vướng: **Remotion** (React thuần cho video; chủ đã dùng Remotion trong Anime Shorts
   Pipeline). Kiểm tra điều kiện license Remotion trước khi dùng.

Giữ nguyên quy ước của chủ: code, comment, tên biến **chỉ tiếng Anh**; text tiếng Việt chỉ nằm trong file dữ liệu
(ví dụ `copy/vi.json`), không hard-code trong component.

## Spec xuất file

| Bản          | Kích thước                | FPS | Thời lượng | Ghi chú                                   |
| ------------ | ------------------------- | --- | ---------- | ----------------------------------------- |
| Master       | 1920×1080                 | 30  | 60s        | EN                                        |
| Master VI    | 1920×1080                 | 30  | 60s        | Thay text bằng `copy/vi.json` hoặc phụ đề |
| Cut vertical | 1080×1920                 | 30  | 30s        | Safe area trên 250px, dưới 400px          |
| Teaser       | 1080×1920                 | 30  | 10–15s     | Tuỳ chọn                                  |
| Thumbnail    | 1920×1080 + 1080×1920 PNG | —   | —          | Xem 03                                    |

MP4 H.264, `yuv420p`, AAC 48 kHz; âm lượng tổng ~-14 LUFS (mạng xã hội). Chữ nhỏ nhất ≥ 28px ở 1080p.

## Cấu trúc project đề xuất

```
promo-video/
  assets/
    avatar/        avatar-light.png, avatar-dark.png (nền trong suốt)
    fonts/         Archivo, Source Sans 3, IBM Plex Mono, VT323 (woff2, local)
    audio/         music.mp3, sfx/*.wav
  copy/            en.json, vi.json            # toàn bộ text trên màn hình
  data/            projects.json               # lấy từ 02-projects.md
  styles/          tokens.css                  # màu + font từ 01
  compositions/    master-16x9.html, cut-9x16.html, teaser.html
  scenes/          boot, identity, theme-flip, stats, skill-tree, quest-log, trophy, locked-levels, cta
  CREDITS.md       # nguồn + license của nhạc, SFX, font
```

Font: tải file về `assets/fonts` (đừng load Google Fonts lúc render) để render ổn định offline.

## Asset chủ cần chép sang máy dựng video

Máy dựng **không có** source các dự án. Chủ chép thủ công các file sau (từ máy này):

| Asset               | Nguồn trên máy chủ                                 | Trạng thái                                                                                                                                                                                                                             |
| ------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chân dung áo đen    | `landing-page/src/assets/avatar/avatar-light.webp` | Có: WebP 960×1348, nền trong suốt (có kênh alpha)                                                                                                                                                                                      |
| Chân dung áo trắng  | —                                                  | **Chưa có file riêng.** `avatar-dark.webp` hiện **giống hệt từng byte** với `avatar-light.webp`. Bản áo trắng chỉ có trong `tools/avatar/output/preview.png` (ghép đôi 2 ảnh, có nền) → cần chạy lại pipeline để export PNG trong suốt |
| Ảnh xem trước 2 bản | `landing-page/tools/avatar/output/preview.png`     | Có — chỉ để tham khảo, không dùng trực tiếp                                                                                                                                                                                            |

Không chép: ảnh selfie gốc (có điện thoại / thang máy), media của Easy Animation, art PvZ, ảnh monster PAD, tileset Portfolio RPG.

Nhạc / SFX: repo không có sẵn → chọn từ thư viện royalty-free có license thương mại / mạng xã hội, ghi vào `CREDITS.md`.

## Ghi chú kỹ thuật cho các hiệu ứng chính

- **Outfit sweep:** hai ảnh chân dung căn khít nhau, chỉ khác màu áo. Đặt bản áo trắng chồng lên bản áo đen rồi
  animate `mask-image: linear-gradient(to bottom, #000 X%, transparent X%+8%)` từ trên xuống. Vì mặt / tóc giống hệt
  nhau nên mắt người xem chỉ thấy áo đổi màu → **không cần mask riêng vùng áo**. Bắt đầu sweep ở vị trí cổ áo
  (~55% chiều cao ảnh), trễ ~150 ms sau vòng tròn đổi theme.
- **Theme flip:** `clip-path: circle(r at x y)` của lớp dark, r từ 0 → đường chéo khung, ease `cubic-bezier(0.22, 1, 0.36, 1)`, ~450 ms.
- **Pixel progress / blink:** GSAP `ease: "steps(n)"`; cursor blink 530 ms.
- **Typewriter:** cắt chuỗi theo frame (deterministic), không dùng `setInterval`.
- **Count-up:** tween object số, làm tròn mỗi frame, font VT323 tabular.
- **Dragon Chase:** chuỗi 22 đốt, mỗi đốt theo đốt trước với độ trễ / spring → tính trước vị trí theo frame (không chạy physics thật lúc render để đảm bảo deterministic).
- Mọi animation phải tính theo thời gian timeline, không phụ thuộc thời gian thực / random không seed.

## Checklist QA trước khi giao

- [ ] Không có tên / hình / sơ đồ dự án công ty ngoài dòng HUD đã cho (xem [01](01-persona-and-brand.md)).
- [ ] Locked Levels chỉ dùng đúng text teaser trong [02](02-projects.md#locked-levels--teaser).
- [ ] Easy Animation chỉ có chữ.
- [ ] Không có asset của EA / PopCap, GungHo, anime, Matrix (thoại / Morpheus), tileset Portfolio RPG.
- [ ] Không hiện tiền thưởng; không có ảnh teammate.
- [ ] CTA `hassasin.com` chỉ khi landing page đã live (hiện là trang parked).
- [ ] Chính tả EN / VI; tên "KHA PHAM aka Hassasin" đúng.
- [ ] Tương phản chữ đạt (≥ 4.5:1 cho chữ nhỏ), chữ không bị UI nền tảng che (bản 9:16).
- [ ] `CREDITS.md` đủ nguồn nhạc, SFX, font.
- [ ] Chủ xem bản preview và duyệt trước khi đăng.
