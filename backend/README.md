# Atlas Agricole — Backend API

Base URL: `https://draminesaid.com/directadmin/atlasagricol/`

## Setup

1. Upload the entire `backend/` folder contents to `draminesaid.com/directadmin/atlasagricol/`.
2. Run `migrations.sql` on the MySQL database (`dramines_directadmin`).
3. Ensure `uploads/` folder is writable (chmod 755).
4. Verify PHP has `pdo_mysql`, `fileinfo`, and outbound HTTP (`allow_url_fopen=On`) for geo lookups.

## Endpoints

### Products
- `GET  products/list.php?category=&search=&include_inactive=1`
- `GET  products/get.php?slug=xxx` or `?id=1`
- `POST products/create.php` — JSON body
- `POST products/update.php` — JSON body (must include `id`)
- `POST products/delete.php?id=1`
- `POST products/upload-image.php` — multipart `file`, optional `product_id`
- `POST products/delete-image.php` — JSON `{product_id, url}`

### Visitors
- `POST visitors/track.php` — JSON `{page_url, referrer, language, screen_size, session_id}`
- `GET  visitors/list.php?limit=200&offset=0`
- `GET  visitors/stats.php`

## Product JSON shape
```json
{
  "name": "Trebon 30 EC",
  "slug": "trebon-30-ec",
  "category": "Insecticides",
  "tone": "clay",
  "short_description": "...",
  "description": "...",
  "homologation": "AMM n° 2456",
  "main_image": "https://.../uploads/xxx.jpg",
  "images": ["https://..."],
  "usages": [{"crop":"Tomate","dose":"0.5 L/ha","target":"Noctuelles"}],
  "composition": [{"name":"Étofenprox","percentage":"30%"}],
  "benefits": ["Action rapide","Longue persistance"],
  "is_active": 1
}
```
