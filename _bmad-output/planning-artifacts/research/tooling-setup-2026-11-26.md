---
title: Tooling setup, reviewed skills and BMAD wiring
date: 2026-11-26
type: research
status: final
inputs: supply-chain reviews and a BMAD wiring recon (9 agents, each finding re-checked by an independent verifier, 2026-11-26), owner decisions of 2026-11-26
---

# Tooling setup: reviewed skills and BMAD wiring (2026-11-26)

This is the work order for the tooling setup session. It records the owner's decisions, the three reviewed skill sources pinned to the commits that were read, how each BMAD workflow gets wired, what gets committed, and how to verify it. One agent read each source in full, and an independent skeptic re-checked it.

## 1. Decisions

Owner, 2026-11-26:

- The three new skills install at project level only, under `.claude/skills/`. That folder stays git-ignored, so they are local to this machine.
- Chrome's modern web guidance: a read-only copy of its guides, never its npm CLI.
- From juliobsz/skills: both skills, jury and awwwards, installed and wired. The review's concern about awwwards was raised: it targets award-style marketing sites with heavy WebGL and scroll effects, which conflicts with the Cuatro contract's motion rules. The owner kept it, and section 2.3 sets the limits that make it safe here.
- An independent Codex review layer runs in Build, gated by path (section 3.1).
- Build commits and pushes to `origin main` itself after a verified change (the single-branch workflow in `AGENTS.md`).

Defaults the owner can overrule:

- Cloudflare's security-audit runs in Guidance mode only (static review). Its full audit mode never runs on this Windows host.
- The portfolio's Operator process facts (planted assertions, the oversized-spec halt, and the like) stay portfolio-only.
- Only `_bmad/custom/*.toml` and `.claude/settings.json` are tracked. The rest of `_bmad/` is installer output: it is regenerated on every install and carries the owner's name, emoji, and dashes, which this public repo avoids.

## 2. Skills to install

For every source: clone it into a new temporary directory outside the repo, check out the pinned commit detached, verify it, copy only what is listed, then compare the copy with the source using `diff -r`. Never use a README's `npx skills add` route: it is unpinned, and its CLI sends telemetry. Never run a downloaded script, except the jury dependency pin in 2.3.

### 2.1 security-audit (Cloudflare)

- Source: `https://github.com/cloudflare/security-audit-skill` at `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`, the tip of main on 2026-09-14 (no tags). The subtree `skills/security-audit` has tree hash `ccbc33ed119b28c3ef7b44a7e2081ab191ad63af`. Check it with `git rev-parse <sha>:skills/security-audit`.
- Copy `skills/security-audit/` to `.claude/skills/security-audit/`.
- What it is: Markdown instructions plus two zero-dependency Node validators. It has no hooks, settings, network calls, or telemetry. Its value here is the business-logic and access-control attack classes: negative, zero, and overflow amounts; precision loss; check-then-act races; rollback after partial failure; timezone logic; and per-item authorization.
- Limits for every wiring entry:
  - Guidance mode only. Read the source; never run target code, never build a sandbox or container, and never change HOME, environment variables, or the user profile. An unverified field report describes an agent on Windows 11 clearing the real user profile while improvising the scratch HOME that full audit mode asks for. On native Windows its validators also reject all input, so full audit mode cannot complete here anyway.
  - Never open `.private/`, and never copy a secret or a private file into a finding.
  - Findings cite file and line and state the required fix.

### 2.2 modern-web-guidance (Google Chrome), read-only

- Source: `https://github.com/GoogleChrome/modern-web-guidance` at `2b4aa13a72dd47cd135b06ce5abfccd92e19b24f` (tag v1.0.2, 2026-11-23). The code is Apache-2.0 and the guides are CC-BY-4.0.
- Copy only `skills/modern-web-guidance/guides/` and the repo's license files into `.claude/skills/modern-web-guidance/`. The guides folder holds about 200 Markdown guides under ui-behaviors, performance, ui-components, visual-design, forms, css, security, ui-atoms, html, js, and built-in-ai. Do not copy the upstream SKILL.md, and never run the npm CLI.
- Why read-only. As shipped, every web task runs `npx -y modern-web-guidance@latest`, which is new, unreviewed code with each weekly release. Its telemetry sends the agent's search queries to Google by default, and its description says it is mandatory for every HTML, CSS, and JS task. Pinning the skill text does not fix this, because 70 of the guides still tell the agent to run the `@latest` CLI.
- Write a new `SKILL.md` in that folder, in the house style (no dashes, no emoji):
  - Frontmatter: `name: modern-web-guidance`. The description is scoped to this repo: modern web platform patterns from Chrome's guides (Baseline features, accessibility, performance, forms, CSS), read locally, for designing or building UI here.
  - Body: find a guide by running Grep with a feature keyword over the `guides/` folder, read the match, then apply its pattern and its fallback. When a guide says `npx ... retrieve <id>`, read the guide with that id from the folder instead; never run npx for this skill. On visual matters, the Cuatro token contract and the project's design documents win over any guide. Paraphrase guides rather than quoting them, since they contain dashes. Credit the source, its commit, and its licenses.
