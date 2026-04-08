# Misión Boniches Field Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `boniches.html` — a standalone offline-capable interactive field guide with a cream/paper visual style, daily PIN expiry, Leaflet map, and rich mission modals (species cards, gallery, audio).

**Architecture:** Single self-contained HTML file reusing existing Leaflet/GPX infrastructure but with a completely new visual skin. Mission data lives in `routes/boniches/pois.json` (extended schema). PIN gate uses date-derived code stored in `sessionStorage`.

**Tech Stack:** Vanilla HTML/CSS/JS, Leaflet.js (existing), Leaflet-GPX (existing), HTML5 Audio, sessionStorage, Service Worker (existing sw.js)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `boniches.html` | **Create** | Complete field guide app — PIN gate, map, mission modals |
| `routes/boniches/pois.json` | **Modify** | Reconcile 9→7 missions, add species/challenge fields |
| `CLAUDE.md` | **Create** | Project context + PIN formula for quick lookup |
| `sw.js` | **Modify** | Add boniches.html to PRECACHE list |
| `index.html` | **Modify** | Add Boniches card to route carousel (links to boniches.html) |

---

## Task 1: PIN formula in CLAUDE.md

Store the PIN formula where it's instantly accessible in any session.

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md with PIN formula**

Create `/home/bcobe/code/ruta-interactiva/CLAUDE.md` with this exact content:

```markdown
# Ruta Interactiva — Project Notes

## Boniches Daily PIN

Formula: `((day * 37 + month * 13 + 7) % 9000) + 1000`

Where `day` = day of month (1–31), `month` = month number (1–12).

Example — April 15: `((15 * 37 + 4 * 13 + 7) % 9000) + 1000` = `((555 + 52 + 7) % 9000) + 1000` = `614 + 1000` = **1614**

To get today's PIN: multiply day by 37, add month×13, add 7, take mod 9000, add 1000.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add CLAUDE.md with Boniches daily PIN formula"
```

---

## Task 2: Update pois.json to 7-mission schema

Reconcile the existing 9 POIs to match the 7 cuaderno missions, and add the extended fields.

**Files:**
- Modify: `routes/boniches/pois.json`

- [ ] **Step 1: Replace pois.json with 7-mission data**

Write `routes/boniches/pois.json` with this content (coordinates from existing file, content from cuaderno):

