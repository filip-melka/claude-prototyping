---
name: capture-prototype-idea
description: >-
  Capture a mobile app or game idea as a work item in the Plane project "Claude
  Prototyping", where a scheduled Claude run turns it into a playable HTML prototype.
  Use whenever the user has an app or game idea they want saved, written up, or "put
  in Plane" — and when they want to talk an idea through before saving it.
---

# Capture a prototype idea

## What this is for

Filip collects mobile app and game ideas in the Plane project **Claude Prototyping**. A scheduled
Claude run picks one work item at a time and builds a self-contained static HTML prototype of it,
sized for a phone, which he then reviews on his phone.

That run sees **only the work item**. It cannot ask a follow-up question, cannot see this
conversation, and gets one shot. So the description you write here *is* the product spec — it is
the most important thing this skill does. A vague description produces a vague prototype and
wastes a scheduled run.

Use the Plane MCP connector directly for every call below.

## Constants

Project **Claude Prototyping** — `bc3f1059-582d-41d8-8ec3-7ca287f5b709`

| State | UUID |
|---|---|
| **Backlog** (default for new ideas) | `898c4f2d-eb96-4dcc-a4d3-3f7e9426cc96` |
| Todo (ready to prototype) | `33f8df05-8ede-495a-bcdf-34daa686ee69` |
| In Progress | `1771b17c-6c27-4440-a778-e0f9c990c90e` |
| Refine (changes requested) | `5e25bc34-2996-444e-9b21-48dba6a068fc` |
| Done by Claude | `7d95ecea-19b3-44b5-99a2-cb69749af4b8` |
| Done | `7f6dad98-2167-43c2-af62-f80605022d7f` |
| Cancelled | `8f9529a4-f26d-44da-81b7-5ad23640338b` |

Priority is one of `urgent`, `high`, `medium`, `low`, `none`. Default `none`.

## Step 1 — understand the idea

If the idea is already concrete enough to build, **just build the brief and create it**. Do not
interrogate a clear idea.

Ask first only when something load-bearing is missing — the kind of gap that would force the
prototype run to guess at the heart of the idea:

- **No interaction.** "An app for tracking plants" says nothing about what the user *does*.
- **Nothing on screen.** You can't picture the main screen from what was said.
- **A mechanic that needs a phone answer.** "You draw a route" — with a finger? on a map? on a grid?
- **A contradiction**, or two ideas fused without saying which one leads.

Ask those as one short batch of questions, not one at a time, and offer a likely answer for each so
he can just say "yeah, the second one". Everything else — colours, copy, edge cases — you decide;
that is what the *Feel & Style* section is for, and a wrong guess is cheap because he can set the
item to **Refine** later.

If he is clearly thinking out loud rather than dictating, stay in the conversation. Push on the
idea, suggest mechanics, name what would make it fun. Capture it when he asks, or when the idea has
obviously settled and you offer.

## Step 2 — write the brief

Always these sections, in this order:

| Section | What goes in it |
|---|---|
| **The Idea** | One paragraph: what it is, who it is for, why it is fun. |
| **Core Loop** | What the user does over and over in the first 30 seconds. |
| **Screens** | Each screen, named, with what is actually on it. |
| **Feel & Style** | Palette, type weight, motion, density — concrete, not adjectives. |
| **Out of Scope** | What the prototype should fake, stub, or skip. |
| **Must-have in the prototype** | 3–7 checkboxes. |

Rules that decide whether the prototype comes out good:

- **Name real screens and real controls.** "Session screen: timer ring, big tap target, pause
  button top-right" — not "a screen for the session".
- **Write the placeholder content.** Real sample rows, real button labels, real numbers. If you
  don't, the run invents lorem ipsum and the prototype reads as empty.
- **Be physical about style.** "Near-black background, one number at 96px, everything else 13px
  grey, 120ms spring on every state change" beats "clean and modern".
- **Out of Scope is doing real work.** Say what is faked — "no accounts, no persistence beyond
  localStorage, three hardcoded levels" — so the run spends its effort on the interesting part.
- **Every checkbox must be checkable by looking at the finished prototype.** "Score persists across
  reloads" is verifiable. "Feels satisfying" is not.
- **Checkboxes are must-haves, not wishes.** Three sharp ones beat ten vague ones. Everything else
  belongs in the prose sections.

Keep the title short and punchy — the thing itself, not a sentence about it. "Tap Tempo Trainer",
not "An app for practising rhythm".

### Worked example

> **He says:** "something that turns metronome practice into a streak game — you tap along and it
> scores how far off you are"

Title: `Tap Tempo Trainer`