- In `.claude/settings.json`, deny Bash commands that run the modern-web-guidance package through npx or pnpx. Check the rule syntax against the Claude Code settings docs (the update-config skill covers them), and check whether deny rules still apply in the permission mode this machine runs.

### 2.3 jury and awwwards (juliobsz/skills)

- Source: `https://github.com/juliobsz/skills` at `add880bd6ec9f5592a1482846fc0dd282c9161bc`, main on 2026-10-26. It is MIT-licensed, with a single maintainer and unsigned commits.
- Copy `jury/` to `.claude/skills/jury/` and `awwwards/` to `.claude/skills/awwwards/`, and copy the repo's `LICENSE` into each, since neither folder has its own. `diff -r` against the source should show only the added LICENSE in each.
- Pin the QA dependencies both skills use, once, outside the repo. In `~/.cache/jury`, run `npm init -y`, then `npm i -D --save-exact playwright@1.64.0 axe-core@4.14.0`. The scripts fall back to an installed Chrome or Edge, so download Chromium (`npx playwright@1.64.0 install chromium`) only if neither is found. Then, in both copied `SKILL.md` files, replace the unpinned install lines (jury around line 57, awwwards around lines 133 and 134) with a note to reuse `~/.cache/jury` and never rerun `npm i` there or in the project.
- In `.claude/settings.json`, give both skills name-only visibility (`skillOverrides`), so neither fires on its own but BMAD can still call them by name. This matters most for awwwards. Its description triggers on "premium", "immersive", and redesign requests and tells the agent to ship without asking questions, which would hijack the BMAD UX flow for this very redesign. Check the key against the settings docs. If the key does not exist, install both under `.claude/skill-library/` (git-ignored) instead, and have the wiring read them by path.
- Limits for every jury wiring entry:
  - Serve or start the app bound to localhost only (`pnpm start -p 4400 -H 127.0.0.1`), and stop the server when the run ends.
  - Write evidence only to `.jury/` and `.shots/`. Never point `--out` at a folder holding real images: it deletes the `.png` files there.
  - Report only. Skip its closing offer to fix or redesign the project.
  - Its scores are evidence, never a gate. The rubric is tuned for award sites and rewards decorative motion.
  - It cannot sign in, so it covers the auth pages, a static Storybook build, and UX mockups.
- Limits for every awwwards wiring entry:
  - Scope: public showcase surfaces only, such as a landing page or the entry to the public demo. Never the signed-in data screens.
  - The Cuatro contract wins on every conflict. Only transform and opacity animate, durations come from the tokens, and prefers-reduced-motion is honored. There is no parallax, bounce, overshoot, infinite loop, or gradient. The contract's three typefaces and dark tokens replace its palettes and font picks.
  - Never scaffold (`create-next-app`, `create astro`): the app exists. Never run npm in the project. A story that needs gsap, lenis, or ogl adds them inside a Build story with `pnpm add --save-exact` at a reviewed version, and never creates `package-lock.json`.
  - Never write the `DESIGN.md`, `src/data/site.ts`, or `src/engine/**` it asks for: `DESIGN.md` belongs to BMAD's UX step, and the repo has no `src/`. Concept and art direction go to a named file in the UX workspace (for example `awwwards-concept.md`), and engine code follows the layout the architecture sets.
  - Never install or invoke `wheresryan22/anatomy` or any other skill it suggests. They are unreviewed.
  - Never deploy (vercel, netlify, wrangler), never serve to the network (`npx serve` binds to every interface; use 127.0.0.1), and never run an unpinned `npx lighthouse`.
  - Never run `font.mjs`, since the contract ships its own fonts. Run `photos.mjs` and `og.mjs` only inside a showcase Build story, with output in `.photos/` and the paths the story names.
  - Privacy: its brief phase reads memory and project files to write public copy. Never read `.private/` or the re-entry assessment for that, and use fictional figures with no personal details.

