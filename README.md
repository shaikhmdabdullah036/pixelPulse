# pixelPulse — Mangalam HDPE Pipes (landing page)

A **single-page marketing site** for an HDPE pipes and coils manufacturer. The layout is implemented in **vanilla HTML, CSS, and JavaScript** (no frameworks), with structure and visual language aligned to typical **Figma / design-handoff** product pages: hero gallery, specifications, feature grids, process storytelling, social proof, resources, FAQs, and a contact block.

The repository name is **pixelPulse**; the demo content brands the page as **Mangalam HDPE Pipes** and uses placeholder contact details and demo imagery suitable for local preview.

---

## What’s on the page

| Area | Description |
|------|-------------|
| **Navigation** | Fixed top bar with brand, mobile drawer, **Products** dropdown, and **Contact** call-to-action. |
| **Product hero** | Breadcrumb, headline, bullet features, price band, primary/secondary CTAs. |
| **Image carousel** | Full-width slides with prev/next controls, **thumbnail strip**, optional **zoom / lens panel** on hover (desktop-friendly), keyboard-friendly focus ring. |
| **Logo cloud** | “Trusted by…” strip (placeholder marks). |
| **Technical specs** | Dark-band section with table, intro copy, and datasheet download link (stub). |
| **Built / features** | Grid of feature cards plus **Request a quote** CTA. |
| **Manufacturing process** | Tabbed steps driven by in-script **`PROCESS_STEPS`** data; each step can include bullets, image, and in-card prev/next for media. |
| **Testimonials** | Quote cards; on small screens the grid becomes a **horizontal scroll** with snap. |
| **Portfolio** | Product/service cards and a soft CTA bar. |
| **Resources** | Download-style rows (stub links). |
| **FAQ** | Native `<details>` / `<summary>` accordions plus an **email catalogue** mini-form (stub). |
| **Applications** | Horizontal strip of image cards with prev/next scrolling. |
| **Contact** | Navy gradient band with copy and a **contact form** (submit shows a thank-you **alert**; no backend). |
| **Footer** | Multi-column links, address, and social placeholders. |

---

## Tech stack

- **HTML5** — semantic landmarks, skip link, basic ARIA on carousel and menus.
- **CSS** — custom properties (design tokens), responsive grids, `@media` breakpoints, scroll-snap for carousels, reduced-motion preferences.
- **JavaScript** — one IIFE in strict mode: builds carousel DOM from **`CAROUSEL_IMAGES`**, wires nav/dropdown, zoom preview, process tabs, applications arrows, form **`preventDefault`** stubs, footer year.

External assets: **Google Fonts (Inter)** and **Unsplash** image URLs (network required for images unless you swap to local files).

---

## Project layout

```
pixelPulse/
├── index.html    # Full page markup and section structure
├── styles.css    # Global styles, components, responsive rules
├── script.js     # Behavior and content arrays (carousel, process steps)
├── README.md
├── LICENSE       # MIT
└── .gitignore
```

---

## Run locally

No build step or package manager is required.

1. Clone or download the project.
2. Open **`index.html`** in a browser, **or** serve the folder so absolute paths and font loading behave predictably:

   ```bash
   cd pixelPulse
   python3 -m http.server 8080
   ```

   Then visit `http://localhost:8080`.

---

## Customization

- **Carousel images** — Edit the `CAROUSEL_IMAGES` array in **`script.js`** (`src` / `alt` per slide).
- **Process content** — Edit **`PROCESS_STEPS`** in **`script.js`** (titles, body, bullets, image URLs).
- **Copy and sections** — Adjust **`index.html`**; tune spacing, colors, and breakpoints in **`styles.css`** (`:root` variables at the top).
- **Forms & downloads** — Replace the `preventDefault` + `alert` handlers in **`script.js`** with `fetch` calls to your API, or point forms at a form backend.
- **Accessibility** — Keep heading order, `aria-*` attributes, and visible focus styles when you change markup.

---

## Browser support

Targets modern evergreen browsers (flexbox, grid, CSS custom properties, `scroll-snap`). Test on the devices you care about; mobile layouts use dedicated rules under **`@media (max-width: 47.99rem)`** in **`styles.css`**.

---

## License

This project is released under the **MIT License** — see **`LICENSE`**.
