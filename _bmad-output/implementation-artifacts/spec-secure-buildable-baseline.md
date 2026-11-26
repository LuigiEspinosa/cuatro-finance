---
title: 'Secure, buildable baseline before planning'
type: 'chore'
created: '2026-11-26'
status: 'done'
route: 'dispatch'
review_loop_iteration: 0
baseline_commit: '6b89fc86fb5a78f846a7927325006c527039fbe0'
context: ['{project-root}/AGENTS.md']
---

<frozen-after-approval reason="human-owned intent: do not modify unless human renegotiates">

## Intent

**Problem:** This repo never got the fixes its copy in `../cuatro-portfolio/apps/finance` received: `next` 16.1.6 has open advisories, `pnpm lint` is broken under Next 16, `prisma generate` fails without a database, the seed path is wrong, each crypto tamper test flakes one run in 256, and `.gitignore` silently ignores any folder named `test`, `tmp` or similar. Planning should start from a secure tree where every check passes.

**Approach:** Maintenance only, with no feature, UI or behavior change. Eight concerns, one commit each on `main`, each verified with real output before it is committed, then pushed.

**Decisions (owner, 2026-11-26):** One spec for all eight concerns, kept above the 1,600-token guideline. The last task also deletes the now dead "report Types as Blocked when `generated/prisma` is missing" note from both verification-loop layers. This spec is committed last, as a ninth commit `docs(bmad): add the baseline maintenance spec`, and holds no advisory details.

## Boundaries & Constraints

**Always:** Pin `next` and `eslint-config-next` to exactly `16.4.5`. Every other dependency keeps its current range, including `react`, `react-dom` and `@types/node` (stays `^20`). Keep `import "dotenv/config"` in `prisma.config.ts`. Regenerate `pnpm-lock.yaml` with `pnpm install`, never by hand.

**Never:** Open, read, search or list `.private/`. Copy advisory IDs, audit details or anything from the local re-entry assessment into this spec, a commit or any committed file. Cite the portfolio's story or decision IDs in a comment. Run `pnpm dev`, `prisma migrate` or `prisma db seed`. Edit application code (the crypto test is the only file under `lib/` that changes): if the `eslint-config-next` bump surfaces new lint findings, stop and report them. Out of scope: the portfolio's Dockerfile, standalone output, health route, connection-pool cap, migration-ordering test and `provision.sql`; the better-auth upgrade and its migration; renaming `middleware.ts`; every defect fix in the assessment's sections 4 to 6.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Generate without a database | `DATABASE_URL` unset, no `.env` | `prisma generate`, `pnpm typecheck`, `pnpm build` exit 0 | N/A |
| Database command without a URL | `DATABASE_URL` unset | config loads; only a command that needs the database fails | Prisma's own error; no fallback URL in the config |
| Tamper byte already `ff` | last byte of iv, tag or ciphertext is `ff` | XOR makes it `00`; `decrypt` throws `CryptoError` | N/A |
| Folder named `test`, `tests`, `testing`, `temp` or `tmp` | created anywhere | listed as untracked, not ignored | N/A |
| Fresh clone | `.private/` created | ignored by the committed `.gitignore` | N/A |

</frozen-after-approval>

## Code Map

- `package.json`: L5-7 redundant `prisma` block; L16 `lint` is `next lint`; L10 `build`, L15 `typecheck`; L31 `next` and L55 `eslint-config-next` at 16.1.6; L57 `jsdom` (graph: no code edges, `src=package.json loc=L57`).
- `pnpm-lock.yaml`: only `jsdom` depends on `undici`.
- `prisma.config.ts`: L4 imports `env`; L10 seed `tsx prisma/seed.ts` (missing; the real seed is `prisma/seed/admin.ts`); L13 `env("DATABASE_URL")` throws `PrismaConfigEnvError` when unset (reproduced).
- `lib/__tests__/crypto.test.ts`: tamper suite L33-63 overwrites with `"ff"` at L39, L49, L59; it covers `encrypt` (`src=lib/crypto.ts loc=L31`), `decrypt` (L46), `CryptoError` (L18). Reference: `../cuatro-portfolio/apps/finance/lib/__tests__/crypto.test.ts` at `a773c9fb332a1e2f2a0d4f323fe9ad52caa0f09f`, helper at L33-35.
- `.gitignore`: L240-318 is the `### Test ###` section, header comments through `*lol`. None of today's 17 ignored entries depends on it. `.private/` is only in `.git/info/exclude`, which stays untouched.
- `AGENTS.md` L8; `_bmad/custom/bmad-build.toml` L46 (git fact with the verification commands), L87 and L148 (both verification-loop layers); `_bmad-output/planning-artifacts/research/tooling-setup-2026-11-26.md` L99 (section 3.1, item 5).
- Leave alone: `eslint.config.mjs` and `vitest.config.ts` already exclude `.claude/**`; README.