```json
[
  {
    "id": "poi-boniches-01",
    "lat": 39.985540,
    "lon": -1.626672,
    "mission": 1,
    "images": [],
    "audio": null,
    "languages": {
      "es": {
        "name": "Misión 1 · Salicornia",
        "description": "Bienvenidos al Reajo o Arroyo Valhondo. Este no es un lugar cualquiera; es un refugio natural que esconde especies únicas, algunas de ellas tan importantes que están protegidas. El arroyo arrastra algo inusual para una meseta interior: sal. Hace millones de años, Boniches era parte de un inmenso mar. Con el tiempo, este mar se fue retirando y dejó depósitos de sal en los huecos de las montañas. Los manantiales disuelven esos minerales y crean un miniecosistema salino a cientos de kilómetros del mar.",
        "challenge": "Busca una planta que encontrarías en la playa",
        "species": [
          {
            "common": "Salicornia, espárrago de mar",
            "scientific": "Salicornia europaea",
            "image": null,
            "note": "Especie halófita protegida. Sus tallos suculentos se vuelven rojos en otoño y son comestibles."
          },
          {
            "common": "Junco marino",
            "scientific": "Juncus maritimus",
            "image": null,
            "note": "Compañero inseparable de la Salicornia. Si encuentras uno, el otro no está lejos."
          },
          {
            "common": "Ánade azulón",
            "scientific": "Anas platyrhynchos",
            "image": null,
            "note": "El macho tiene la cabeza verde brillante. Busca su espejuelo azul violáceo en las alas."
          },
          {
            "common": "Sapo corredor",
            "scientific": "Epidalea calamita",
            "image": null,
            "note": "No escupe a los ojos. Lávate las manos después de tocarlo, nada más."
          },
          {
            "common": "Rana común",
            "scientific": "Pelophylax perezi",
            "image": null,
            "note": "Indicadora de agua limpia y ecosistemas acuáticos saludables."
          }
        ]
      }
    }
  },
  {
    "id": "poi-boniches-02",
    "lat": 39.985119,
    "lon": -1.628655,
    "mission": 2,
    "images": [],
    "audio": null,
    "languages": {
      "es": {
        "name": "Misión 2 · Detectives del Camino",
        "description": "Esta misión consiste en recorrer con calma el camino hacia la playa fluvial y fijarse bien en las plantas a ambos lados. El camino divide claramente dos tipos de suelo: a la izquierda suelo seco y ácido con areniscas y rocas silíceas; a la derecha suelo más fresco y húmedo. Dos comunidades vegetales completamente diferentes separadas por apenas unos metros. Esta frontera —llamada ecotono— es una de las zonas más ricas para la biodiversidad.",
        "challenge": "Encuentra 5 especies a cada lado del camino antes de seguir",
        "species": [
          {
            "common": "Pino salgareño, Laricio",
            "scientific": "Pinus nigra sp salzmannii",
            "image": null,
            "note": "Corteza más oscura y grisácea que el pino resinero. Piñas más pequeñas."
          },
          {
            "common": "Pino resinero, rodeno",
            "scientific": "Pinus pinaster",
            "image": null,
            "note": "Corteza rojiza. Piñas más grandes y acículas más largas que el pino negral."
          },
          {
            "common": "Jara pringosa",
            "scientific": "Cistus ladanifer",
            "image": null,
            "note": "Flores grandes y blancas con mancha oscura en la base. Tronco liso y resinoso."
          },
          {
            "common": "Jara de estepa",
            "scientific": "Cistus laurifolius",
            "image": null,
            "note": "Hojas más grandes y elípticas, verde oscuro por el haz y blanquecino por el envés."
          },
          {
            "common": "Enebro común",
            "scientific": "Juniperus communis",
            "image": null,
            "note": "Arbusto resistente a la sequía con frutos azulados usados en ginebra."
          },
          {
            "common": "Cantueso",
            "scientific": "Lavandula stoechas",
            "image": null,
            "note": "Florece en invierno y principios de primavera. Muy visitado por abejorros."
          },
          {
            "common": "Tejo",
            "scientific": "Taxus baccata",
            "image": null,
            "note": "Árbol sagrado para los celtas. Casi todas sus partes son venenosas excepto la carne del fruto."
          }
        ]
      }
    }
  },
  {
    "id": "poi-boniches-03",
    "lat": 39.984639,
    "lon": -1.629790,
    "mission": 3,
    "images": [],
    "audio": null,
    "languages": {
      "es": {
        "name": "Misión 3 · La Fuente Milagrosa",
        "description": "Vuestra siguiente misión os lleva a la Fuente del Canal, un lugar lleno de historia y magia. Esta fuente nunca ha llegado a secarse, ni siquiera en las sequías más severas. La tradición local le atribuía propiedades curativas. Con esta agua salina, las mujeres del pueblo elaboraban pan, maceraban aceitunas, ciruelas y otros frutos. El bosque galería que la rodea —chopos, sauces, fresnos— depende por completo de este caudal constante. Fíjate en el agua: ¿qué color tiene? ¿deja sedimento en las piedras? ¿cómo huele?",
        "challenge": "¿Puedes identificar la especie que da frutos muy sabrosos entre las plantas de este lugar?",
        "species": [
          {
            "common": "Nogal, noguera",
            "scientific": "Juglans regia",
            "image": null,
            "note": "Da frutos muy sabrosos. Busca entre las hojas más grandes."
          },
          {
            "common": "Gran pavón nocturno",
            "scientific": "Saturnia pyri",
            "image": null,
            "note": "El insecto más grande de Europa. Sus ocelos imitan ojos de búho para asustar depredadores."
          },
          {
            "common": "Fresno",
            "scientific": "Fraxinus angustifolia",
            "image": null,
            "note": "Árbol sagrado en culturas celtas y nórdicas. Las brujas usaban sus ramas para fabricar escobas."
          },
          {
            "common": "Martín pescador",
            "scientific": "Alcedo atthis",
            "image": null,
            "note": "Plumaje azul metálico y naranja. Indicador de ríos limpios. Bucea hasta 10 metros."
          }
        ]
      }
    }
  },
  {
    "id": "poi-boniches-04",
    "lat": 39.981490,
    "lon": -1.633360,
    "mission": 4,
    "images": [],
    "audio": null,
    "languages": {
      "es": {
        "name": "Misión 4 · Exploradores de la Playa Fluvial",
        "description": "En esta parada exploramos las plantas de ribera y buscamos a los animales que comparten este entorno. Observa bien el barro blando cerca del agua: las huellas de la nutria tienen cinco dedos con membrana; las de la garza muestran tres largos dedos; el visón americano —especie invasora— desplaza al visón europeo. Mientras caminas, la botánica se convierte en una farmacia: el tomillo y el romero como antisépticos, el esparto para cestas y cuerdas, el saúco para jarabe contra la tos. Estas abuelas eran las científicas de su época.",
        "challenge": "¿Cuántas huellas distintas puedes identificar en el barro cerca del agua?",
        "species": [
          {
            "common": "Nutria",
            "scientific": "Lutra lutra",
            "image": null,
            "note": "Cinco dedos con membrana. Ha vuelto al río gracias a la mejora de la calidad del agua."
          },
          {
            "common": "Garza real",
            "scientific": "Ardea cinerea",
            "image": null,
            "note": "Hasta 1m de altura, envergadura >2m. Al volar retrae el cuello en forma de S."
          },
          {
            "common": "Visón americano",
            "scientific": "Neovison vison",
            "image": null,
            "note": "Especie exótica invasora. Desplaza al visón europeo y afecta el equilibrio del ecosistema."
          },
          {
            "common": "Abejaruco",
            "scientific": "Merops apiaster",
            "image": null,
            "note": "Plumaje multicolor espectacular. Se puede ver cazando sobre el matorral al atardecer."
          },
          {
            "common": "Encina, carrasca",
            "scientific": "Quercus ilex sp ballota",
            "image": null,
            "note": "Perenne, hojas pequeñas y punzantes. Sus cenizas se usaban para hacer jabón y lejía."
          }
        ]
      }
    }
  },
  {
    "id": "poi-boniches-05",
    "lat": 39.980792,
    "lon": -1.633914,
    "mission": 5,
    "images": [],
    "audio": null,
    "languages": {
      "es": {
        "name": "Misión 5 · El Enigma de las Serpientes",
        "description": "En esta aventura os convertiréis en auténticos herpetólogos. La regla clave: cabeza triangular + pupilas verticales + escamas carenadas = víbora. Cabeza ovalada + pupilas redondas = culebra. En Boniches la única víbora es la Víbora hocicuda (Vipera latastei), reconocible por su hocico ligeramente elevado y patrón zigzagueante. Es una pieza clave del ecosistema: controla poblaciones de roedores. Ninguna serpiente se acercará a ti si te mueves sin gestos bruscos. Si te cruzas con una, espera con calma a que se aleje.",
        "challenge": "¿Es víbora o culebra? Cabeza triangular + zigzag = aléjate con calma",
        "species": [
          {
            "common": "Víbora hocicuda",
            "scientific": "Vipera latastei",
            "image": null,
            "note": "La única víbora de Boniches. Hocico elevado, cuerpo compacto, patrón zigzagueante. Venenosa pero tranquila."
          },
          {
            "common": "Culebra bastarda",
            "scientific": "Malpolon monspessulanus",
            "image": null,
            "note": "Grande, rápida, pardo olivácea. Inofensiva para humanos. Su veneno sólo afecta a lagartijas."
          },
          {
            "common": "Culebra viperina",
            "scientific": "Natrix maura",
            "image": null,
            "note": "Imita a la víbora aplanando la cabeza y bufando, pero no cuela. Completamente inofensiva."
          },
          {
            "common": "Culebra de herradura",
            "scientific": "Hemorrhois hippocrepis",
            "image": null,
            "note": "Patrón de manchas en herradura en el dorso. Rápida y asustadiza."
          }
        ]
      }
    }
  },
  {
    "id": "poi-boniches-06",
    "lat": 39.976433,
    "lon": -1.630722,
    "mission": 6,
    "images": [],
    "audio": null,
    "languages": {
      "es": {
        "name": "Misión 6 · El Código de las Rocas",
        "description": "Hace más de 240 millones de años, Boniches era parte de Pangea. España estaba casi en el ecuador, y los ríos tropicales traían sedimentos que se acumulaban en valles alargados. Cuando los ríos eran caudalosos y rápidos transportaban piedras grandes: conglomerados. Al perder fuerza sólo podían mover granos de arena: areniscas. El hierro oxidado les dio su color rojizo. Mirad a vuestro alrededor: al norte la Tabarreña, junto a la Peña del Cuervo. Al este la Peña de los Ramos. Al oeste la Cabeza del Carrascal. Cada risco cuenta una historia de millones de años.",
        "challenge": "¿Puedes distinguir el conglomerado de la arenisca? Busca el moteado blanco en los cantos.",
        "geology": [
          {
            "name": "Conglomerado triásico",
            "age": "Triásico (~240 Ma)",
            "note": "Formado por ríos muy caudalosos. Las piedras grandes quedan cementadas entre sí. Busca el moteado blanco en los puntos de contacto."
          },
          {
            "name": "Arenisca roja (Tabarreña)",
            "age": "Triásico (~230 Ma)",
            "note": "Formada cuando los ríos perdieron fuerza. El hierro oxidado le da el color rojizo característico."
          },
          {
            "name": "Rocas silúricas",
            "age": "Silúrico (~420 Ma)",
            "note": "Las rocas más antiguas de Boniches. Visibles en Las Trincheras de La Retuerta."
          }
        ]
      }
    }
  },
  {
    "id": "poi-boniches-07",
    "lat": 39.974000,
    "lon": -1.628000,
    "mission": 7,
    "images": [],
    "audio": null,
    "languages": {
      "es": {
        "name": "Misión 7 · Orientación y Navegación",
        "description": "Última misión: aprender a orientarse con brújula y mapa. Coloca la brújula en una superficie plana y espera a que la aguja se estabilice apuntando al norte. Gira el mapa hasta que su norte coincida con el norte de la brújula. Ahora busca referencias en el paisaje —montañas, el río, el pueblo— y compáralas con el mapa para ubicar tu posición. Sin batería, sin señal: la brújula siempre funciona.",
        "challenge": "Identifica tres puntos del paisaje (un risco, el río, el pueblo) y encuéntralos en el mapa",
        "compass": {
          "steps": [
            "Coloca la brújula en una superficie plana, lejos de metales.",
            "Espera a que la aguja roja se estabilice — apunta al norte magnético.",
            "Gira el mapa hasta que su parte superior quede alineada con la aguja.",
            "Busca referencias en el paisaje y compáralas con el mapa.",
            "Ubica tu posición usando al menos dos referencias cruzadas."
          ],
          "landmarks": [
            "La Tabarreña — al norte",
            "Peña del Cuervo — norte, vigila Boniches",
            "Peña de los Ramos — al este",
            "Cabeza del Carrascal — al oeste"
          ]
        }
      }
    }
  }
]
```

