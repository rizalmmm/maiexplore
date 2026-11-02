# Mai Explore Komodo — Company Profile Website

Website statis (HTML + CSS + sedikit JS), tanpa build step. Semua konten sudah ter-render di HTML, jadi SEO-friendly dan bisa langsung di-deploy ke Cloudflare Pages.

## Struktur

```
index.html      Home
about.html      About Us, Vision, Mission, Project       → /about
diving.html     Daily Dive Trips, About Sea, Spots, FAQ  → /diving
gallery.html    Portfolio + lightbox                     → /gallery
contact.html    Kontak + form → WhatsApp                 → /contact
lp.html         Landing page storytelling + CTA booking     → /lp
404.html        Halaman not found (otomatis dipakai Cloudflare Pages)
assets/         css, js, fonts (self-hosted), img (WebP)
robots.txt, sitemap.xml, site.webmanifest, favicon.ico, apple-touch-icon.png
_headers        Cache & security headers untuk Cloudflare Pages
```

Cloudflare Pages otomatis menyajikan `about.html` di URL `/about` (clean URL).

## Preview lokal

```
cd maiexplore-website
python3 -m http.server 8000
```
Buka http://localhost:8000. Server lokal ini tidak mendukung clean URL, jadi buka `/about.html` dan seterusnya.

## Deploy ke Cloudflare Pages

**Opsi A — Upload langsung (paling cepat)**
1. Dashboard Cloudflare → Workers & Pages → Create → Pages → *Upload assets*.
2. Upload isi folder ini (bukan folder induknya).

**Opsi B — Lewat Git (disarankan)**
1. Push folder ini ke repo GitHub/GitLab.
2. Cloudflare Pages → *Connect to Git* → pilih repo.
3. Framework preset: **None** · Build command: *(kosong)* · Build output directory: `/`

Setelah itu, tambahkan custom domain `www.maiexplorekomodo.com` di tab *Custom domains*, lalu redirect `maiexplorekomodo.com` → `www.maiexplorekomodo.com` (Bulk Redirects / Redirect Rules).

## Setelah live (SEO)

- Daftarkan situs di Google Search Console dan submit `https://www.maiexplorekomodo.com/sitemap.xml`.
- Buat/klaim Google Business Profile agar muncul di Maps.
- Uji structured data di https://search.google.com/test/rich-results

## Kalau ganti domain / kontak

Domain `https://www.maiexplorekomodo.com` tertulis di tag `canonical`/`og:` setiap halaman, di JSON-LD, `robots.txt` dan `sitemap.xml`. Nomor WhatsApp ada di link `wa.me/6281246212502` dan di `assets/js/main.js` (`WA_NUMBER`). Gunakan find & replace di seluruh folder.
