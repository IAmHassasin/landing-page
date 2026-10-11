# 02 — Projects (Quest Log)

Tất cả là dự án cá nhân (GitHub `IAmHassasin`). Thứ tự dưới đây là **thứ tự ưu tiên** khi dựng video.
Không có screenshot / footage trên máy dựng video → minh hoạ bằng **đồ hoạ tự dựng trong HTML/CSS** theo cột
"Cách minh hoạ". Phần nào được phép quay màn hình thật thì đã ghi rõ.

Badge: `LIVE` (có link chơi / dùng), `WORKING` (chạy được, chưa public), `PROTOTYPE`, `IN PROGRESS`.

## Tóm tắt

| #   | Dự án                 | Nhóm  | Badge       | Link public                                                  |
| --- | --------------------- | ----- | ----------- | ------------------------------------------------------------ |
| 1   | PvZ: Survival Night   | Games | LIVE        | pvz.hassasin.com                                             |
| 2   | PAD Searching Tool    | Tools | LIVE        | pst.hassasin.com · github.com/IAmHassasin/pad-searching-tool |
| 3   | Anime Shorts Pipeline | AI    | WORKING     | —                                                            |
| 4   | Portfolio RPG         | Games | LIVE        | game.hassasin.com                                            |
| 5   | synthvox              | AI    | WORKING     | —                                                            |
| 6   | P2P Streaming Video   | Media | PROTOTYPE   | github.com/IAmHassasin/p2p-streaming-video                   |
| 7   | Dragon Chase          | Games | PROTOTYPE   | —                                                            |
| 8   | PAD AI Assistant      | AI    | PROTOTYPE   | — (có thể gộp với #2 thành "PAD suite")                      |
| 9   | Easy Animation        | Media | IN PROGRESS | — (**chỉ text**)                                             |

Các trang khác của chủ: `onepage.hassasin.com` (CV 1 trang), `portfolio.hassasin.com` (Matrix intro — easter egg),
`hassasin.com` (landing page, **chưa lên**, xem README).

---

## 1. PvZ: Survival Night — Games · LIVE · 2026

- **Tagline:** Plants vs. Zombies reworked into a day/night survival roguelike.
- **Stack:** TypeScript, three.js, Rapier, Vite, Vitest
- **Điểm nhấn:**
  - Turn-based loop: plant by day, choose whether to go looting, survive the night.
  - Each night resolves lane by lane from per-lane odds; plants wear down and mowers run out.
  - Difficulty scales every round; English / Vietnamese toggle.
- **Mô tả:** A non-commercial fan project that keeps the lanes of the original and swaps real-time defence for
  decisions. Every choice in the day phase shows up as odds at night.
- **Cách minh hoạ:** lưới 5 làn, nền chuyển ngày → đêm (mặt trời lặn, trăng lên), mỗi làn hiện `% survive`
  đếm lên/xuống, ô bị "hold" xanh / "break" đỏ. **Không** dùng art, logo, font, âm thanh của EA / PopCap, kể cả quay
  màn hình. Ghi chú nhỏ dưới tên: `non-commercial fan project`.

## 2. PAD Searching Tool — Tools · LIVE · 2024 – 2026

- **Tagline:** A Puzzle & Dragons monster finder that filters by what skills actually do.
- **Stack:** NestJS, TypeORM, SQLite, React, TanStack Query, Capacitor, Docker, Terraform, Cloudflare Workers
- **Điểm nhấn:**
  - Regex skill-pattern filters on top of classic monster filters, in a three-panel UI.
  - NestJS API over the community DadGuide database, with an admin data refresh.
  - Self-hosted on an Oracle Cloud VM behind a Cloudflare Worker, provisioned with Terraform; Android build via Capacitor.
- **Câu chuyện:** Started in 2024 as a static quick-search page for the NA community after third-party tools shut
  down; grew into the most active side project, run end to end from database import to infrastructure.
- **Cách minh hoạ:** mock UI 3 cột (filter · kết quả dạng lưới ô vuông · chi tiết), ô search gõ regex kiểu
  `/delay \d+ turns/`, kết quả lọc dần. Ô kết quả là **orb màu trừu tượng** (đỏ, xanh dương, xanh lá, vàng, tím) —
  không dùng ảnh monster / logo game. Có thể thêm sơ đồ nhỏ: `Phone (Android) / Web → Cloudflare Worker → Oracle VM (NestJS + SQLite)`.

## 3. Anime Shorts Pipeline — AI · WORKING · 2026

(Tên repo: `short-video-generator`.)

- **Tagline:** One wiki link in, a vertical anime short with Vietnamese voice-over out.
- **Stack:** Python, Remotion, React, ffmpeg, Gemini, faster-whisper
- **Điểm nhấn:**
  - End to end: scrape the wiki page, write the script with an LLM, voice it, align subtitles, render.
  - Vietnamese TTS voice-over with word-level karaoke subtitles aligned by Whisper.
  - Batch queues and a hand-off mode so non-developers can run it.
- **Cách minh hoạ:** pipeline 5 node nối bằng đường chạy sáng:
  `URL → LLM script → Voice (TTS) → Whisper align → Remotion 9:16`, cuối cùng là khung điện thoại dọc với phụ đề
  karaoke tô màu từng chữ. Khung video bên trong để **trống / gradient**, không dùng hình anime, không nêu tên wiki / series.
- **Meta-joke dùng được:** "This video was not made with it… but it could have been."

## 4. Portfolio RPG — Games · LIVE · 2026

- **Tagline:** My CV as a small top-down pixel-art RPG.
- **Stack:** Phaser 3, TypeScript, Vite, Tiled
- **Điểm nhấn:**
  - Walk around a pixel-art town and press E at each landmark to open a CV section.
  - Sections open on a scrollable parchment dialog with a typewriter intro.
  - Content comes from the same Markdown file as the one-page CV (game and CV never drift apart).
- **Cách minh hoạ:** nhân vật pixel **tự vẽ** (kính, áo đen — giống chủ) đi tới biển hiệu, hiện nút `[E]`,
  hộp thoại giấy da gõ chữ "Experience". **Không** quay màn hình game (tileset / sprite trong game chưa xác minh license).

## 5. synthvox — AI · WORKING · 2026

- **Tagline:** A text-to-speech engine for voices with character, steered by inline markup.
- **Stack:** Python, Piper, ONNX, pyworld, pedalboard, Typer, pytest
- **Điểm nhấn:**
  - A small markup language for mood, pacing, stress and pauses: `--sarcastic--`, `[tired]`, `|800|`.
  - Pitch contour, voice quality and glitch effects for game-style characters.
  - Speech-recognition checks keep the output intelligible as effects stack up.
- **Cách minh hoạ:** dòng text có markup được tô màu cú pháp, rồi "biến" thành waveform; token `|glitch|` làm waveform
  giật. Ví dụ markup (từ README, tiếng Việt):
  `--Ồ, bạn lại chọn cửa bên *trái*.-- &&Bất ngờ *thật* đấy&& |glitch|.`
- **Audio mẫu:** repo có vài file WAV mẫu; chỉ dùng nếu chủ chép sang **và** xác nhận license voice model. Mặc định: không dùng audio.

## 6. P2P Streaming Video — Media · PROTOTYPE · 2026

- **Tagline:** Stream films from a home PC to a phone over WebRTC, with no server in between.
- **Stack:** Python, FastAPI, aiortc, PyAV, WebRTC, Tailscale
- **Điểm nhấn:**
  - The phone pairs with the PC by scanning a QR code; traffic stays on the Tailscale network.
  - Seeking, sidecar SRT/VTT subtitles and quality presets.
  - Testbed for latency and NAT-traversal ideas.
- **Cách minh hoạ:** icon PC ↔ điện thoại, QR code nhấp nháy rồi "kết nối", luồng gói tin đi trong đường ống
  có nhãn `Tailscale`, gạch chéo chữ `server` ở giữa. Video trên điện thoại: khung gradient / pattern, không dùng phim thật.

## 7. Dragon Chase — Games · PROTOTYPE · 2026

- **Tagline:** A slither-style dragon whose body is a real physics chain.
- **Stack:** TypeScript, Rapier2D, Canvas 2D, Vite, Playwright
- **Điểm nhấn:**
  - The mouse steers the head; 22 segments follow through motor-driven joints.
  - The body keeps real inertia when it eats, hits obstacles or rams other creatures.
  - Playwright scripts check the simulation after long runs.
- **Cách minh hoạ (được phép dựng lại giống game, art là của chủ; mã màu ước lượng từ screenshot test):** nền `#0b1120` có lưới mờ; con rồng là chuỗi
  22 đốt hình chữ nhật xanh lá (đậm dần về đuôi), đầu là ô vuông trắng có 2 mắt đen; thức ăn chấm vàng `#ffd43b`;
  chướng ngại là khối chữ nhật xám `#5c6575` viền sáng xoay nghiêng; NPC là ô vuông đỏ hồng `#ff5c6c`.
  HUD góc trái: `Score / Segments: 22 / Creatures defeated`. Chuyển động uốn lượn có quán tính (spring / lag theo đốt).

## 8. PAD AI Assistant — AI · PROTOTYPE · 2026 (tuỳ chọn)

- **Tagline:** Ask questions about Puzzle & Dragons in plain language.
- **Stack:** Python, Gemini, SQLite, ChromaDB, Docker
- **Điểm nhấn:** Gemini turns a question into structured filters; SQLite applies hard constraints; ChromaDB narrows
  by meaning; answers in Vietnamese. "The language model plans the query and writes the answer, but the database decides what is true."
- **Cách minh hoạ:** bong bóng chat hỏi → tách thành chip filter → 2 cột "SQL" và "Vector" giao nhau → câu trả lời.
  Nếu thiếu thời lượng: gộp với #2 thành 1 cảnh "PAD suite".

## 9. Easy Animation — Media · IN PROGRESS · 2026 (**chỉ text**)

- **Tagline:** 2D character animation in the browser for content creators.
- **Text được dùng:** "Pick a character and a motion preset, export a video or a GIF. Audio-driven lip sync. Runs fully in the browser."
- **Ràng buộc:** không hình, không video, không GIF, không nhân vật mẫu. Chỉ card chữ + badge `IN PROGRESS` + thanh tiến độ nhấp nháy.

---

## Không đưa vào video

Các repo cá nhân khác (fork, thử nghiệm, rủi ro điều khoản dịch vụ, tool nội bộ) — **không nhắc tên**.
Mọi dự án công ty — chỉ ở mức dòng HUD trong [01](01-persona-and-brand.md#kinh-nghiệm--chỉ-ở-mức-này-không-thêm-chi-tiết).

## Locked Levels — teaser

Chủ có một số dự án / mục tiêu **chưa bắt đầu**. Chỉ được nhắc dưới dạng card bị khoá, **không** thêm chi tiết
nào ngoài đúng các dòng dưới (không đoán thể loại, công nghệ, cốt truyện):

| Card   | Text trên card             |
| ------ | -------------------------- |
| Lv.??  | **A legend retold**        |
| Lv.??  | **Something in the cloud** |
| Lv.??  | **???**                    |
| Lv.??  | **Next class unlock**      |
| (cuối) | **+ more loading…**        |

Phụ đề cảnh: EN `"More levels are being built."` · VI `"Còn nhiều màn chơi đang được xây."`
Hình: silhouette mờ / nhiễu, ổ khoá pixel, `???` nhấp nháy màu pill red. Không gợi ý hình ảnh cụ thể (ví dụ không vẽ
nhân vật cổ trang, mây, server…) — chỉ dùng hình khối trừu tượng.
