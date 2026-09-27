# Eventric Events — Khandari, Agra

A modern, elegant 5-page website for an event organising business — built with **pure HTML, CSS and JavaScript** (no frameworks, no build step).

## Pages
| # | File | Page |
|---|------|------|
| 1 | `index.html` | Home — hero, services, stats, portfolio preview, testimonials |
| 2 | `about.html` | About — story, mission/vision, timeline, team |
| 3 | `services.html` | Services — 6 detailed services, process, pricing packages |
| 4 | `portfolio.html` | Portfolio — filterable gallery + lightbox, testimonials |
| 5 | `contact.html` | Contact — validated form, map, FAQ accordion |

## Features
- 🎨 **Two themes**: elegant Light theme (ivory + gold + wine) and a Dark theme — toggle in the header (choice is saved in `localStorage`)
- ✨ **Animations**: preloader, hero line reveals, Ken Burns parallax hero, scroll-reveal (IntersectionObserver), animated counters, marquee strip, hover lifts, testimonial slider, floating elements, scroll progress bar, back-to-top
- 🖼️ **Real imagery** from Unsplash (services, portfolio, team)
- 🪄 **Custom logo**: hand-crafted SVG monogram (`images/logo.svg`) + matching favicon (`images/favicon.svg`)
- 📱 Fully responsive (mobile slide-in navigation)
- 📝 Contact form validation with success state (front-end only)
- 🔍 Portfolio filtering + keyboard-navigable lightbox
- ♿ `prefers-reduced-motion` respected

## Run locally
```bash
# any static server works, for example:
python3 -m http.server 8000
# then open http://localhost:8000
```
Or simply double-click `index.html` — everything works from `file://` too (except the Google Fonts/Unsplash assets need internet).

## Customise
- Colours → CSS variables at the top of `css/style.css` (`:root` = light, `[data-theme="dark"]` = dark)
- Phone/email/address → search for `+91 90000` / `hello@eventricevents.in` in the HTML files
- Images → replace Unsplash URLs with your own event photos

© 2026 Eventric Events, Khandari Agra.
