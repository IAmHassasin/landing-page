# hassasin.com — Landing page plan

> Trạng thái (2026-10-11): P0, P1 xong; P2 (toàn bộ section + khung promo) và một phần P3 (animation) đã dựng. Chưa deploy.

## 1. Mục tiêu

Landing page cá nhân tại apex `hassasin.com` (hiện chưa có gì phục vụ apex/www):

- Giới thiệu **Kha Pham aka Hassasin** — năng lực, kinh nghiệm, dự án cá nhân.
- Là "cửa chính" dẫn sang các trang đã có:
  - `onepage.hassasin.com` — CV
  - `game.hassasin.com` — portfolio game (Phaser)
  - `portfolio.hassasin.com` — Matrix intro (giữ làm easter egg)
- Thể hiện style cá nhân bằng nhiều animation lấy cảm hứng từ game.

## 2. Yêu cầu đã chốt

| #   | Yêu cầu                                                                                                                                                                             |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | Ảnh chân dung (selfie) là ảnh chính, chiếm khoảng 1/5 góc trên phải của hero                                                                                                        |
| R2  | Theme **theo hệ điều hành** (`prefers-color-scheme`) + nút toggle thủ công (lưu `localStorage`)                                                                                     |
| R3  | Mỗi theme một **ảnh thật**: light = áo đen, dark = áo xám + cổ lọ trắng (áo "đổi sang trắng" khi sang dark). Đã bỏ ảnh áo trắng do máy tạo (2026-10-11)                             |
| R4  | Tiêu đề hiển thị **cả hai**: "KHA PHAM" và "Hassasin"                                                                                                                               |
| R5  | Ngôn ngữ: **EN mặc định**, có toggle sang **VI**                                                                                                                                    |
| R6  | Email liên hệ: `phamduckha21123@gmail.com`                                                                                                                                          |
| R7  | Show dự án cá nhân + năng lực (tương tự onepage / game)                                                                                                                             |
| R8  | Dự án chưa thực hiện: chỉ nhắc dạng teaser, **không mô tả cụ thể**                                                                                                                  |
| R9  | **Easy Animation**: không đưa hình/video/GIF của dự án (kết quả chưa như kỳ vọng); clip promo chỉ là card chữ                                                                       |
| R10 | Không đưa nội dung từ dự án công ty ngoài mức CV đang public (tên công ty, vai trò)                                                                                                 |
| R11 | Achievements: team đạt **giải 2 — "AI Innovation Award"**, DSS **AI Solution Challenge 2026**. Link bài công khai: https://www.facebook.com/share/p/1Gjo7cyAoc/ (kèm ảnh nhận giải) |
| R12 | **Ảnh bìa** hero: ảnh biển hoàng hôn, mỗi theme một ảnh (light = trời nhạt, dark = cam đậm)                                                                                         |
| R13 | **Show off toàn bộ dự án**: mỗi dự án có clip promo **1:1** vài giây (do một dự án khác tạo) đặt cạnh mô tả; xem [PROMO-VIDEOS.md](PROMO-VIDEOS.md)                                 |

## 3. Concept — "Dev's Save File"

Khung sạch, dễ đọc lấy từ CV onepage (token màu teal, Archivo / IBM Plex Mono / Source Sans 3).
Lớp cá tính lấy từ game: cursor nhấp nháy, typewriter, HUD, sprite pixel, quest/level metaphor.
Màu nhấn đỏ/xanh lấy từ "viên thuốc" của Matrix intro.

### Hero (desktop)

```
┌──────────────────────────────────────────────┬───────────┐
│ > hassasin.com_ (typewriter)    [EN|VI] [☀/☾]│  PHOTO    │
│ KHA PHAM  aka Hassasin                       │  (~1/5,   │
│ Senior Full-stack · R&D Lead ▌(roles cycle)  │  top-     │
│ "Anything that can go wrong, will go wrong"  │  right)   │
│ [▶ Play the game]  [📄 Read CV]               ├───────────┘
│ ░░ pixel sprite chạy dọc đáy hero ░░          │
└──────────────────────────────────────────────┘
```

