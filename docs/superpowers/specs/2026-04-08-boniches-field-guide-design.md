# Misión Boniches — Interactive Field Guide App

**Date:** 2026-04-08  
**Author:** bcobe + Claude  

---

## Context

Noelia Chaparro Puente created a rich "cuaderno de campo" (field guide) for a self-guided interpretive trail in Boniches, Cuenca. The guide covers 7 missions across ~6km of trail, teaching geology, flora/fauna identification, ethnobotany, and orienteering to families and young naturalists.

The goal is to turn this into a downloadable, offline-capable web app — similar to the existing hiking routes in this project — but with a bespoke design that honours the illustrated, educational character of Noelia's original cuaderno. A daily PIN expiry prevents casual sharing after the activity.

---

## Design Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Page type | New file `boniches.html` | Bespoke design, reuses existing infrastructure |
| Map | Hybrid: map + rich modals | GPS + full field-guide content per stop |
| Visual style | Field notebook (cream/paper) | Matches Noelia's cartoonish illustrated aesthetic |
| Expiry | Daily PIN (date-derived) | Practical for workshops, works fully offline |
| Expired screen | Branded Noelia contact screen | Professional fallback, not just a blank error |

---

## Architecture

Single self-contained file: **`boniches.html`**

Reuses from existing codebase:
- `assets/leaflet.js` + `assets/leaflet.css` — map
- `assets/gpx.js` — GPX track rendering
- `routes/boniches/route.gpx` — trail track
- `routes/boniches/pois.json` — mission data (needs updating, see below)
- `sw.js` — offline caching (add boniches.html to precache list)

New assets needed:
- `routes/boniches/images/` — Noelia's illustrations + stop photos (extracted from PDF via PyMuPDF, see below)
- `routes/boniches/audio/` — narration MP3s, one per mission (to be recorded)

---

## Visual Design

### Palette — Field Notebook

```css
--paper:        #f5ede0;   /* aged cream — page background */
--paper-card:   #fffdf5;   /* slightly lighter — modal/card bg */
--border:       #d4b896;   /* tan — card borders, dividers */
--ink:          #3a2010;   /* dark brown — primary text */
--leather:      #6b4226;   /* rich brown — mission headers */
--leather-mid:  #8b6244;   /* mid brown — labels, secondary text */
--stamp-green:  #4a7a2a;   /* forest green — "found" badges, accents */
--stamp-red:    #c0392b;   /* red — danger/warning species badges */
--highlight:    #e8d5b0;   /* warm sand — hover states, selected */
```

### Typography

- Mission titles / headers: **Fraunces** (already loaded)
- Body text: **DM Sans** (already loaded)  
- Species scientific names: *IM Fell English* italic (already loaded)
- Coordinates / codes: monospace fallback

### Layout

**Mobile (default):** Full-screen map, bottom sheet for mission list. Tap marker → modal slides up.

**Desktop (≥768px):** Left panel = Leaflet map (40% width). Right panel = scrollable mission list (60% width). Tap marker → modal overlays right panel.

Map markers: warm leather-brown pins (`#6b4226`) with mission number. Nearby marker (GPS): stamp-green with bounce.

---

## Expiry / PIN System

### How it works