- [ ] **Step 2: Commit**

```bash
git add routes/boniches/pois.json
git commit -m "data: reconcile boniches pois to 7-mission schema with species/geology fields"
```

---

## Task 3: PIN gate + shell of boniches.html

Build the full-screen PIN gate first — this is the first thing users see and tests the expiry logic.

**Files:**
- Create: `boniches.html` (PIN gate section only, rest stubbed)

- [ ] **Step 1: Create boniches.html with PIN gate**

Create `/home/bcobe/code/ruta-interactiva/boniches.html`:

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <meta name="theme-color" content="#f5ede0">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <title>Misión Boniches</title>
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="manifest" href="manifest.json">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=IM+Fell+English:ital@0;1&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/leaflet.css">

  <style>
    :root {
      --paper:       #f5ede0;
      --paper-card:  #fffdf5;
      --border:      #d4b896;
      --ink:         #3a2010;
      --leather:     #6b4226;
      --leather-mid: #8b6244;
      --stamp-green: #4a7a2a;
      --stamp-red:   #c0392b;
      --highlight:   #e8d5b0;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', -apple-system, sans-serif;
      background: var(--paper);
      color: var(--ink);
      min-height: 100dvh;
    }

    /* ── PIN Gate ─────────────────────────────────────────────── */
    #pin-gate {
      position: fixed; inset: 0; z-index: 9000;
      background: var(--paper);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='90'%3E%3Cellipse cx='60' cy='45' rx='57' ry='42' fill='none' stroke='rgba(107,66,38,0.06)' stroke-width='1'/%3E%3Cellipse cx='60' cy='45' rx='40' ry='28' fill='none' stroke='rgba(107,66,38,0.05)' stroke-width='1'/%3E%3Cellipse cx='60' cy='45' rx='23' ry='16' fill='none' stroke='rgba(107,66,38,0.04)' stroke-width='1'/%3E%3C/svg%3E");
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 2rem;
      gap: 1.5rem;
    }

    #pin-gate.hidden { display: none; }

    .pin-logo {
      font-family: 'Fraunces', serif;
      font-size: clamp(1.6rem, 5vw, 2.2rem);
      font-weight: 700;
      color: var(--leather);
      text-align: center;
      line-height: 1.2;
    }

    .pin-logo span {
      display: block;
      font-size: 0.55em;
      font-weight: 400;
      color: var(--leather-mid);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-top: 0.3rem;
    }

    .pin-subtitle {
      font-size: 0.95rem;
      color: var(--leather-mid);
      text-align: center;
      max-width: 280px;
      line-height: 1.5;
    }

    .pin-input-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    #pin-input {
      font-family: 'Fraunces', serif;
      font-size: 2rem;
      font-weight: 600;
      color: var(--leather);
      background: var(--paper-card);
      border: 2px solid var(--border);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      width: 140px;
      text-align: center;
      letter-spacing: 0.3em;
      outline: none;
      transition: border-color 0.2s;
      -webkit-appearance: none;
    }

    #pin-input:focus { border-color: var(--leather); }
    #pin-input.error { border-color: var(--stamp-red); animation: shake 0.3s; }

    @keyframes shake {
      0%,100% { transform: translateX(0); }
      25% { transform: translateX(-6px); }
      75% { transform: translateX(6px); }
    }

    #pin-submit {
      font-family: 'DM Sans', sans-serif;
      font-size: 1rem;
      font-weight: 600;
      color: var(--paper-card);
      background: var(--leather);
      border: none;
      border-radius: 8px;
      padding: 0.65rem 1.4rem;
      cursor: pointer;
      transition: background 0.15s, transform 0.1s;
    }

    #pin-submit:active { transform: scale(0.96); }
    #pin-submit:hover { background: var(--ink); }

    #pin-error {
      font-size: 0.85rem;
      color: var(--stamp-red);
      text-align: center;
      min-height: 1.2rem;
    }

    /* ── Expired Screen ───────────────────────────────────────── */
    #expired-screen {
      position: fixed; inset: 0; z-index: 9000;
      background: var(--paper);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      padding: 2rem;
      gap: 1.2rem;
      text-align: center;
    }

    #expired-screen.hidden { display: none; }

    .expired-title {
      font-family: 'Fraunces', serif;
      font-size: clamp(1.4rem, 4vw, 1.8rem);
      font-weight: 700;
      color: var(--leather);
    }

    .expired-body {
      font-size: 0.95rem;
      color: var(--leather-mid);
      max-width: 300px;
      line-height: 1.6;
    }

    .expired-contact {
      background: var(--paper-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 1rem 1.5rem;
      font-size: 0.9rem;
      color: var(--ink);
      line-height: 1.8;
    }

    .expired-contact a { color: var(--leather); text-decoration: none; }

    .expired-copy {
      font-size: 0.75rem;
      color: var(--leather-mid);
      margin-top: 0.5rem;
    }

    /* ── App (hidden until unlocked) ──────────────────────────── */
    #app {
      display: none;
      flex-direction: column;
      height: 100dvh;
    }

    #app.visible { display: flex; }
  </style>