## Tasks & Acceptance

**Execution (in this order; verify the final tree. Each task later becomes one commit, made by the orchestrator after review, so never commit or push):**
- [x] `package.json`, `pnpm-lock.yaml`: set `next` and `eslint-config-next` to `16.4.5`, run `pnpm install`. Clears the next advisories.
- [x] `package.json`, `pnpm-lock.yaml`: remove `jsdom`, run `pnpm install`. Nothing imports it.
- [x] `prisma.config.ts`, `package.json`: seed `tsx prisma/seed/admin.ts`; `url: process.env.DATABASE_URL` with a one-line comment (`env()` throws when unset; generate needs no database); drop the `env` import; delete the `prisma` block.
- [x] `package.json`: `lint` is `eslint .`; `build` is `prisma generate && next build`; `typecheck` is `prisma generate && tsc --noEmit`.
- [x] `lib/__tests__/crypto.test.ts`: port `flipLastByte` (XOR `0xff` on the last byte) with its comment minus the ID, use it in the three tamper cases, and add one deterministic case in the tamper suite asserting that a final `ff` byte becomes `00`.
- [x] `.gitignore`: delete L240-318; add `.private/` under a one-line comment pointing at AGENTS.md.
- [x] `package.json`: add `"engines": { "node": "24.x" }` and the `packageManager` value from Design Notes.
- [x] `AGENTS.md`, `bmad-build.toml`, tooling-setup section 3.1: `pnpm lint` replaces `pnpm exec eslint .`, the "stays broken" remarks go, both verification-loop layers lose the Types-Blocked note, and AGENTS.md L8 lists `pnpm typecheck`, `pnpm test` and `pnpm lint`.

**Acceptance Criteria:**
- Given the final tree and `DATABASE_URL` unset, when `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test` twice, `pnpm lint` and `pnpm build` run, then each exits 0 and both test runs pass all 65 tests (62 today, plus the `ff` case and the two repo-config cases added in review).
- Given the final lockfile, when `pnpm audit --prod` runs, then it lists no `next` advisory, and `pnpm audit` lists no `undici` advisory.
- Given `git status --ignored --porcelain` captured before the `.gitignore` task, when it runs after, then both listings are identical.
- Given the final `package.json`, when it is diffed against `6b89fc86fb5a78f846a7927325006c527039fbe0`, then only the fields the tasks name changed.
- Given the three docs of the last task, when they are searched for `pnpm exec eslint`, then nothing matches.

## Implementation Notes

- Task 1 surfaced five new lint warnings, no errors, on existing code (2 `react-hooks/incompatible-library`, 3 `@next/next/no-location-assign-relative-destination`). Owner decision, 2026-11-26: keep the 16.4.5 pin, accept them, leave app code untouched, and log them in `deferred-work.md`. `pnpm lint` passes with exactly these five warnings; any other new finding still means stop.
- Task 2: `pnpm install` alone kept `jsdom` in the lockfile, because the existing vitest snapshot still resolved its optional `jsdom` peer. A temporary `overrides: { jsdom: "-" }` in `pnpm-workspace.yaml` forced re-resolution and was then removed; `pnpm-workspace.yaml` is identical to the baseline. The lockfile lost `jsdom` and the 32 packages only it used, `undici` among them, and is stable under both plain and frozen installs.
- Otherwise the lockfile changes only the versions that `next` 16.4.5 and `eslint-config-next` 16.4.5 declare (`sharp` 0.35.5, `postcss` 8.5.23, `@swc/helpers` 0.5.23, the `@next/*` packages, `eslint-plugin-react-hooks` 7.1.1), plus five new transitive packages. The newest of all of them was published 2026-11-02.
- `.gitignore`: also dropped the extra blank line that deleting L240 to L318 left behind.
- Matrix audit, final tree with `DATABASE_URL` unset: `pnpm typecheck` and `pnpm build` generate the client and exit 0; `prisma db pull --print` fails with Prisma's own `datasource.url` error before connecting; the `ff` case and the three tamper cases ran and passed; `git check-ignore` matches none of the placeholder names and matches `.private/probe` through `.gitignore`.
- Verification, final tree: frozen install exit 0, and a plain install leaves the lockfile unchanged; tests 63 of 63 on both runs; lint exit 0 with only the five accepted warnings; `vitest list` shows the three `lib/__tests__` files only; `pnpm audit --prod` lists no `next` advisory and `pnpm audit` no `undici` advisory; the ignored listing matches the baseline capture (17 entries); the Build customization still resolves.
- Review pass 1 patches, which supersede the Code Map's "leave alone" note for `eslint.config.mjs`:
  - `eslint.config.mjs` ignores `coverage/**`, `storybook-static/**` and `.private/**`.
  - `.gitignore` lists `.env.test`.
  - New `__tests__/repo-config.test.ts` covers the database-free config load, the seed script path and the committed `.private/` rule; each case fails when its target is broken.
  - `deferred-work.md`'s first entry now has a one-sentence summary.
  - Eight more items went to `deferred-work.md` (D1 to D8 in the triage log).