1. On load, check `sessionStorage` for `bonichesUnlocked` + today's date.
2. If not unlocked: show full-screen PIN gate (Noelia's branding, 4-digit input).
3. PIN formula: `((day * 37 + month * 13 + 7) % 9000) + 1000` — always 4 digits, changes daily. Noelia can calculate it with a phone calculator.
4. On correct PIN: store `{ unlocked: true, date: "YYYY-MM-DD" }` in `sessionStorage`. Show app.
5. On wrong PIN: increment attempt counter. After 3 failures → show expired/contact screen.
6. `sessionStorage` clears on tab close → next day requires a new PIN automatically.

### PIN gate UI

- Full-screen cream paper background with Noelia's logo/branding
- Title: *"Cuaderno de Campo · Boniches"*
- Subtitle: *"Introduce el código de hoy para comenzar la aventura"*
- 4-digit input, large and finger-friendly
- Submit button styled as a mission stamp

### Expired/contact screen

Shown after 3 wrong attempts OR if we add a hard-date expiry in future:

> **Esta guía ha caducado**  
> Para organizar una nueva sesión o actividad en Boniches:  
> 📧 noelia.ch9@gmail.com  
> 🌐 www.noeliachaparro.es  
> © 2025 Noelia Chaparro Puente

---

## Mission Data Structure

The existing `routes/boniches/pois.json` has 9 entries. The cuaderno has **7 missions** plus intro/conclusion. The JSON needs reconciling to match the 7 missions exactly.

### Updated POI schema (extends existing format)

```json
{
  "id": "poi-boniches-01",
  "lat": 39.985540,
  "lon": -1.626672,
  "mission": 1,
  "images": ["routes/boniches/images/m01-salicornia.jpg"],
  "audio": "routes/boniches/audio/mision-01.mp3",
  "languages": {
    "es": {
      "name": "Misión 1 · Salicornia",
      "description": "...",
      "species": [
        {
          "common": "Salicornia, espárrago de mar",
          "scientific": "Salicornia europaea",
          "image": "routes/boniches/images/species/salicornia.png",
          "note": "Especie halófita protegida"
        }
      ],
      "challenge": "Busca una planta que encontrarías en la playa"
    }
  }
}
```

New fields vs existing format:
- `mission` — integer mission number (for ordering/display)
- `languages.*.species` — array of species cards (common, scientific, image, fun fact)
- `languages.*.challenge` — the mission challenge text shown as a callout
- `audio` — single narration track (replaces `audioTracks` array for this route)

---

## POI Modal Structure

Each mission modal has up to 4 tabs, shown only if content exists:

| Tab | Icon | Content | Which missions |
|-----|------|---------|----------------|
| **Misión** | 🧭 | Narrative intro + challenge callout | All |
| **Especies** | 🌿 | Species card grid (illustration + names + note) | 1–5 |
| **Galería** | 📷 | Photo carousel (Noelia's images) | All with photos |
| **Audio** | 🎧 | Narration player | All (once recorded) |

Mission 6 (geology) gets **Geología** tab instead of Especies, with rock type cards.  
Mission 7 (orienteering) gets a **Brújula** tab with the compass/map instructions.

---

## Image Asset Pipeline

Images are already extracted from the PDF via PyMuPDF into `extracted/`:
- `extracted/images/` — 346 embedded images (mix of illustrations, photos, icons, background texture)
- `extracted/pages/` — 27 full-page renders at 3x zoom

### Triage approach

The ~5.2MB PNGs repeating once per page (`page02_img016.png` through `page27_img*.png`, all 2387×1706) are the **background texture** — discard duplicates, keep one as `assets/images/boniches-paper-bg.png` if needed.

Real content images by approximate size:
- **>1MB** — full-page illustrations or large photos → POI gallery images
- **200KB–1MB** — species illustrations, diagrams → species card images  
- **<200KB** — icons, small decorative elements → UI assets or discard

Final organized structure:
```
routes/boniches/images/
  m01-overview.jpg        ← mission header photo
  m01-salicornia.jpg      ← POI gallery
  species/
    salicornia-europaea.png
    juncus-maritimus.png
    ... (one per species)
routes/boniches/audio/
  mision-01.mp3           ← narration (to be recorded)
  ...
```

---

## Service Worker

Add to `sw.js` precache list:
- `boniches.html`
- `routes/boniches/pois.json`
- `routes/boniches/route.gpx`
- `routes/boniches/images/*` (all mission images)
- `routes/boniches/audio/*` (all narration files)

---

## Index Page

Add Boniches to `index.html` route carousel with:
- Route card thumbnail (banner image from PDF extraction)
- Stats: ~6km, difficulty medium, 7 misiones
- Language: ES primary (EN optional later)
- Link: `boniches.html` (not `trail.html?route=boniches`)

---

## What You Need To Do Before Build

| Asset | Status | Action |
|-------|--------|--------|
| GPX track | ✅ exists | Nothing |
| POI text content | ✅ exists (needs 9→7 reconcile) | Update pois.json |
| Illustrations | ✅ extracted to `extracted/images/` | Triage + rename + move to `routes/boniches/images/` |
| Stop photos | ✅ in extracted (or from Wikiloc) | Same as above |
| Narration audio | ❌ not recorded | Write scripts, record 7 MP3s |
| Background texture | ✅ extracted | Keep one copy, discard 25 duplicates |

---

## Verification

1. Open `boniches.html` in browser — PIN gate appears
2. Calculate today's PIN: `((day * 37 + month * 13 + 7) % 9000) + 1000`
3. Enter PIN → app unlocks, map loads with Boniches route
4. Tap a mission marker → modal opens with Misión + Especies tabs
5. GPS tracking works (test on device)
6. Close tab, reopen → PIN gate appears again (sessionStorage cleared)
7. Enter wrong PIN 3× → branded expired screen appears
8. Offline: download tiles via offline button, disable network → app fully functional
9. Add to home screen (PWA) → works as installed app
