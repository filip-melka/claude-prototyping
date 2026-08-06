// Diffs prototypes.json against the previous commit and posts one Telegram message
// describing what was created or refined. No-ops when the secrets are unset.
//
// Run locally against any two commits with:
//   TELEGRAM_BOT_TOKEN=x TELEGRAM_CHAT_ID=y DRY_RUN=1 node .github/scripts/notify-telegram.mjs

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const dryRun = process.env.DRY_RUN === '1';

if (!dryRun && (!token || !chatId)) {
  console.log('TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — skipping notification.');
  process.exit(0);
}

const repo = process.env.GITHUB_REPOSITORY || 'filip-melka/claude-prototyping';
const [owner, name] = repo.split('/');
const baseUrl = `https://${owner}.github.io/${name}`;

const parse = (raw) => {
  const list = JSON.parse(raw).prototypes ?? [];
  return new Map(list.map((p) => [p.id, p]));
};

const readPrevious = () => {
  try {
    return parse(execSync('git show HEAD~1:prototypes.json', { encoding: 'utf8' }));
  } catch {
    // First commit, or the file did not exist yet — treat everything as new.
    return new Map();
  }
};

const previous = readPrevious();
const current = parse(readFileSync('prototypes.json', 'utf8'));

const created = [];
const refined = [];

for (const [id, entry] of current) {
  const before = previous.get(id);
  if (!before) created.push(entry);
  else if ((entry.version ?? 1) > (before.version ?? 1)) refined.push(entry);
}

if (!created.length && !refined.length) {
  console.log('prototypes.json changed but no prototype was created or version-bumped.');
  process.exit(0);
}

const escape = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const latestNote = (p) => (Array.isArray(p.changelog) && p.changelog.length ? p.changelog.at(-1) : '');

const line = (icon, p) => {
  const url = `${baseUrl}/${p.path ?? `prototypes/${p.id}/index.html`}`;
  const note = latestNote(p);
  return [
    `${icon} <b><a href="${escape(url)}">${escape(p.title ?? p.id)}</a></b> · v${p.version ?? 1}`,
    p.tagline ? escape(p.tagline) : '',
    note ? `<i>${escape(note)}</i>` : '',
  ].filter(Boolean).join('\n');
};

const message = [
  ...created.map((p) => line('🆕', p)),
  ...refined.map((p) => line('♻️', p)),
  `\n<a href="${escape(baseUrl)}/">All prototypes</a>`,
].join('\n\n');

if (dryRun) {
  console.log(message);
  process.exit(0);
}

const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
  }),
});

if (!res.ok) {
  console.error(`Telegram API returned ${res.status}: ${await res.text()}`);
  process.exit(1);
}

console.log(`Notified: ${created.length} created, ${refined.length} refined.`);
