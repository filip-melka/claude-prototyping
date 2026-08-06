# Claude Prototyping

Ideas for mobile apps and games live as work items in Plane. Each one becomes a static HTML
prototype in this repo, browsable from a phone via GitHub Pages.

Gallery: https://filip-melka.github.io/claude-prototyping/

The end-to-end run procedure lives in `.claude/commands/prototype.md` (`/prototype`). This file
holds the conventions that procedure depends on.

## Layout

```
index.html                     gallery — renders whatever is in prototypes.json
prototypes.json                the manifest; also the Telegram notification trigger
template.html                  starting point copied for each new prototype
prototypes/<TASK-ID>/          one directory per work item, e.g. prototypes/PROTOTYPE-1/
  index.html                   the prototype itself
  assets/                      files downloaded from Plane attachments, if any
```

`<TASK-ID>` is the Plane human identifier (`PROTOTYPE-1`), never the UUID.

## Prototype rules

- **Self-contained.** Inline `<style>` and `<script>` only. No CDN, no external fonts, no remote
  images — a prototype must render with the network off. Small attachment images get inlined as
  `data:` URIs; larger files go in `assets/` and are referenced relatively.
- **Phone first.** Designed for ~390×844. Use `template.html` for the shell: `viewport-fit=cover`,
  `100dvh`, `env(safe-area-inset-*)` padding, `overscroll-behavior: none`,
  `touch-action: manipulation`, tap targets ≥ 44px.
- **Keep the back link** to `../../index.html`.
- **Static only.** No build step, no package manager, nothing to install.
- Dark and light both via `prefers-color-scheme`.

## prototypes.json

```json
{
  "prototypes": [
    {
      "id": "PROTOTYPE-1",
      "workItemId": "<plane work item uuid>",
      "title": "Tap Tempo Trainer",
      "tagline": "One-line pitch shown on the gallery card.",
      "kind": "game",
      "path": "prototypes/PROTOTYPE-1/index.html",
      "version": 1,
      "createdAt": "2026-08-06",
      "updatedAt": "2026-08-06",
      "changelog": ["v1 — initial prototype"]
    }
  ]
}
```

- `version` is an int: `1` on creation, `+1` on every refine, with one appended `changelog` line
  per bump. The notification workflow diffs this file: a new `id` means created, a higher `version`
  means refined — so getting the bump right is what makes the Telegram message correct.
- `kind` is free-form but keep it to `app` or `game`.
- Dates are `YYYY-MM-DD`.
- Keep the array sorted by `id` so commit diffs stay readable. The gallery sorts by `updatedAt`
  at render time.

## Plane

Workspace project **Claude Prototyping** — id `bc3f1059-582d-41d8-8ec3-7ca287f5b709`,
identifier `PROTOTYPE`.

| State | UUID | Meaning |
|---|---|---|
| Backlog | `898c4f2d-eb96-4dcc-a4d3-3f7e9426cc96` | Not ready; never picked up |
| Todo | `33f8df05-8ede-495a-bcdf-34daa686ee69` | Ready to prototype |
| In Progress | `1771b17c-6c27-4440-a778-e0f9c990c90e` | Claimed by a run |
| Done | `7f6dad98-2167-43c2-af62-f80605022d7f` | Closed by hand |
| Cancelled | `8f9529a4-f26d-44da-81b7-5ad23640338b` | Dropped |
| Done by Claude | `7d95ecea-19b3-44b5-99a2-cb69749af4b8` | Built/refined by a run, awaiting review |
| Refine | `5e25bc34-2996-444e-9b21-48dba6a068fc` | Reviewed, changes requested in comments |

Address states by UUID, not by name.

## Commits

A run commits only the prototype directory it touched plus `prototypes.json`, straight to `main`.
Message format: `PROTOTYPE-N: <title> (v<n>)`.