Mobile: ảnh thu nhỏ (tròn/vuông) đặt cạnh tên, layout 1 cột.

## 4. Ảnh chính, ảnh bìa & đổi theme

### Avatar (script Python chạy local — không upload ảnh lên dịch vụ ngoài)

`tools/avatar/process_avatar.py` xử lý hai ảnh nguồn trong `tools/avatar/input/` (gitignored):

- `avatar-light-source.png` — áo đen → `src/assets/avatar/avatar-light.webp`
- `avatar-dark-source.png` — áo xám, cổ lọ trắng → `src/assets/avatar/avatar-dark.webp`

Mỗi ảnh: crop đầu + vai, tách nền (rembg), **lật ngang** (selfie gương), đặt chung một canvas để crossfade khớp.

### Ảnh bìa

`src/assets/cover/cover-light.*` và `cover-dark.*` (jpg/png/webp). Thiếu file thì hero hiển thị không có ảnh bìa.
Astro tự sinh AVIF/WebP nhiều kích thước; ảnh trôi chậm (Ken Burns), tắt khi reduced motion.

### Runtime

- Toàn trang đổi theme bằng vòng tròn lan từ nút toggle (View Transitions API, fallback crossfade).
- Avatar và ảnh bìa crossfade giữa hai bản theo theme.
- Lần tải đầu: theme theo hệ điều hành, inline script trong `<head>` để tránh nháy sai theme.

## 5. Sections

| #   | Section                 | Nội dung                                                                                      | Animation                                                     |
| --- | ----------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 0   | Boot (≤1.2s, skip được) | `LOADING SAVE FILE…`                                                                          | Progress bar pixel `steps()`                                  |
| 1   | Hero                    | Như mục 3                                                                                     | Typewriter, glitch nhẹ tagline, sprite chạy                   |
| 2   | Player Stats            | 5 năm · 2 Marketplace apps · 5 platforms · Lead từ 2025                                       | Count-up, thanh EXP fill khi scroll tới                       |
| 3   | Skill Tree              | Core stack trong CV, 7 nhánh                                                                  | Node sáng dần, tooltip                                        |
| 4   | Quest Log               | Dự án cá nhân, lọc Games / AI / Tools / Media                                                 | Card tilt theo chuột, reveal, badge "CLEARED" / "IN PROGRESS" |
| 5   | Save Points             | Timeline kinh nghiệm (mức chi tiết như onepage)                                               | Đường timeline tự vẽ theo scroll                              |
| 5b  | Achievements (Trophies) | AI Solution Challenge 2026 — AI Innovation Award (giải 2, team), link bài viết, ảnh nhận giải | Trophy "unlock" toast kiểu achievement game, confetti pixel   |
| 6   | Locked Levels           | Teaser dự án chưa làm                                                                         | Card khóa, silhouette, `???` nhấp nháy                        |
| 7   | Contact / Footer        | Email, GitHub, LinkedIn, link game / CV / Matrix intro                                        | Konami code → easter egg                                      |

### Quest Log — dự án

| Dự án                                          | Nhóm  | Ghi chú                                                                                               |
| ---------------------------------------------- | ----- | ----------------------------------------------------------------------------------------------------- |
| PAD Searching Tool (+ pad-quicksearch là "v1") | Tools | Full-stack, Android, OCI/Cloudflare. Cần chụp screenshot. **Không nhắc phần scrape appmedia.**        |
| Short Video Generator                          | AI    | Pipeline end-to-end. Không nêu tên nguồn nội dung có bản quyền.                                       |
| synthvox                                       | AI    | TTS với markup riêng. Cần thu 2–3 audio mẫu.                                                          |
| P2P Streaming Video                            | Media | WebRTC + Tailscale. Cần sơ đồ kiến trúc.                                                              |
| Dragon Chase                                   | Games | Có thể nhúng làm demo chơi được.                                                                      |
| PvZ: Survival Night                            | Games | Chỉ link + mô tả, **không host asset** (repo có art của EA/PopCap). Ghi "non-commercial fan project". |
| Easy Animation                                 | Media | **Chỉ mô tả bằng chữ, badge "IN PROGRESS", không media** (R9).                                        |
| PAD AI Assistant                               | AI    | Tùy chọn, gộp chung "PAD suite".                                                                      |