> **The Idea**
> A rhythm trainer for musicians who never practise with a metronome because it is boring. You tap
> along to a beat, it scores your timing drift in milliseconds, and it guards a daily streak the
> way a fitness app does. The fun is watching a hard number get better.
>
> **Core Loop**
> Pick a tempo → four count-in beats → tap 16 beats while a ring pulses → see your average drift in
> ms and whether it beat your best → tap again immediately.
>
> **Screens**
> - **Home** — streak count as the hero number, "Practise" button filling the bottom third, best
>   drift underneath, tempo stepper (60–180 BPM, defaults to 90).
> - **Session** — pulsing ring filling the screen, beat counter "7 / 16" in the centre, drift
>   flashing green/amber/red per tap, pause top-right.
> - **Results** — average drift at 96px ("31 ms"), delta vs best ("−4 ms"), a 16-dot strip showing
>   early/late per beat, "Again" and "Done" buttons.
>
> **Feel & Style**
> Near-black `#0b0b0d`, one accent lime `#c6f24e`, everything else grey. Numbers in heavy tabular
> type, labels small and quiet. Every tap gets a 90ms scale pulse. No chrome, no nav bar.
>
> **Out of Scope**
> No audio required — a visual beat is fine. No accounts, no history beyond "best". Streak can be
> faked at 4 days.
>
> **Must-have in the prototype**
> - [ ] Tap along to a running beat and get a drift number in ms
> - [ ] Results screen with average drift and the per-beat strip
> - [ ] Best score persists across reloads
> - [ ] Tempo is adjustable before a session

Note how much of that he never said. Filling those gaps confidently is the job; asking him to
specify a lime accent is not.

## Step 3 — build `description_html`

Plane stores descriptions as HTML (TipTap editor). Pass `description_html`.

Use only: `<h2>`, `<p>`, `<ul>`/`<li>`, `<ol>`/`<li>`, `<strong>`, `<em>`, `<code>`, and the
task-list block below. No classes, no `data-id`, no inline styles — Plane adds its own bookkeeping
when it saves. Escape `&`, `<`, `>` in anything the user wrote.

The checkbox list must be exactly this shape, one `<li>` per todo, always unchecked on creation:

```html
<ul data-type="taskList">
  <li data-checked="false" data-type="taskItem">
    <label><input type="checkbox"><span></span></label>
    <div><p>Tap along to a running beat and get a drift number in ms</p></div>
  </li>
  <li data-checked="false" data-type="taskItem">
    <label><input type="checkbox"><span></span></label>
    <div><p>Best score persists across reloads</p></div>
  </li>
</ul>
```

Never write literal `[ ]` or `- [ ]` text — that renders as characters, not tickable boxes, and the
prototype run will not recognise it. The run ticks the boxes itself when it has built the thing.

Skeleton:

```html
<h2>The Idea</h2><p>…</p>
<h2>Core Loop</h2><p>…</p>
<h2>Screens</h2><ul><li><strong>Home</strong> — …</li><li><strong>Session</strong> — …</li></ul>
<h2>Feel &amp; Style</h2><p>…</p>
<h2>Out of Scope</h2><p>…</p>
<h2>Must-have in the prototype</h2>
<ul data-type="taskList">…</ul>
```

## Step 4 — create the work item

1. **Labels.** `list_labels` on the project. Ensure the one you need exists — `app` or `game` —
   creating it with `create_label` if absent. Exactly one per item.
2. **Create.** `create_work_item` with:
   - `project_id` — the constant above
   - `name` — the title
   - `description_html` — from step 3
   - `state` — **Backlog** unless he said otherwise. If he says "ready to go", "do it tonight",
     "straight to Todo" or similar, use **Todo** — that is what makes a scheduled run pick it up.
   - `priority` — only when he signals it ("this one first", "not urgent"). Otherwise omit.
   - `labels` — `[<label id>]`

## Step 5 — report back

Tell him: `PROTOTYPE-N — Title`, the state it landed in, the label, and how many checkboxes.
Then, briefly, the one or two assumptions you made that he might want to overrule.

Nothing is locked in — while it sits in Backlog the description can be rewritten with
`update_work_item`, so offer that if he reacts to any of it.

## Notes

- **Reference images.** Images shared in chat cannot be attached — Plane's attachment tool only
  fetches from a public URL. If he has a reference, say the item is created and he can drop the
  image on it in Plane; the prototype run reads attachments and uses them.
- **Reviewing prototypes.** When he wants changes to a prototype that was already built, that is a
  state change to **Refine** plus a comment describing the change — plain MCP calls, not this
  skill. The comment is what the next run reads, so make it specific.
- **Anything else on the board** — listing ideas, restating one, moving states — is just the Plane
  connector. This skill is only about getting an idea in well.