</head>
<body>

<!-- ── PIN Gate ──────────────────────────────────────────────────────────── -->
<div id="pin-gate">
  <div class="pin-logo">
    Cuaderno de Campo
    <span>Misión Boniches · Cuenca</span>
  </div>
  <p class="pin-subtitle">Introduce el código de hoy para comenzar la aventura</p>
  <div class="pin-input-row">
    <input id="pin-input" type="number" inputmode="numeric" maxlength="4"
           placeholder="····" autocomplete="off" aria-label="Código PIN">
    <button id="pin-submit">→</button>
  </div>
  <p id="pin-error"></p>
</div>

<!-- ── Expired Screen ────────────────────────────────────────────────────── -->
<div id="expired-screen" class="hidden">
  <div class="expired-title">Esta guía ha caducado</div>
  <p class="expired-body">Para organizar una nueva sesión o actividad en Boniches:</p>
  <div class="expired-contact">
    📧 <a href="mailto:noelia.ch9@gmail.com">noelia.ch9@gmail.com</a><br>
    🌐 <a href="https://www.noeliachaparro.es">www.noeliachaparro.es</a>
  </div>
  <p class="expired-copy">© 2025 Noelia Chaparro Puente — Guía de la Naturaleza y Educadora Ambiental</p>
</div>

<!-- ── App ───────────────────────────────────────────────────────────────── -->
<div id="app">
  <p style="padding:2rem;font-family:sans-serif;color:#6b4226">Mapa cargando… (próxima tarea)</p>
</div>

<script>
'use strict';

// ── PIN logic ──────────────────────────────────────────────────────────────
function todayPin() {
  const now = new Date();
  const d = now.getDate();
  const m = now.getMonth() + 1;
  return ((d * 37 + m * 13 + 7) % 9000) + 1000;
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
}

function checkSession() {
  try {
    const stored = JSON.parse(sessionStorage.getItem('bonichesUnlocked') || 'null');
    return stored && stored.date === todayKey();
  } catch (_) { return false; }
}

function unlockApp() {
  sessionStorage.setItem('bonichesUnlocked', JSON.stringify({ date: todayKey() }));
  document.getElementById('pin-gate').classList.add('hidden');
  document.getElementById('app').classList.add('visible');
}

function showExpired() {
  document.getElementById('pin-gate').classList.add('hidden');
  document.getElementById('expired-screen').classList.remove('hidden');
}

// ── Init ───────────────────────────────────────────────────────────────────
(function init() {
  if (checkSession()) { unlockApp(); return; }

  let attempts = 0;

  const input = document.getElementById('pin-input');
  const errEl = document.getElementById('pin-error');

  function tryPin() {
    const entered = parseInt(input.value, 10);
    if (entered === todayPin()) {
      unlockApp();
      return;
    }
    attempts++;
    input.value = '';
    input.classList.add('error');
    setTimeout(() => input.classList.remove('error'), 400);

    if (attempts >= 3) {
      showExpired();
    } else {
      errEl.textContent = `Código incorrecto (${3 - attempts} intento${3 - attempts === 1 ? '' : 's'} restante${3 - attempts === 1 ? '' : 's'})`;
    }
  }

  document.getElementById('pin-submit').addEventListener('click', tryPin);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryPin(); });
  input.addEventListener('input', () => {
    if (input.value.length > 4) input.value = input.value.slice(0, 4);
  });

  input.focus();
})();
</script>

</body>
</html>
```

- [ ] **Step 2: Open in browser and test PIN gate**

Open `boniches.html` in the browser. You should see the cream PIN gate screen.

Calculate today's PIN: `((day * 37 + month * 13 + 7) % 9000) + 1000`  
For April 8: `((8 * 37 + 4 * 13 + 7) % 9000) + 1000` = `((296 + 52 + 7) % 9000) + 1000` = `355 + 1000` = **1355**

Enter the correct PIN → should show "Mapa cargando…" stub.  
Enter a wrong PIN 3× → should show the branded expired screen.  
Close tab, reopen → PIN gate appears again.

- [ ] **Step 3: Commit**

```bash
git add boniches.html
git commit -m "feat: boniches PIN gate with daily code, branded expired screen"
```

---

## Task 4: Map + GPX track + mission markers

Add the Leaflet map, GPX route rendering, and numbered mission markers.

**Files:**
- Modify: `boniches.html` — replace stub `#app` content with real map HTML + JS

- [ ] **Step 1: Replace `#app` inner content with map layout**

Replace the stub `<p>` inside `<div id="app">` with:

```html
<!-- ── Top Bar ────────────────────────────────────────────────────────────── -->
<div id="topbar">
  <a href="index.html" id="back-btn" aria-label="Volver">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </a>
  <div id="route-title">Misión Boniches</div>
  <div id="topbar-right">
    <button id="gps-btn" aria-label="GPS">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</div>

<!-- ── Map ───────────────────────────────────────────────────────────────── -->
<div id="map"></div>

<!-- ── Mission Panel (mobile: bottom sheet; desktop: right panel) ───────── -->
<div id="mission-panel">
  <div id="mission-list"></div>
</div>

<!-- ── Mission Modal ─────────────────────────────────────────────────────── -->
<div id="modal-overlay" class="hidden"></div>
<div id="modal" class="hidden">
  <button id="modal-close" aria-label="Cerrar">✕</button>
  <div id="modal-tabs"></div>
  <div id="modal-content"></div>
</div>
```

- [ ] **Step 2: Add map CSS inside the `<style>` block**

Add after the `#app.visible` rule:

```css
/* ── Top Bar ──────────────────────────────────────────────── */
#topbar {
  display: flex; align-items: center;
  padding: 0 14px; height: 52px;
  background: var(--paper-card);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0; gap: 10px; z-index: 1000;
}

#back-btn {
  width: 32px; height: 32px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--paper);
  color: var(--leather-mid);
  cursor: pointer; display: flex;
  align-items: center; justify-content: center;
  text-decoration: none; flex-shrink: 0;
}

#route-title {
  flex: 1;
  font-family: 'Fraunces', serif;
  font-size: 1.05rem; font-weight: 600;
  color: var(--leather);
}

#topbar-right { display: flex; gap: 8px; }

#gps-btn {
  width: 32px; height: 32px;
  border-radius: 7px;
  border: 1px solid var(--border);
  background: var(--paper);
  color: var(--leather-mid);
  cursor: pointer; display: flex;
  align-items: center; justify-content: center;
}

#gps-btn.active { background: var(--stamp-green); color: #fff; border-color: var(--stamp-green); }

/* ── Map / Panel Layout ───────────────────────────────────── */
#map {
  flex: 1;
  z-index: 1;
}

#mission-panel {
  background: var(--paper-card);
  border-top: 1px solid var(--border);
  overflow-y: auto;
  flex-shrink: 0;
  height: 180px;
}

@media (min-width: 768px) {
  #app.visible {
    flex-direction: row;
    flex-wrap: wrap;
  }
  #topbar { width: 100%; }
  #map { flex: 0 0 40%; height: calc(100dvh - 52px); }
  #mission-panel {
    flex: 0 0 60%;
    height: calc(100dvh - 52px);
    border-top: none;
    border-left: 1px solid var(--border);
  }
}

/* ── Mission List ─────────────────────────────────────────── */
#mission-list { padding: 0.75rem; display: flex; gap: 0.5rem; overflow-x: auto; }

@media (min-width: 768px) {
  #mission-list { flex-direction: column; overflow-x: hidden; padding: 1rem; }
}

.mission-item {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
  min-width: 160px;
}

@media (min-width: 768px) { .mission-item { min-width: unset; } }

.mission-item:hover { background: var(--highlight); border-color: var(--leather-mid); }

.mission-item.active { background: var(--highlight); border-color: var(--leather); }

.mission-item-num {
  font-size: 0.65rem; font-weight: 600;
  color: var(--leather-mid);
  text-transform: uppercase; letter-spacing: 0.08em;
}

.mission-item-name {
  font-family: 'Fraunces', serif;
  font-size: 0.9rem; color: var(--leather);
  margin-top: 0.1rem;
}

/* ── Modal ────────────────────────────────────────────────── */
#modal-overlay {
  position: fixed; inset: 0; z-index: 2000;
  background: rgba(58, 32, 16, 0.4);
  backdrop-filter: blur(2px);
}

#modal {
  position: fixed; z-index: 2001;
  background: var(--paper-card);
  border: 1px solid var(--border);
  border-radius: 14px 14px 0 0;
  bottom: 0; left: 0; right: 0;
  max-height: 82dvh;
  overflow-y: auto;
  padding: 1.25rem 1.25rem 2rem;
  box-shadow: 0 -4px 24px rgba(58,32,16,0.18);
}

@media (min-width: 768px) {
  #modal {
    left: 40%; right: 0;
    border-radius: 0;
    max-height: calc(100dvh - 52px);
    bottom: 0; top: 52px;
    border-left: 2px solid var(--leather);
    box-shadow: none;
  }
}

#modal-overlay.hidden, #modal.hidden { display: none; }

#modal-close {
  position: absolute; top: 1rem; right: 1rem;
  width: 28px; height: 28px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: var(--paper);
  color: var(--leather-mid);
  cursor: pointer; font-size: 0.8rem;
  display: flex; align-items: center; justify-content: center;
}

/* ── Modal Tabs ───────────────────────────────────────────── */
#modal-tabs {
  display: flex; gap: 0.4rem;
  margin-bottom: 1rem; flex-wrap: wrap;
  padding-top: 0.2rem;
}

.tab-btn {
  font-size: 0.78rem; font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  border: 1px solid var(--border);
  background: var(--paper);
  color: var(--leather-mid);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.tab-btn.active {
  background: var(--leather);
  color: var(--paper-card);
  border-color: var(--leather);
}

/* ── Modal Content sections ───────────────────────────────── */
.modal-mission-name {
  font-family: 'Fraunces', serif;
  font-size: 1.3rem; font-weight: 700;
  color: var(--leather);
  margin-bottom: 0.75rem;
  padding-right: 2rem;
}

.modal-description {
  font-size: 0.9rem; color: var(--ink);
  line-height: 1.7; margin-bottom: 1rem;
}

.mission-challenge {
  background: var(--highlight);
  border-left: 3px solid var(--leather);
  border-radius: 0 8px 8px 0;
  padding: 0.7rem 1rem;
  font-size: 0.85rem; color: var(--leather);
  font-weight: 600; margin-bottom: 1rem;
}

/* ── Species Grid ─────────────────────────────────────────── */
.species-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.species-card {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
}

.species-card img {
  width: 100%; aspect-ratio: 1;
  object-fit: contain;
  border-radius: 4px;
  margin-bottom: 0.4rem;
  background: var(--highlight);
}

.species-img-placeholder {
  width: 100%; aspect-ratio: 1;
  background: var(--highlight);
  border-radius: 4px;
  margin-bottom: 0.4rem;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.8rem;
}

.species-common {
  font-size: 0.8rem; font-weight: 600;
  color: var(--leather); line-height: 1.3;
}

.species-scientific {
  font-family: 'IM Fell English', serif;
  font-style: italic;
  font-size: 0.72rem; color: var(--leather-mid);
  margin: 0.15rem 0;
}

.species-note {
  font-size: 0.72rem; color: var(--ink);
  line-height: 1.4; margin-top: 0.2rem;
}

/* ── Geology Cards ────────────────────────────────────────── */
.geology-list { display: flex; flex-direction: column; gap: 0.75rem; }

.geology-card {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 8px; padding: 0.75rem 1rem;
}

.geology-name {
  font-family: 'Fraunces', serif;
  font-size: 0.95rem; font-weight: 600; color: var(--leather);
}

.geology-age {
  font-size: 0.72rem; color: var(--leather-mid);
  margin: 0.1rem 0 0.4rem;
  font-weight: 600; letter-spacing: 0.04em;
}

.geology-note { font-size: 0.82rem; color: var(--ink); line-height: 1.5; }

/* ── Compass Tab ──────────────────────────────────────────── */
.compass-steps {
  list-style: none; display: flex; flex-direction: column; gap: 0.6rem;
  counter-reset: step;
}

.compass-steps li {
  counter-increment: step;
  display: flex; gap: 0.75rem; align-items: flex-start;
  font-size: 0.88rem; color: var(--ink); line-height: 1.5;
}

.compass-steps li::before {
  content: counter(step);
  background: var(--leather);
  color: var(--paper-card);
  width: 22px; height: 22px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem; font-weight: 700;
  flex-shrink: 0; margin-top: 1px;
}

.landmark-list {
  display: flex; flex-direction: column; gap: 0.4rem;
  margin-top: 1rem;
}

.landmark-item {
  font-size: 0.85rem; color: var(--ink);
  padding: 0.4rem 0.7rem;
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 6px;
}

/* ── Gallery ──────────────────────────────────────────────── */
.gallery-wrap { display: flex; flex-direction: column; gap: 0.75rem; }

.gallery-img {
  width: 100%; border-radius: 8px;
  border: 1px solid var(--border);
  object-fit: cover;
}

/* ── Audio Player ─────────────────────────────────────────── */
.audio-player {
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 10px; padding: 1rem;
  display: flex; flex-direction: column; gap: 0.6rem;
}

.audio-label {
  font-family: 'Fraunces', serif;
  font-size: 0.9rem; color: var(--leather); font-weight: 600;
}

.audio-controls { display: flex; align-items: center; gap: 0.75rem; }

.audio-play-btn {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--leather);
  border: none; color: var(--paper-card);
  font-size: 1rem; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.audio-progress {
  flex: 1; height: 4px;
  background: var(--border);
  border-radius: 2px; cursor: pointer;
  position: relative;
}

.audio-progress-fill {
  height: 100%; background: var(--leather);
  border-radius: 2px; width: 0%;
  transition: width 0.1s linear;
}

.audio-time {
  font-size: 0.75rem; color: var(--leather-mid);
  font-variant-numeric: tabular-nums;
  min-width: 36px; text-align: right;
}
```

