# Atlas Agricole — PHP / MySQL backend

Small PHP endpoint that receives the Contact form and stores it in MySQL.

## 1. Create the database

```bash
mysql -u root -p < backend/schema.sql
```

Then create the app user (see commented section at the bottom of `schema.sql`).

## 2. Deploy the endpoint

Upload `backend/contact.php` to your PHP host, e.g.:

```
/public_html/backend/contact.php
```

Set DB credentials as environment variables on the server (recommended), or
edit the defaults at the top of `contact.php`:

```
DB_HOST=localhost
DB_NAME=atlas_agricole
DB_USER=atlas_user
DB_PASS=your-strong-password
NOTIFY_EMAIL=atlasagricole@planet.tn   # optional
```

## 3. Point the frontend to it

Add to `.env` at the project root:

```
VITE_CONTACT_API_URL=https://atlasagricole.tn/backend/contact.php
```

Then rebuild the frontend. If the variable is not set, the form posts to
`/backend/contact.php` relative to the site — useful if you host the PHP file
under the same domain as the built React app.

## 4. CORS

Edit the `$allowedOrigins` array in `contact.php` to include your production
domain(s). `http://localhost:8080` is included for local development.

## Endpoint contract

`POST /backend/contact.php`

Body (JSON):

```json
{
  "name": "Ali Ben Salah",
  "company": "GDA Zaghouan",
  "email": "ali@example.tn",
  "phone": "+216 22 000 000",
  "need": "Tomate sous serre",
  "message": "Bonjour, je cherche un programme fongicide…"
}
```

Response:

- `200 { "ok": true, "id": 42 }`
- `422 { "ok": false, "error": "Validation", "fields": { ... } }`
- `500 { "ok": false, "error": "Server error" }`