## Spec Change Log

- 2026-11-26, orchestrator review after completion. Triage rows 19, 20 and 24 now point only at the private record. Two record corrections: on the final tree, `pnpm test` passed 65 of 65 across four files on both runs (the 63 in Implementation Notes predates review pass 1), and the newest package in the lockfile delta is next 16.4.5, published 2026-11-03, not 2026-11-02.

## Review Triage Log

Pass 1 (2026-11-26). Layers: blind-hunter, edge-case-hunter, verification-gap, ponytail-review (no findings: "Lean already. Ship."), ecc-verification-loop (PASS) and security-audit. Design Review skipped: no `.tsx` or `.css` under `app/` or `components/`. Groups: A is lint scope, B is regression checks for the config fixes, D1 to D8 are the deferred-work entries.

| # | Layer | Finding | Verdict | Evidence | Route |
|---|-------|---------|---------|----------|-------|
| 1 | blind-hunter | `eslint .` also lints build output | medium | After `pnpm build-storybook`, `pnpm lint` exits 1 with 356 errors, all in `storybook-static/`; `coverage/` adds a warning (both reproduced). | patch, group A |
| 2 | blind-hunter | `engines.node` only warns under pnpm | low | pnpm warns unless engine-strict is set; the one owner runs Node 24.15.0; enforcing it adds a new guard. | rejected |
| 3 | blind-hunter | `@types/node` stays two majors behind the runtime | low | Real, but the frozen intent keeps `^20`, and the assessment's upgrade order already tracks it. | rejected, out of scope by intent |
| 4 | blind-hunter | Nothing caps the five accepted warnings | low | Warnings never fail ESLint by design; the intent fixes the script as exactly `eslint .`; a cap is a new guard. | rejected |
| 5 | blind-hunter | `@testing-library/react` and `jest-dom` stranded without a DOM | low | No tracked file imports either; the intent keeps every other dependency. | defer, D2 |
| 6 | blind-hunter | README out of date | low | L31 says Next.js 15, L97 lists a missing `test:e2e`, L110 to L115 name a missing service, a missing seed script and a CI that does not exist; all predate this change. | defer, D3 |
| 7 | blind-hunter | README's `.env.local` never reaches the Prisma CLI | medium | `dotenv/config` reads `.env` only; the same setup already failed before, through `env()`. | defer, D4 |
| 8 | blind-hunter | No regression check for the seed path or the database-free config | medium | No test imports `prisma.config.ts`; the wrong seed path went unnoticed for months. | patch, group B |
| 9 | blind-hunter | Build is not a gate | low | The owner's gates are typecheck, test and lint; there is no CI. | defer, D1 |
| 10 | blind-hunter | `deferred-work.md` summary is three sentences | low | The prescribed format is one sentence. | patch |
| 11 | blind-hunter | `prisma.config.ts` header misleads | false | Both packages it names are installed; it leads to no wrong action. | rejected |
| 12a | blind-hunter | No CHANGELOG entry | false | The CHANGELOG is written per release (3 of 45 commits touch it), and this is not one. | rejected |
| 12b | blind-hunter | `package.json` says 0.2.0, CHANGELOG says 0.3.0 | low | Predates this change. | defer, D7 |
| 13 | verification-gap | No clean-checkout build check | low | Pre-verified gap; filed as defer; no CI or deploy job exists. | defer, D1 |
| 14 | verification-gap | Removing the committed `.private/` rule would pass every check | medium | Pre-verified: `.git/info/exclude` also matches, so only a check of the committed file catches it. | patch, group B |
| 15 | verification-gap | Env file mismatch (other) | medium | Same defect as row 7. | defer, D4 |
| 16 | verification-gap | README names things that do not exist (other) | low | Same defect as row 6. | defer, D3 |
| 17 | ecc-verification-loop | Testing-library packages unused | low | Same defect as row 5. | defer, D2 |
| 18 | ecc-verification-loop | Layer skipped build, frozen install, audit, the second test run and a database command | false | The orchestrator ran all of them on the final tree; see Implementation Notes. | rejected |
| 19 | security-audit | Pre-existing security finding, tracked privately | n/a | Outside the eight concerns. | rejected, out of scope by intent |
| 20 | security-audit | Pre-existing security finding, tracked privately | n/a | Outside the eight concerns. | rejected, out of scope by intent |
| 21 | security-audit | Deleting `*test` un-ignored `.env.test` | medium | `git check-ignore` matches `.env.test` at the baseline only through `*test`, and nothing matches it now. | patch |
| 22 | security-audit | ESLint walks `.private/` | medium | `isPathIgnored(".private/probe.ts")` is false, against the AGENTS.md rule never to script over it. | patch, group A |
| 23 | security-audit | Money lint selectors match bare identifiers only | low | `account.balance_centavos + x`, `+=` and `/` pass; predates this change. | defer, D5 |
| 24 | security-audit | Pre-existing finding, tracked privately | n/a | Outside the eight concerns. | rejected, out of scope by intent |
| 25 | security-audit | Unbounded `limit` on the transactions list | low | `Number(searchParams.get("limit") ?? "50")` is used as is; predates this change. | defer, D6 |
| 26 | security-audit | `.env` beats `.env.local` under `prisma db seed` | medium | Same defect as row 7. | defer, D4 |
| 27 | edge-case-hunter | Lint fails after `build-storybook` | medium | Same defect as row 1. | patch, group A |
| 28 | edge-case-hunter | Concurrent generate and typecheck can race | low | Needs two commands at once; the intent puts `prisma generate` in build and typecheck. | rejected |
| 29 | edge-case-hunter | Fresh clone runs dev before generating | low | Predates this change; README's setup runs `pnpm prisma generate` first; the fix adds an install hook. | rejected |
| 30 | edge-case-hunter | Blank `DATABASE_URL` reaches Prisma | false | Prisma rejects an empty `datasource.url` with P1013 before connecting (reproduced). | rejected |
| 31 | edge-case-hunter | `.env` beats `.env.local` under `prisma db seed` | medium | Same defect as row 7. | defer, D4 |
| 32 | security-audit | `.env.development` matches no ignore rule | low | Same before and after this change. | defer, D8 |

