# 03 — Storyboard

Concept: **"Dev's Save File"** — người xem "load save game" của Kha Pham: xem chỉ số, cây kỹ năng, quest đã
clear, cúp, rồi thấy các level còn khoá. Kết bằng "PRESS START".

Đây là **đề xuất**; text trên màn hình đã viết sẵn EN (chính) + VI (bản phụ). Timing tính ở 30 fps.

## Bản master — 60s · 16:9 · 1920×1080

| #   | Thời gian | Cảnh                         | Hình & chuyển động                                                                                                                                                                                                                                            | Text trên màn hình (EN / VI)                                                                                                                                                           |
| --- | --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 0:00–0:04 | Boot                         | Nền đen `#010101`, chữ VT323 xanh terminal gõ ra; thanh progress pixel chạy `steps(12)`; 2 chấm đỏ/xanh "pill" chớp ở cuối. Glitch → cắt sang nền `#0d1114`.                                                                                                  | `> LOADING SAVE FILE…` → `> PLAYER FOUND` / `> ĐANG TẢI SAVE FILE…` → `> ĐÃ TÌM THẤY NGƯỜI CHƠI`                                                                                       |
| 2   | 0:04–0:10 | Identity                     | Prompt `> hassasin.com_` gõ ở góc trên trái. "KHA PHAM" (Archivo 800, rất to) dập vào từng chữ; "aka Hassasin" (VT323, teal) gõ ra bên dưới. Ảnh chân dung **áo đen**, nền light, trượt vào góc phải (~1/5 khung) với gạch chân teal.                         | `KHA PHAM` · `aka Hassasin`                                                                                                                                                            |
| 3   | 0:10–0:14 | Role cycle + tagline         | Dòng mono gõ / xoá lần lượt 3 role. Tagline hiện với glitch đỏ/xanh 3 frame.                                                                                                                                                                                  | `Senior Full-stack Engineer` → `R&D / Product Lead` → `Indie game tinkerer` · `"Anything that can go wrong, will go wrong"`                                                            |
| 4   | 0:14–0:17 | **Theme flip** (cảnh chữ ký) | Icon ☀ đổi ☾; vòng tròn tối lan từ icon phủ cả khung (light → dark). Trễ ~150 ms: áo trong ảnh quét **đen → trắng** từ cổ áo xuống.                                                                                                                           | (không text, hoặc HUD nhỏ `THEME: DARK`)                                                                                                                                               |
| 5   | 0:17–0:23 | Player Stats                 | 4 ô HUD, số count-up (VT323), mỗi ô có thanh EXP teal fill. Ô cuối kèm sao nhỏ.                                                                                                                                                                               | `5 YEARS IN PRODUCTION` · `2 MARKETPLACE APPS` · `5 PLATFORMS SHIPPED` · `LEAD SINCE 2025` / `5 NĂM LÀM PRODUCTION` · `2 APP TRÊN MARKETPLACE` · `5 NỀN TẢNG ĐÃ SHIP` · `LEAD TỪ 2025` |
| 6   | 0:23–0:27 | Skill Tree                   | Cây 7 nhánh từ tâm "HASSASIN", node sáng lan dần; mỗi nhánh hiện 2–3 tên nổi bật.                                                                                                                                                                             | `SKILL TREE` + tên nhánh (xem 01)                                                                                                                                                      |
| 7   | 0:27–0:30 | Quest Log intro              | Tiêu đề quét ngang, filter chip `GAMES · AI · TOOLS · MEDIA` bật lần lượt.                                                                                                                                                                                    | `QUEST LOG — side projects` / `NHẬT KÝ NHIỆM VỤ — dự án cá nhân`                                                                                                                       |
| 8   | 0:30–0:46 | Quest cards                  | ~2.2s / dự án, theo thứ tự trong [02](02-projects.md): PvZ → PAD Searching Tool → Anime Shorts Pipeline → Portfolio RPG → synthvox → P2P → Dragon Chase. Mỗi card: minh hoạ trừu tượng chiếm 60% trái, tên + tagline + 3 tag stack bên phải, badge dập xuống. | Tên + tagline (EN) của từng dự án                                                                                                                                                      |
| 9   | 0:46–0:48 | Easy Animation               | Card **chỉ chữ**, badge `IN PROGRESS` nhấp nháy, thanh tiến độ dừng ở ~60%.                                                                                                                                                                                   | `Easy Animation — 2D character animation in the browser` · `IN PROGRESS`                                                                                                               |
| 10  | 0:48–0:52 | Trophy                       | Toast trượt từ trên xuống kiểu console: icon cúp pixel, âm "unlock"; confetti pixel vuông teal/đỏ/xanh.                                                                                                                                                       | `🏆 ACHIEVEMENT UNLOCKED` · `AI Innovation Award — 2nd prize (team)` · `DSS AI Solution Challenge 2026`                                                                                |
| 11  | 0:52–0:56 | Locked Levels                | 4 card khoá trượt vào thành hàng, ổ khoá rung, `???` nhấp nháy đỏ; card cuối "+ more loading…" có thanh progress chạy mãi.                                                                                                                                    | `LOCKED LEVELS` · `A legend retold` · `Something in the cloud` · `???` · `Next class unlock` · `+ more loading…` / `MÀN CHƠI ĐANG KHOÁ`                                                |
| 12  | 0:56–1:00 | CTA                          | Nền dark, ảnh chân dung **áo trắng** quay lại góc phải; chữ `PRESS START` nhấp nháy; danh sách link gõ ra; cursor `▌` giữ ở cuối.                                                                                                                             | `PRESS START` · `hassasin.com` (nếu đã live) · `game.hassasin.com` · `onepage.hassasin.com` · `github.com/IAmHassasin` / `NHẤN START`                                                  |