- [ ] **Step 3: Add Leaflet scripts and map JS after the PIN `<script>` block**

Add before `</body>`:

```html
<script src="assets/leaflet.js"></script>
<script src="assets/gpx.js"></script>
<script>
'use strict';

// Only run after PIN unlocks the app
document.addEventListener('appUnlocked', initApp);

// Fired by PIN logic when unlockApp() is called
function initApp() {
  // ── Load POIs ────────────────────────────────────────────────────────────
  fetch('routes/boniches/pois.json')
    .then(r => r.json())
    .then(pois => {
      setupMap(pois);
      setupMissionList(pois);
    });
}

let map, userMarker;

function setupMap(pois) {
  map = L.map('map', { zoomControl: false, attributionControl: true });

  L.tileLayer('https://tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '© OpenTopoMap contributors'
  }).addTo(map);

  // GPX track
  new L.GPX('routes/boniches/route.gpx', {
    async: true,
    polyline_options: { color: '#6b4226', weight: 3, opacity: 0.85 },
    marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null }
  }).on('loaded', e => {
    map.fitBounds(e.target.getBounds(), { padding: [20, 20] });
  }).addTo(map);

  // Mission markers
  pois.forEach(poi => addMissionMarker(poi, pois));
}

function missionIcon(poi, nearby) {
  const num = poi.mission || '·';
  const bg  = nearby ? '#4a7a2a' : '#6b4226';
  return L.divIcon({
    className: '',
    html: `<div style="
      width:32px;height:32px;border-radius:50% 50% 50% 0;
      background:${bg};border:2px solid #fffdf5;
      transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;
      box-shadow:0 2px 6px rgba(0,0,0,0.3)">
      <span style="transform:rotate(45deg);color:#fffdf5;font-weight:700;font-size:0.7rem;font-family:sans-serif">${num}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -36]
  });
}

function addMissionMarker(poi, allPois) {
  const marker = L.marker([poi.lat, poi.lon], { icon: missionIcon(poi, false) });
  marker.addTo(map);
  marker.on('click', () => openModal(poi));
}

// ── GPS tracking ──────────────────────────────────────────────────────────
let watchId = null;

document.getElementById('gps-btn').addEventListener('click', () => {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    document.getElementById('gps-btn').classList.remove('active');
    if (userMarker) { userMarker.remove(); userMarker = null; }
    return;
  }
  document.getElementById('gps-btn').classList.add('active');
  watchId = navigator.geolocation.watchPosition(pos => {
    const ll = [pos.coords.latitude, pos.coords.longitude];
    if (!userMarker) {
      userMarker = L.circleMarker(ll, {
        radius: 8, color: '#4a7a2a', fillColor: '#4a7a2a',
        fillOpacity: 0.9, weight: 2
      }).addTo(map);
    } else {
      userMarker.setLatLng(ll);
    }
  }, null, { enableHighAccuracy: true });
});

// ── Mission List ──────────────────────────────────────────────────────────
function setupMissionList(pois) {
  const list = document.getElementById('mission-list');
  pois.forEach(poi => {
    const item = document.createElement('div');
    item.className = 'mission-item';
    item.innerHTML = `
      <div class="mission-item-num">Misión ${poi.mission}</div>
      <div class="mission-item-name">${poi.languages.es.name.replace(/Misión \d+ · /, '')}</div>
    `;
    item.addEventListener('click', () => {
      map.setView([poi.lat, poi.lon], 16);
      openModal(poi);
    });
    list.appendChild(item);
  });
}

// ── Modal ─────────────────────────────────────────────────────────────────
let currentAudio = null;

function openModal(poi) {
  const lang = poi.languages.es;
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('modal');
  const tabs    = document.getElementById('modal-tabs');
  const content = document.getElementById('modal-content');

  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');

  // Build tabs
  const tabDefs = buildTabs(poi, lang);
  tabs.innerHTML = '';
  tabDefs.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTabContent(tab, lang, content);
    });
    tabs.appendChild(btn);
  });

  renderTabContent(tabDefs[0], lang, content);
}

function buildTabs(poi, lang) {
  const tabs = [];
  tabs.push({ id: 'mision', label: '🧭 Misión' });
  if (lang.species && lang.species.length > 0)   tabs.push({ id: 'especies', label: '🌿 Especies' });
  if (lang.geology && lang.geology.length > 0)   tabs.push({ id: 'geologia', label: '🪨 Geología' });
  if (lang.compass)                               tabs.push({ id: 'brujula', label: '🧭 Brújula' });
  if (poi.images && poi.images.length > 0)        tabs.push({ id: 'galeria', label: '📷 Galería' });
  if (poi.audio)                                  tabs.push({ id: 'audio', label: '🎧 Audio' });
  return tabs;
}

