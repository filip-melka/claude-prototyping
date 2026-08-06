# Claude Prototyping

Mobile app and game ideas, tracked in Plane, turned into static HTML prototypes you can flick
through on a phone.

**→ https://filip-melka.github.io/claude-prototyping/**

## How it runs

A scheduled Claude routine runs `/prototype`. Each run picks **one** work item from the Plane
project — anything in **Refine** first, otherwise **Todo**, highest priority wins — builds or
refines `prototypes/<TASK-ID>/index.html`, bumps its entry in `prototypes.json`, pushes to `main`,
and moves the item to **Done by Claude** with a comment linking the live prototype.

Review it on your phone. To ask for changes, set the item back to **Refine** and leave a comment
saying what you want; the next run picks it up ahead of any new idea.

The procedure lives in `.claude/commands/prototype.md`; the conventions it relies on are in
`CLAUDE.md`.

## Capturing ideas

`skills/capture-prototype-idea/` is a Claude skill for turning a conversation about an app or game
idea into a properly written work item on the board — structured brief, must-have checkboxes,
`app`/`game` label, straight into Backlog. Upload it on claude.ai (Settings → Capabilities →
Skills) and it works from phone, desktop, and web.

Rebuild the upload zip after editing it:

```
rm -f capture-prototype-idea.zip && (cd skills && zip -rX ../capture-prototype-idea.zip capture-prototype-idea -x '.*')
```

## Local preview

`index.html` fetches the manifest, so serve it rather than opening the file:

```
python3 -m http.server 8000
```

## Setup

- **GitHub Pages** — Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
- **Telegram notifications** (optional) — add repository secrets `TELEGRAM_BOT_TOKEN` and
  `TELEGRAM_CHAT_ID`. Until then `.github/workflows/notify-telegram.yml` runs and skips.