### Nhịp & âm thanh

- Nhạc: chiptune / synthwave nhẹ, ~110–125 BPM, có "drop" đúng cảnh 4 (theme flip). Cắt cảnh theo phách.
- SFX: gõ phím (cảnh 1–3), "whoosh" vòng tròn (4), tick count-up (5), "stamp" badge (8), "unlock" (10), "clunk" ổ khoá (11), "coin/start" (12).
- Không voice-over mặc định. Nếu chủ muốn VO, viết lại cảnh 2–3 thành 2 câu ngắn trong [01](01-persona-and-brand.md#câu-giới-thiệu-ngắn-đề-xuất-chủ-chưa-duyệt-chữ).

## Bản cắt — 30s · 9:16 · 1080×1920

Cho Reels / Shorts / TikTok. Bố cục dọc: ảnh chân dung **trên cùng giữa** (vòng tròn hoặc vuông bo góc), text dưới.
Safe area: chừa 250px trên và 400px dưới cho UI nền tảng.

| #   | Thời gian | Cảnh                                                                                        |
| --- | --------- | ------------------------------------------------------------------------------------------- |
| 1   | 0–2s      | Boot rút gọn (`LOADING SAVE FILE…`)                                                         |
| 2   | 2–6s      | KHA PHAM aka Hassasin + 1 role                                                              |
| 3   | 6–9s      | Theme flip + outfit sweep (giữ nguyên, đây là hook thị giác)                                |
| 4   | 9–12s     | 4 stats xếp lưới 2×2                                                                        |
| 5   | 12–22s    | 4 quest card: PvZ, PAD Searching Tool, Anime Shorts Pipeline, Dragon Chase (~2.5s mỗi card) |
| 6   | 22–25s    | Trophy toast                                                                                |
| 7   | 25–28s    | Locked Levels (3 card + "more loading…")                                                    |
| 8   | 28–30s    | PRESS START + 1 link chính                                                                  |

## Teaser tuỳ chọn — 10–15s

Chỉ cảnh Boot → KHA PHAM → Theme flip/outfit sweep → `PRESS START · hassasin.com` (dùng khi landing page lên sóng).

## Thumbnail / poster frame

Frame cuối cảnh 4 (dark, áo trắng) + tên to + `aka Hassasin`. Xuất PNG 1920×1080 và 1080×1920.
