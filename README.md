# BOTMON // Prompt Boy Advance

A dark robotic static site package for the BOTMON AI creature-collector concept.

## Included

- `index.html` — landing page and animated hero
- `game.html` — playable four-prompt battle demo
- `codex.html` — filterable Botdex
- `world.html` — robotic world atlas
- `docs.html` — deployment notes
- `404.html` — branded HTML error route
- `css/style.css` — responsive visual system and motion
- `js/app.js` — small interactions and demo battle feedback
- `assets/` — favicon, symbolic bot marks, promo artwork, animated GIF

## Static hosting

Upload the contents as-is to GitHub Pages, Cloudflare Pages, or Cloudflare Workers Static Assets. No build command is required. All navigation uses relative `.html` routes, and no Manus-hosted website is required.

## Visual direction

The package intentionally avoids orbital visuals. The world is grounded in robotic architecture, machine districts, repair yards, neon service infrastructure, and eye-level battle spaces. The bot marks are original symbolic interface art rather than copied company logos.

## Local preview

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/`.