## 3. BMAD wiring

Mechanics in BMAD 6.12.0:

- Overrides live in `_bmad/custom/<skill>.toml`, the team layer, which is committed. Never edit `.claude/skills/*/customize.toml`: each says DO NOT EDIT and is overwritten on every update.
- Merge order: the skill's `customize.toml`, then the team file, then `<skill>.user.toml`. Tables merge key by key, and scalars are replaced. Arrays of tables merge by `code` or `id` when every item carries one; other arrays append (`_bmad/scripts/config_utils.py`).
- Check each file with `uv run _bmad/scripts/resolve_customization.py --skill .claude/skills/<skill> --project-root . --key workflow`.
- The deprecated aliases (`bmad-create-prd`, `bmad-edit-prd`, `bmad-validate-prd`, `bmad-create-architecture`) pass their own resolved values and skip these overrides. Always invoke the canonical skills.

### 3.1 bmad-build

Stamp `_bmad/custom/bmad-build.toml` with the `wire-bmad-build` skill (`~/.claude/skills/wire-bmad-build/`), following its Parts A to E, then apply the corrections below. The portfolio's live copy at `../cuatro-portfolio/_bmad/custom/bmad-build.toml` is the evolved reference, but its Operator facts do not carry over.

1. Replace every `{diff_output}` with `{diff_file}`. Since the 2026-09-25 BMAD update, review layers get a path to a diff file; the asset and the portfolio still carry the stale placeholder.
2. Custom `review_layers` run only on Build's full route. Add the same layers to `oneshot_review_layers`, worded for the working tree, since the oneshot route stages no diff file and runs no tests.
3. The implementer starts with no context and never sees `persistent_facts`. Any skill call it must make goes into `implementation_handoff` as one conditional paragraph:
   - for motion, invoke animate first;
   - for type, or hover, focus, and press states, read `~/.claude/skills/apple-design/SKILL.md`;
   - for viewport, inputs, or touch, read mobile-native;
   - for charts, use dataviz;
   - for a UI pattern or its fallback, read the matching modern-web-guidance guide;
   - for a new screen, use frontend-design, ranked below the UX step's `DESIGN.md` and the token contract;
   - for a public showcase surface, read the awwwards references (engine, nextjs, webgl, patterns) within the section 2.3 limits.
