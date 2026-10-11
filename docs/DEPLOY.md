# Deploy hassasin.com

Kiến trúc giống các subdomain đang chạy (`game.`, `onepage.`, `portfolio.`):

```
Trình duyệt ──► Cloudflare Worker "hassasin-landing" ──► OCI Object Storage
                (hassasin.com, www → 301)                  bucket portfolio-site-static-dev / landing/
```

| Thành phần      | Ở đâu                                                                               |
| --------------- | ----------------------------------------------------------------------------------- |
| File tĩnh       | OCI bucket `portfolio-site-static-dev`, region `ap-singapore-2`, thư mục `landing/` |
| Worker          | [deploy/cloudflare/worker.js](../deploy/cloudflare/worker.js)                       |
| Cấu hình upload | `.env.deploy` (gitignored), mẫu ở [.env.deploy.example](../.env.deploy.example)     |

## 1. Upload bản build lên bucket

```sh
npm run build
npm run deploy:oci            # upload dist/ vào landing/ (content-type + cache-control theo loại file)
npm run deploy:oci -- --prune # tuỳ chọn: xoá object cũ trong landing/ không còn trong bản build
```

Cần OCI CLI đã đăng nhập (`oci os ns get` chạy được). Cache: HTML `no-cache`, `_astro/*` 1 năm (tên file có hash),
`media/*` 7 ngày, còn lại 1 giờ.

> Lần đầu đã upload ngày 2026-10-11 (143 file). Kiểm tra trực tiếp:
> `https://objectstorage.ap-singapore-2.oraclecloud.com/n/axqtl5gbgwnz/b/portfolio-site-static-dev/o/landing/index.html`

## 2. Tạo Worker (Cloudflare dashboard)

1. **Workers & Pages → Create → Create Worker**, đặt tên `hassasin-landing` → **Deploy** (code mẫu).
2. **Edit code** → xoá hết, dán nội dung [deploy/cloudflare/worker.js](../deploy/cloudflare/worker.js) → **Deploy**.
3. **Settings → Variables and Secrets → Add** (kiểu _Text_):

   | Name          | Value                                                                                                       |
   | ------------- | ----------------------------------------------------------------------------------------------------------- |
   | `APEX_HOST`   | `hassasin.com`                                                                                              |
   | `ORIGIN_BASE` | `https://objectstorage.ap-singapore-2.oraclecloud.com/n/axqtl5gbgwnz/b/portfolio-site-static-dev/o/landing` |

   → **Deploy**.

## 3. Gỡ trang parking của Hostinger khỏi apex

`hassasin.com` hiện trả về trang _"Parked Domain name on Hostinger DNS system"_ qua Cloudflare.

1. **hassasin.com → DNS → Records**. **Chụp lại / ghi lại** các record trước khi sửa (để rollback).
2. Chỉ xoá các record **A / AAAA / CNAME** có Name là `hassasin.com` (`@`) và `www`.
3. **Không đụng** tới record của `game`, `onepage`, `portfolio`, `pst`, `pvz`, `riftpool`, và mọi record **MX / TXT**
   (email, xác minh domain).

## 4. Gắn domain vào Worker

Worker `hassasin-landing` → **Settings → Domains & Routes → Add → Custom domain**:

1. `hassasin.com` → **Add domain**
2. `www.hassasin.com` → **Add domain**

Cloudflare tự tạo DNS record và chứng chỉ HTTPS (thường vài phút). Nếu báo trùng record → quay lại bước 3.

### Cách khác: Wrangler

```sh
cd deploy/cloudflare
cp wrangler.toml.example wrangler.toml
npx wrangler login
npx wrangler deploy   # tạo worker, biến môi trường và 2 custom domain (vẫn cần làm bước 3 trước)
```

## 5. Kiểm tra sau khi lên

```sh
curl -sI https://hassasin.com/                 # 200, content-type text/html, có strict-transport-security
curl -sI https://www.hassasin.com/vi/          # 301 → https://hassasin.com/vi/
curl -sI https://hassasin.com/vi               # 301 → https://hassasin.com/vi/
curl -sI https://hassasin.com/khong-co/        # 404 (trang "Game over")
curl -s -o /dev/null -w "%{http_code}\n" -H "Range: bytes=0-99" \
  https://hassasin.com/media/projects/synthvox/promo.mp4   # 206
```

Mở trình duyệt: light/dark, EN/VI, video tự phát, ảnh bìa hiện từ pixel.

## Rollback

- Worker → **Domains & Routes** → gỡ 2 custom domain, rồi tạo lại các record parking đã ghi ở bước 3.
- File trong `landing/` có thể để nguyên (không ảnh hưởng subdomain khác).

## Lưu ý

- `portfolio.hassasin.com` phục vụ **cả bucket root**, nên `portfolio.hassasin.com/landing/` cũng mở được bản landing
  (trùng nội dung, không ảnh hưởng gì). Muốn chặn thì sửa worker của intro để trả 404 cho prefix `landing/`.
- Thay một clip **cùng tên file**: Cloudflare/trình duyệt có thể giữ bản cũ tới 7 ngày → **Caching → Purge** URL đó.
- HTML luôn được kiểm tra lại (`no-cache`) nên deploy mới hiện ngay, không cần purge.
