# WineWeb

A personal wine cataloguing web application backed by Google Sheets, deployable on Apache and Caddy.

---

## Overview

WineWeb is a client-side wine collection tracker built with vanilla HTML, CSS, and JavaScript. Wine data is submitted via a Google Form, stored in a Google Sheet, and fetched live by the client application using PapaParse. The application runs entirely in the browser and requires no custom backend infrastructure.

The project was built as a lightweight utility to track, browse, and annotate wine collections without third-party vendor lock-in.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| HTML5 / CSS3 / JavaScript | Core frontend markup, responsive styling, and dynamic logic |
| Google Sheets + Google Forms | Serverless data entry and structured storage backend |
| PapaParse | In-browser CSV parsing from the published Google Sheet |
| Caddy on TrueNAS | Current production reverse proxy and hosting environment |
| Apache (Ubuntu) | Legacy deployment target with `.htaccess` configuration |
| localStorage | In-browser persistence for user tasting notes and theme preferences |

---

## How It Works

1. Bottles are added to the collection by submitting a Google Form linked directly within the interface.
2. Form responses automatically append to a linked Google Sheet, which is published to the web as a live CSV feed.
3. On application load, PapaParse fetches and parses the remote CSV file directly in the browser.
4. Bottle label images are pulled from direct Google Drive URLs submitted through the entry form.
5. Search indexing, sorting algorithms, and multi-parameter filtering run client-side in vanilla JavaScript.

---

## Features

Browsing and Search:
- Full-text search across all wine fields including varietals, regions, and notes
- Multi-column sorting by vintage, style, grape, region, or rating
- Filter panel supporting criteria including style, region, vintage range, rating threshold, and repurchase preference
- Toggle controls for switching between grid and tabular list views

Wine Detail View:
- Modal overlay displaying label imagery, tasting notes, food pairings, ratings, and repurchase status
- Keyboard arrow navigation between records
- Touch-friendly swipe gestures for dismissing modals on mobile

Personal Notes and State Persistence:
- Per-bottle tasting notes editable directly inside the detail modal
- Local persistence using `localStorage` to retain edits across browsing sessions
- Dark mode and light mode preference toggling preserved across visits

Data and Portability:
- Live status metrics calculating total inventory, active filter subsets, and aggregate rating averages
- One-click CSV export utility to download filtered data alongside custom notes
- Progressive Web App (PWA) configuration via `manifest.json` for mobile home-screen installation

---

## Project Structure

```
WineWeb/
├── index.html          # Application markup and interface structure
├── css/
│   └── style.css       # Layout rules, CSS custom properties, and dark mode themes
├── js/
│   └── script.js       # Data ingestion, client-side filtering, and UI rendering
├── images/
│   └── wineFavicon.png # Favicon visual asset
├── manifest.json       # PWA metadata for mobile installation
├── .htaccess           # Apache configuration (MIME types, gzip compression, caching, CORS)
├── deploy.sh           # Automated deployment script for Apache targets
└── README-APACHE.md    # Reference documentation for Apache server setup
```

---

## Infrastructure and Hosting Evolution

The application was initially designed and deployed for an industry-standard Apache HTTP Server environment. Configuration files (`.htaccess`) and an automated deployment script (`deploy.sh`) handled MIME mappings, gzip compression headers, browser caching rules, and CORS permissions.

The deployment infrastructure was subsequently migrated to a self-hosted TrueNAS system running behind a Caddy reverse proxy. This architecture automates HTTPS certificate provisioning and serves the client-side assets directly from local storage pools.

---

## What I Learned

- Designing a serverless, zero-maintenance datastore using published Google Sheets and Google Forms
- Managing client-side data streaming and CSV parsing performance using PapaParse
- Implementing state management, modals, and sorting engines in pure vanilla JavaScript without framework dependencies
- Configuring enterprise web servers using Apache directives for caching, compression, and security headers
- Deploying and serving static web applications through a Caddy reverse proxy on TrueNAS storage hardware
- Implementing Progressive Web App standards to deliver installable mobile experiences

---

## Status

Live and maintained.

---

## Author

<a href="https://marcus.podnar.ca" target="_blank" rel="noopener noreferrer">Marcus Podnar</a> | <a href="https://github.com/TheCanadianYeti" target="_blank" rel="noopener noreferrer">GitHub</a> | <a href="https://www.linkedin.com/in/marcus-podnar-582187260/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