4. Facts: `main` is the only branch, so never stop on a branch mismatch. After a verified change, commit with a Conventional Commit subject line only and push to `origin main`, with no PR (`AGENTS.md`). Before pushing, re-run the verification commands on the final tree.
5. Verification commands: `pnpm typecheck`, `pnpm test`, and `pnpm exec eslint .`. The `lint` script stays broken until the code sync step fixes it.
6. In verification-loop's secret scan, use `git grep -l` over tracked files and report file names only, never matching lines.
7. The Cuatro token contract's motion durations win over the motion skills' defaults of under 300ms (the contract's `--dur-major` is 420ms).
8. Host-provided skills (dataviz, the built-in security-review) may be missing in headless runs. Every fact and layer that uses one says to skip it with a note.

Review layers, gated with `when` so that one run does not start eight review subagents:

- ponytail-review: always.
- ecc-verification-loop: always.
- Design Review: apple-design, review-animations, and mobile-native, all read by path, plus the modern-web-guidance guides recorded in the spec's Design Notes. Runs when the diff touches `app/`, `components/`, or any CSS file.
- security-audit, Guidance mode only (section 2.1). Runs when the diff touches `middleware.ts` or `proxy.ts`, `lib/auth.ts`, `lib/auth-client.ts`, `lib/api-auth.ts`, `lib/crypto.ts`, `lib/db.ts`, `lib/db/`, `lib/money.ts`, `lib/validators/`, `app/api/`, `app/(auth)/`, or `prisma/`.
- codex-review: the same path gate as security-audit. The codex review commands are disable-model-invocation, so the layer calls the companion through its installed path.

### 3.2 bmad-code-review

Graphify in activation, and the same layers as 3.1 (ponytail-review, Design Review, security-audit, codex-review). For Codex, map the diff source: `--scope working-tree` for uncommitted changes, and `--base <range start>` for a commit range. Check that the native reviewer accepts a commit SHA.

### 3.3 bmad-review

Its lens subagents are told never to invoke a skill, so each lens reads its method by path:

- accessibility: plain text, WCAG 2.1 AA;
- ponytail: the ponytail-review SKILL.md;
- security: security-audit's attack classes, in Guidance mode;
- modern-web: Grep over the guides folder, never the upstream legacy-scan.

### 3.4 bmad-ux

- persistent_facts: the visual source of truth is the Cuatro design contract (`../cuatro-portfolio/contracts/`) together with the portfolio's UX spines. Read the sections a task needs rather than whole files. The UX step's prompt names the exact inputs.
- creative_tools: frontend-design and dataviz, plus awwwards for the concept and art direction of public showcase surfaces only, within the section 2.3 limits. external_sources: the modern-web-guidance guides.
- finalize_reviewers: apple-design and mobile-native (read by path), and jury on mockups served on 127.0.0.1, within the section 2.3 limits.

### 3.5 bmad-architecture

Graphify in activation. external_sources: the modern-web-guidance guides, which also inform a browser-support policy the architecture should state. finalize_reviewers: security-audit in Guidance mode.

### 3.6 bmad-create-epics-and-stories

persistent_facts: every UI story names, in its spec, the design skills and guides its implementer needs. The spec is how they reach Build's implementer (3.1, item 3).

### 3.7 bmad-qa-generate-e2e-tests

persistent_facts:

- Vitest 4 runs in the node environment, with tests in `lib/__tests__/`. jsdom and Testing Library are installed but unused, so a component test opts in with a per-file environment comment.
- Use the e2e-testing and ai-regression-testing skills.
- `.gitignore` carries boilerplate patterns (`*test`, `*tests`, `*tmp`, `*temp`) that silently ignore any folder named `test` or `tests`. A new e2e folder needs a different name, or the code sync step fixes `.gitignore` first.

### 3.8 bmad-prd

finalize_reviewers: product-lens, so the PRD step's reviewer gate offers it.

### 3.9 Later, not now

- bmad-project-context: graphify, when it runs after the code sync step.
- bmad-retrospective: a persistent fact, not `activation_steps_append`, which runs before the epic is fixed. After Phase 1 fixes the epic and its diff, run ponytail-audit, click-path-audit, and security-audit in Guidance mode on the epic's files.
- bmad-sprint-planning: nothing.

## 4. Commits

Each lands on `main` with a subject line only, then `git push origin main`.

1. `chore(bmad): track bmad overrides and ignore installer output`.
   - `.gitignore` gains `.claude/skills/`, `.claude/settings.local.json`, `_bmad/*` with `!_bmad/custom/`, `/graphify-out/`, `.jury/`, `.shots/`, and `.photos/`.
   - Track `_bmad/custom/.gitignore` and `_bmad/custom/config.toml`. `_bmad/custom/config.user.toml` stays ignored by `_bmad/custom/.gitignore`.
2. `chore(bmad): wire reviewed skills into bmad workflows`: the new `_bmad/custom/*.toml` files and `.claude/settings.json`.

## 5. Verification

Paste real output for each check.

- The resolver output for every overridden skill, showing the merged values.
- wire-bmad-build Part E, including its headless probe, plus one more probe question: does a fresh session's context contain the rule about `.private/finance-guide.docx.md`?
- Each install's commit or tree-hash check, and its `diff -r` result.
- `git check-ignore -v` for `.claude/skills/jury/SKILL.md`, `.claude/skills/awwwards/SKILL.md`, `_bmad/config.toml`, and `.private/finance-guide.docx.md`, plus a clean `git status` after commit 2.
- That a plain request such as "redesign the login page" in a fresh session does not load awwwards or jury on its own.
- A dash and emoji scan of every file written into the repo.

## 6. Evidence

The full reviews and verifier reports, one JSON result per agent, are in `~/.claude/projects/C--CuatroEcosystem-cuatro-finance/2fbe48b3-db37-41f3-b0e8-b4cfbab009e2/subagents/workflows/wf_fcfba5b9-602/journal.jsonl`. That file holds the complete per-skill wiring text this work order condenses.