function renderTabContent(tab, lang, container) {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }

  switch (tab.id) {
    case 'mision':
      container.innerHTML = `
        <div class="modal-mission-name">${lang.name}</div>
        <p class="modal-description">${lang.description}</p>
        ${lang.challenge ? `<div class="mission-challenge">🔍 ${lang.challenge}</div>` : ''}
      `;
      break;

    case 'especies':
      container.innerHTML = `<div class="species-grid">
        ${lang.species.map(s => `
          <div class="species-card">
            ${s.image
              ? `<img src="${s.image}" alt="${s.common}" loading="lazy">`
              : `<div class="species-img-placeholder">🌿</div>`}
            <div class="species-common">${s.common}</div>
            <div class="species-scientific">${s.scientific}</div>
            <div class="species-note">${s.note}</div>
          </div>
        `).join('')}
      </div>`;
      break;

    case 'geologia':
      container.innerHTML = `<div class="geology-list">
        ${lang.geology.map(g => `
          <div class="geology-card">
            <div class="geology-name">${g.name}</div>
            <div class="geology-age">${g.age}</div>
            <div class="geology-note">${g.note}</div>
          </div>
        `).join('')}
      </div>`;
      break;

    case 'brujula':
      container.innerHTML = `
        <ol class="compass-steps">
          ${lang.compass.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>
        <div class="landmark-list">
          ${lang.compass.landmarks.map(l => `<div class="landmark-item">📍 ${l}</div>`).join('')}
        </div>
      `;
      break;

    case 'galeria': {
      // poi is captured in outer scope via buildTabs — re-read from data attr
      const imgs = JSON.parse(container.closest('#modal').dataset.poi || '[]');
      container.innerHTML = `<div class="gallery-wrap">
        ${imgs.map(src => `<img class="gallery-img" src="${src}" loading="lazy">`).join('')}
      </div>`;
      break;
    }

    case 'audio': {
      const src = container.closest('#modal').dataset.audio || '';
      container.innerHTML = `
        <div class="audio-player">
          <div class="audio-label">Narración de la misión</div>
          <div class="audio-controls">
            <button class="audio-play-btn" id="audio-play">▶</button>
            <div class="audio-progress" id="audio-progress">
              <div class="audio-progress-fill" id="audio-fill"></div>
            </div>
            <span class="audio-time" id="audio-time">0:00</span>
          </div>
        </div>
      `;
      const audio = new Audio(src);
      currentAudio = audio;
      const playBtn = document.getElementById('audio-play');
      const fill    = document.getElementById('audio-fill');
      const timeEl  = document.getElementById('audio-time');

      playBtn.addEventListener('click', () => {
        if (audio.paused) { audio.play(); playBtn.textContent = '⏸'; }
        else              { audio.pause(); playBtn.textContent = '▶'; }
      });

      audio.addEventListener('timeupdate', () => {
        const pct = audio.duration ? (audio.currentTime / audio.duration * 100) : 0;
        fill.style.width = pct + '%';
        const m = Math.floor(audio.currentTime / 60);
        const s = String(Math.floor(audio.currentTime % 60)).padStart(2, '0');
        timeEl.textContent = `${m}:${s}`;
      });

      audio.addEventListener('ended', () => { playBtn.textContent = '▶'; });
      break;
    }
  }
}

// Close modal
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', closeModal);

function closeModal() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  document.getElementById('modal').classList.add('hidden');
  document.getElementById('modal-overlay').classList.add('hidden');
}

