---
description: Pick one Plane work item and build or refine its phone prototype, then push and close it out
---

Build one prototype, end to end, unattended. Read `CLAUDE.md` first — it holds the layout,
manifest schema, and Plane state UUIDs this procedure refers to.

Work through the steps in order. If a step fails, jump to **Failure handling** at the bottom.

## 1. Sync

```
git -C . pull --rebase
```

The runner may hold a stale clone. Start from a clean, current `main`.

## 2. Pick exactly one work item

Project id: `bc3f1059-582d-41d8-8ec3-7ca287f5b709`.

1. `list_work_items` with `pql: state = "5e25bc34-2996-444e-9b21-48dba6a068fc"` (**Refine**).
2. Only if that returns nothing, `list_work_items` with
   `pql: state = "33f8df05-8ede-495a-bcdf-34daa686ee69"` (**Todo**).

Refine always wins over Todo — a prototype the user has already reviewed matters more than a new
one. Within the chosen set, take the highest priority (`urgent` > `high` > `medium` > `low` >
`none`); if several tie at the top, pick one of them at random.

**If both queries come back empty: stop here.** Make no commit, change no state, say that there
was nothing to do. That is a normal, successful run.

## 3. Claim it

`update_work_item` → state `1771b17c-6c27-4440-a778-e0f9c990c90e` (In Progress). This keeps a
concurrent or retried run from picking the same item. Remember the state it was in before.

## 4. Read the brief

- `retrieve_work_item` → `name`, `description_html`, `priority`, `sequence_id`. The human
  identifier (`PROTOTYPE-<sequence_id>`) is the directory name.
- `list_work_item_comments` → **mandatory for a Refine**, and worth reading for a Todo. Comments
  are ordered oldest-first; the newest ones are the change request. Treat every unaddressed
  comment as a requirement, not a suggestion.
- `list_work_item_attachments` → for each attachment, `get_work_item_attachment_download_url`,
  then download it into `prototypes/<ID>/assets/`. Look at images before building — they are
  usually the intended look. Inline anything under ~200 KB as a `data:` URI and delete the file;
  keep larger files in `assets/` and reference them relatively.

## 5. Build or refine

Target: `prototypes/<ID>/index.html`.

- **New (Todo):** copy `template.html` and build inside the marked regions.
- **Refine:** edit the existing file in place. Do not restart from the template — the point is to
  change what the user reviewed, not to replace it.

The prototype must satisfy every rule in `CLAUDE.md` → *Prototype rules*: self-contained, phone
first, back link intact, no external requests, dark and light.

Aim for something interactive enough to convey the idea in thirty seconds on a phone — real
screens, real transitions, plausible placeholder content. Not a wireframe, not a full app.

## 6. Tick the description checkboxes

If `description_html` contains task-list checkboxes, every one of them is a requirement for this
prototype. Implement them all, then mark them done in Plane:

- Plane's editor (TipTap) stores them like this, with the state in **two** places:

  ```html
  <li data-checked="false" data-type="taskItem">
    <label><input type="checkbox"><span></span></label>
    <div><p>Best score persists across reloads</p></div>
  </li>
  ```

  Done means `data-checked="true"` **and** `<input type="checkbox" checked="checked">`. Setting
  only one of the two leaves the box looking wrong in the UI.
- Flip only those two attributes — leave every other byte exactly as it was, including the
  `data-id` UUIDs and utility classes Plane's editor adds.
- Write it back with `update_work_item`, then `retrieve_work_item` again and confirm the boxes
  actually came back checked.

## 7. Update the manifest

Edit `prototypes.json` (schema in `CLAUDE.md`):

- **New:** append an entry at `version: 1` with `createdAt` = `updatedAt` = today, and
  `changelog: ["v1 — initial prototype"]`. Re-sort the array by `id`.
- **Refine:** bump `version` by 1, set `updatedAt` to today, append one changelog line naming what
  changed (`"v2 — bigger tap targets, added the results screen"`).

The `version` bump is what drives the notification. Do not skip it on a refine.

## 8. Verify before pushing

No browser is available in a scheduled run, so check statically:

- `python3 -m json.tool prototypes.json > /dev/null` — manifest parses.
- Every `path` in the manifest exists on disk.
- `grep -nE 'https?:|src="//|href="//' prototypes/<ID>/index.html` returns nothing (a `data:` URI
  is fine; so is a comment mentioning a URL — judge the hits, do not just count them).
- The back link `../../index.html` resolves from the prototype directory.

## 9. Commit and push

Stage only `prototypes/<ID>/` and `prototypes.json`.

```
git add prototypes/<ID> prototypes.json
git commit -m "PROTOTYPE-N: <title> (v<n>)"
git pull --rebase && git push origin main
```

## 10. Close the loop

- `create_work_item_comment` on the item: the live URL
  `https://filip-melka.github.io/claude-prototyping/prototypes/<ID>/`, the version, and a short
  summary of what you built or changed. On a refine, say explicitly how each review comment was
  addressed.
- `update_work_item` → state `7d95ecea-19b3-44b5-99a2-cb69749af4b8` (Done by Claude).

Then report: which item, new or refine, what you built, the version, the URL.

## Failure handling

If anything after step 3 fails and you cannot recover:

1. Restore the work item to the state it held before step 3 (Todo or Refine).
2. `create_work_item_comment` describing exactly what failed.
3. Do not push a half-finished prototype. If you already committed locally but the push failed,
   say so plainly in the final report.