Không đưa lên: douyin_local_pipeline, opgg-ai-assistant (rủi ro ToS), riftpool, PAD DB, tampermonkey_script, not-simple-todo-list, form-animated-avatar.

### Locked Levels — teaser (không mô tả cụ thể, R8)

Ví dụ: "Lv.?? — A legend retold", "Lv.?? — Something in the cloud", "Lv.?? — ???", "+ more loading…".
Phu Dong Thien Vuong (hiện là fork upstream) chỉ xuất hiện ở đây.

## 6. Kỹ thuật

- **Astro + TypeScript + GSAP (ScrollTrigger)**. Astro build ra static → hợp với OCI bucket hiện có. Dự án viết thành content collection (markdown).
- **i18n**: Astro i18n routing, `/` = EN, `/vi/` = VI. Text tiếng Việt chỉ nằm trong file nội dung/locale (markdown, JSON), **không hard-code trong component** (theo quy định code chỉ dùng tiếng Anh).
- Sprite pixel: CSS `steps()` hoặc canvas nhỏ. **Không dùng Phaser** (quá nặng).
- **Tự vẽ sprite nhân vật** theo hình chủ (kính, áo đen). Không dùng tileset/sprite "misa" của game vì chưa xác minh license.
- Font + token màu kế thừa từ `portfolio-site/cv-onepage/src/styles.css`, thêm VT323 (hoặc font pixel) cho HUD.
- Email: render bằng JS / ghép chuỗi để giảm bot scrape.
- `prefers-reduced-motion`: tắt bớt animation, bỏ Boot. GIF → webm/mp4 + lazy-load. Mục tiêu Lighthouse ≥ 90.
- Nguồn nội dung CV: `portfolio-site/content/CV.md` (copy / sync script; hợp nhất sau).

## 7. Deploy

- Tái dùng module bucket trong `portfolio-site/iac` + pattern Cloudflare Worker có sẵn.
- Worker mới cho `hassasin.com`; `www.hassasin.com` → 301 về apex.
- **Hạ tầng / DNS cần chủ review trước khi apply.**

## 8. Lộ trình

| Phase | Việc                                                                               |
| ----- | ---------------------------------------------------------------------------------- |
| P0    | Scaffold Astro + ESLint/Prettier, design token, theme toggle (theo OS), i18n EN/VI |
| P1    | Xử lý ảnh (2 bản + mask), vẽ sprite pixel, thu thập media dự án                    |
| P2    | Layout + nội dung tĩnh cho tất cả section (EN + VI)                                |
| P3    | Animation: hero, theme switch + outfit sweep, scroll, easter egg                   |
| P4    | Infra apex domain (review trước khi apply)                                         |
| P5    | QA: mobile, reduced-motion, Lighthouse, cross-browser                              |

## 9. Việc còn mở

- Achievements: cần file ảnh gốc nhận giải; xác nhận teammates đồng ý xuất hiện (hoặc crop / làm mờ); 1–2 câu mô tả giải pháp dự thi (mức public). Không hiển thị số tiền thưởng.

- Media cần bổ sung: screenshot PAD Searching Tool, PvZ (nếu dùng), sơ đồ P2P, audio synthvox.
- Quyết định giữ hay bỏ PAD AI Assistant ở Quest Log.
- Nội dung bản VI: dịch từ EN hay viết riêng.