## Design Notes

- Commit order puts the `prisma.config.ts` task before the scripts task, because `prisma generate` in `typecheck` fails without a database until the config reads `process.env`. Until the scripts task lands, `pnpm lint` is the script being fixed, so the first three commits use `pnpm exec eslint .` as their lint check.
- `packageManager` carries corepack's integrity suffix, as the portfolio root does: `pnpm@10.34.7+sha512.ba98abc585539933375b5971f4bc6d6c73a1b4b7edc4a879e7d102fe5423d1e02309d67c60a11f04955093a96e521ad9c3b138cdd654ca5be563f378b3ae48bd`, the hex of the registry's `dist.integrity` (the same derivation reproduces the portfolio's 10.31.0 hash).
- `engines.node` `24.x` pins the major (local runtime 24.15.0).

## Verification

**Commands (with `DATABASE_URL` unset):**
- `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm lint`, `pnpm build`: exit 0.
- `pnpm test`, run twice: 65 passed both times.
- `pnpm exec vitest list --filesOnly`: the three `lib/__tests__` files and `__tests__/repo-config.test.ts`, nothing under `.claude/`.
- `pnpm audit --prod`: no `next` advisory. `pnpm audit`: no `undici` advisory.
- `git status --ignored --porcelain`: identical to the capture taken before the `.gitignore` task.
- `git check-ignore --no-index -v test tests testing temp tmp x.foo`: no match. `git check-ignore -v .private/probe`: matched by `.gitignore`, not only by `.git/info/exclude`.
- `pnpm exec prisma db pull --print`: fails with Prisma's own missing-URL error before any connection (read-only; proves there is no fallback URL).

**Manual checks:**
- `prisma/seed/admin.ts` exists and is the seed `prisma.config.ts` names.
