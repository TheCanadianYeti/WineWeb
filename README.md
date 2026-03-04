# WineWeb

> A personal wine cataloguing web app backed by Google Sheets, deployable on Apache.

---

## Overview

WineWeb is a fully client-side wine collection tracker built with vanilla HTML, CSS, and JavaScript. Wine data is submitted via a Google Form, stored in a Google Sheet, and fetched live by the app using PapaParse. No backend required — it runs entirely in the browser and is deployed on an Apache server.

The project was built as a personal tool to track, browse, and annotate a wine collection without relying on a third-party app.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| **HTML / CSS / JavaScript** | Frontend (no frameworks) |
| **Google Sheets + Google Forms** | Data entry and storage backend |
| **PapaParse** | CSV parsing from the published Google Sheet |
| **Apache (Ubuntu)** | Server hosting with `.htaccess` config |
| **localStorage** | Persisting personal tasting notes in-browser |

---

## How It Works

1. Wines are added to the collection by submitting a **Google Form** (linked via the "Add Bottle" button)
2. Form responses populate a **Google Sheet**, which is published as a CSV
3. On load, the app fetches and parses that CSV using **PapaParse**
4. Wine label images are pulled from **Google Drive** URLs submitted in the form
5. All filtering, sorting, and search happens client-side in JavaScript

---

## Features

**Browsing & Search**
- Full-text search across all wine fields
- Sort by vintage, type, grape, region, or rating (ascending/descending)
- Advanced filter panel — filter by wine type, region, grape variety, vintage range, minimum rating, and repurchase preference
- Grid and list view toggle

**Wine Detail Modal**
- Label image, tasting notes, food pairing, rating, and repurchase flag
- Previous/next navigation between wines (keyboard arrow key support)
- Swipe-to-close on mobile

**Personal Notes**
- Per-wine personal notes editable directly in the modal
- Notes saved to `localStorage` and persist across sessions

**Stats Bar**
- Live counts of total bottles, currently displayed bottles, and average rating

**Export**
- Export the currently filtered collection (including personal notes) as a CSV

**PWA Support**
- `manifest.json` included — installable as a standalone app on mobile

**Light / Dark Mode**
- Theme toggle with preference saved to `localStorage`

---

## Project Structure

```
WineWeb/
├── index.html          # App shell and UI markup
├── css/
│   └── style.css       # All styling with CSS custom properties + dark mode
├── js/
│   └── script.js       # All app logic — data fetching, filtering, rendering
├── images/
│   └── wineFavicon.png
├── manifest.json       # PWA manifest
├── .htaccess           # Apache config (MIME types, compression, caching, CORS)
├── deploy.sh           # Automated Apache deployment script
└── README-APACHE.md    # Detailed Apache setup guide
```

---

## Deployment

The app is designed to run on an Apache server. A `deploy.sh` script handles permissions, Apache module setup, and service restart automatically.

```bash
# Clone the repo into your web root
git clone https://github.com/TheCanadianYeti/WineWeb /var/www/wineweb
cd /var/www/wineweb

# Run the deployment script
chmod +x deploy.sh
sudo ./deploy.sh
```

For full Apache configuration details, see [README-APACHE.md](README-APACHE.md).

---

## What I Learned

- Using **Google Sheets as a lightweight data backend** without any server-side code
- Parsing and transforming live CSV data in the browser with PapaParse
- Building a fully featured UI — modals, filters, sorting, search — in **vanilla JS with no frameworks**
- Apache server configuration via `.htaccess` — MIME types, GZIP compression, browser caching, and CORS
- Writing a **shell deployment script** to automate server setup
- PWA basics with `manifest.json` for mobile installability

---

## Status

✅ **Functional and deployed** — Active personal project.

---

## Author

Built by [TheCanadianYeti](https://github.com/TheCanadianYeti)