// Store poi data on modal element for gallery/audio tabs
const origOpenModal = openModal;
window._openModalPoi = null;
function openModal(poi) {
  const modal = document.getElementById('modal');
  modal.dataset.poi   = JSON.stringify(poi.images || []);
  modal.dataset.audio = poi.audio || '';
  origOpenModal(poi);
}
</script>
```

- [ ] **Step 4: Fire `appUnlocked` event from the PIN unlock function**

In the existing `<script>` PIN block, update the `unlockApp` function to dispatch the event:

```javascript
function unlockApp() {
  sessionStorage.setItem('bonichesUnlocked', JSON.stringify({ date: todayKey() }));
  document.getElementById('pin-gate').classList.add('hidden');
  document.getElementById('app').classList.add('visible');
  document.dispatchEvent(new Event('appUnlocked'));
}
```

- [ ] **Step 5: Verify in browser**

Open `boniches.html`, enter PIN. You should see:
- Cream topbar with back arrow and GPS button
- Leaflet map centered on Boniches with topo tiles
- GPX route drawn in leather brown
- 7 numbered brown markers on the map
- Bottom mission list strip (mobile) or right panel (desktop ≥768px)
- Tap a marker → modal opens with 🧭 Misión tab showing description + challenge callout
- Mission 1 → Especies tab shows 5 species cards with placeholder icons
- Mission 6 → Geología tab shows 3 rock type cards
- Mission 7 → Brújula tab shows numbered compass steps + landmark list
- Close modal with ✕ or tapping overlay

- [ ] **Step 6: Commit**

```bash
git add boniches.html
git commit -m "feat: boniches map, mission markers, GPX track, tabbed mission modals"
```

---

## Task 5: Fix gallery tab (poi reference in closure)

The gallery tab has a bug — `poi.images` is stashed in `data-poi` but the `case 'galeria'` reads from `container.closest('#modal').dataset.poi`. This works but deserves a clean pass.

**Files:**
- Modify: `boniches.html`

- [ ] **Step 1: Simplify openModal to pass poi to renderTabContent**

Replace the `buildTabs` call section in `openModal` with a version that closes over `poi`:

```javascript
function openModal(poi) {
  const lang = poi.languages.es;
  const overlay = document.getElementById('modal-overlay');
  const modal   = document.getElementById('modal');
  const tabs    = document.getElementById('modal-tabs');
  const content = document.getElementById('modal-content');

  overlay.classList.remove('hidden');
  modal.classList.remove('hidden');

  const tabDefs = buildTabs(poi, lang);
  tabs.innerHTML = '';
  tabDefs.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
    btn.textContent = tab.label;
    btn.addEventListener('click', () => {
      tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTabContent(tab, lang, content, poi);
    });
    tabs.appendChild(btn);
  });

  renderTabContent(tabDefs[0], lang, content, poi);
}
```

Update `renderTabContent` signature to accept `poi`:

```javascript
function renderTabContent(tab, lang, container, poi) {
```

Update the `case 'galeria'` to use `poi` directly:

```javascript
case 'galeria':
  container.innerHTML = `<div class="gallery-wrap">
    ${(poi.images || []).map(src => `<img class="gallery-img" src="${src}" loading="lazy">`).join('')}
  </div>`;
  break;
```

Update the `case 'audio'` to use `poi.audio` directly:

```javascript
case 'audio': {
  const src = poi.audio || '';
```

Remove the `origOpenModal` / `window._openModalPoi` hack and the `modal.dataset.*` lines entirely.

- [ ] **Step 2: Commit**

```bash
git add boniches.html
git commit -m "fix: pass poi directly to renderTabContent, remove dataset hack"
```

---

## Task 6: Service worker + index page

Wire up offline support and add the Boniches card to the landing page.

**Files:**
- Modify: `sw.js`
- Modify: `index.html`

- [ ] **Step 1: Add boniches.html to sw.js PRECACHE**

In `sw.js`, add `'/boniches.html'` to the `PRECACHE` array:

```javascript
const PRECACHE = [
  '/',
  '/index.html',
  '/trail.html',
  '/boniches.html',   // ← add this line
  '/manifest.json',
  '/routes/hanover/pois.json',
  '/routes/allue-casteriello/pois.json',
  '/routes/allue-san-anton/pois.json',
  '/routes/allue-collata/pois.json',
  '/routes/allue-puyaldo/pois.json',
  '/routes/boniches/pois.json',
];
```

Also bump the cache version to force refresh:

```javascript
const CACHE_NAME = 'ruta-interactiva-v3';
```

- [ ] **Step 2: Add Boniches card to index.html**

In `index.html`, the `ROUTES` array at line ~500 already has a `boniches` entry:
```javascript
{ id: 'boniches', name: 'Misión Boniches', region: 'Boniches, Cuenca', country: 'ES', difficulty: 'Easy', maxZoom: 17 },
```

Find the `switch` statement that builds route card content (around line 661) and add a Boniches case. Look for the pattern `case 'hanover': return \`` and add before it:

```javascript
case 'boniches': return `
  <div class="card-distance">~6 km · 7 misiones</div>
  <div class="card-description">Ruta interpretativa autoguiada para descubrir la fauna, flora y geología única de Boniches.</div>
`;
```

Then find where route cards build their open button link (look for `trail.html?route=`) and add special handling for Boniches to link to `boniches.html` instead:

```javascript
// In the card building code, find the btn-open href assignment and change to:
const openHref = route.id === 'boniches' ? 'boniches.html' : `trail.html?route=${route.id}&lang=${lang}`;
btnOpen.href = openHref;
```

- [ ] **Step 3: Verify index page shows Boniches card**

Open `index.html`. The carousel should include a Boniches card. Clicking "Abrir" should navigate to `boniches.html`.

- [ ] **Step 4: Commit**

```bash
git add sw.js index.html
git commit -m "feat: add boniches to sw precache and index carousel"
```

---

## Task 7: Image asset organisation helper

Write a one-time script to triage the 346 extracted images into mission buckets. This script is a development tool, not part of the app.

**Files:**
- Create: `scripts/triage-images.py`

- [ ] **Step 1: Create triage script**

Create `scripts/triage-images.py`:

```python
#!/usr/bin/env python3
"""
Triage extracted PDF images into size buckets.
Run from project root: python3 scripts/triage-images.py
"""
import os, shutil
from pathlib import Path

SRC   = Path("extracted/images")
DEST  = Path("routes/boniches/images")
PAGES = Path("extracted/pages")

def human(size):
    return f"{size//1024}KB" if size < 1_000_000 else f"{size/1_000_000:.1f}MB"

files = sorted(SRC.glob("*"), key=lambda f: f.stat().st_size, reverse=True)

print(f"\n{'File':<35} {'Size':>8}  Category")
print("-" * 60)

large, medium, small, bg = [], [], [], []

for f in files:
    s = f.stat().st_size
    if s > 5_000_000:
        cat = "BACKGROUND (skip)"
        bg.append(f)
    elif s > 1_000_000:
        cat = "LARGE — gallery/overview photo"
        large.append(f)
    elif s > 200_000:
        cat = "MEDIUM — species illustration"
        medium.append(f)
    else:
        cat = "small — icon/decoration"
        small.append(f)
    print(f"{f.name:<35} {human(s):>8}  {cat}")

print(f"\nSummary: {len(bg)} backgrounds, {len(large)} large, {len(medium)} medium, {len(small)} small")
print(f"\nBackground files (all identical except page01): discard all but first")
if bg:
    keep = bg[-1]  # smallest = first page's background
    print(f"  Keep: {keep.name}")
    discard = [f for f in bg if f != keep]
    print(f"  Discard: {len(discard)} files")
```

- [ ] **Step 2: Run the triage script**

```bash
python3 scripts/triage-images.py 2>/dev/null | head -80
```

Review the output. Identify which medium-sized PNGs correspond to Noelia's species illustrations vs photos. Manually copy the keepers to `routes/boniches/images/species/` and `routes/boniches/images/`.

- [ ] **Step 3: Commit script**

```bash
git add scripts/triage-images.py
git commit -m "tools: add PDF image triage helper script"
```

---

## Task 8: Wire up real images in pois.json

After completing the image triage from Task 7, update pois.json with actual image paths.

**Files:**
- Modify: `routes/boniches/pois.json`

- [ ] **Step 1: Update image and species image paths**

For each POI, replace `"images": []` with actual paths, e.g.:

```json
"images": ["routes/boniches/images/m01-overview.jpg"]
```

For each species, replace `"image": null` with actual path, e.g.:

```json
"image": "routes/boniches/images/species/salicornia-europaea.png"
```

Use `null` for any species that doesn't have an extracted illustration — the app shows a 🌿 placeholder.

- [ ] **Step 2: Commit**

```bash
git add routes/boniches/pois.json routes/boniches/images/
git commit -m "assets: add boniches species illustrations and mission images"
```

---

## Task 9: Wire up audio narration

After narration MP3s are recorded and placed in `routes/boniches/audio/`.

**Files:**
- Modify: `routes/boniches/pois.json`

- [ ] **Step 1: Add audio paths**

For each POI, replace `"audio": null` with the MP3 path:

```json
"audio": "routes/boniches/audio/mision-01.mp3"
```

Expected filenames: `mision-01.mp3` through `mision-07.mp3`.

- [ ] **Step 2: Add audio files to sw.js PRECACHE**

In `sw.js`, add the audio paths (or rely on the existing cache-first fetch handler for `/routes/` paths — no PRECACHE change needed, they'll be cached on first access).

- [ ] **Step 3: Commit**

```bash
git add routes/boniches/pois.json routes/boniches/audio/
git commit -m "assets: add boniches narration audio and wire into pois.json"
```

---

## Verification Checklist

Run these checks before calling the feature complete:

- [ ] Open `boniches.html` — PIN gate appears with cream paper background
- [ ] Calculate today's PIN: `((day * 37 + month * 13 + 7) % 9000) + 1000` and enter it → app unlocks
- [ ] Leaflet map loads, GPX track visible in leather brown, 7 numbered markers visible
- [ ] Tap marker 1 → modal opens, Misión tab shows description + challenge callout, Especies tab shows 5 species cards
- [ ] Tap marker 6 → Geología tab visible instead of Especies
- [ ] Tap marker 7 → Brújula tab shows numbered steps + landmarks
- [ ] GPS button → activates location tracking, green dot appears on map
- [ ] Close tab, reopen → PIN gate shows again (sessionStorage cleared)
- [ ] Enter wrong PIN 3× → branded expired screen with Noelia contact info
- [ ] Open `index.html` → Boniches card visible in carousel, "Abrir" links to `boniches.html`
- [ ] On mobile (or DevTools mobile mode): mission list appears as horizontal bottom strip
- [ ] On desktop ≥768px: left map 40%, right mission panel 60%
- [ ] "Today's PIN" from CLAUDE.md — ask Claude "give me today's PIN" → correct answer
