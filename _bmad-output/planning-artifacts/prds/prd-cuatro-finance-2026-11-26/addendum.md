# Addendum: Cuatro Finance PRD

Companion to `prd.md`. It holds what the downstream steps need but the PRD should not carry: the reference key, the decision record with rejected alternatives, technical choices for the architecture step, the upgrade plan, the deferred maintenance list for the epics step, Colombian rules research for later features, notes for the UX step, and sizing. The privacy and security rules of `prd.md` §7.1 apply here too. Amounts use es-CO format: a period for thousands and a comma for decimals.

## 1. Reference key

Positional IDs used in `prd.md`, `.memlog.md`, and this addendum. All refer to the local re-entry assessment of 2026-11-25 unless stated otherwise.

- **S3-NN**: the NN-th item of assessment §3: its table rows in order, with the coverage row and the build row each split in two (01 to 09), then its four bullets, with the CI, container image, and composed service clause split in three (10 to 15). The open items map to NFR-10 and FR-17 (S3-05), NFR-10 (S3-06), U6 (S3-08), FR-16 (S3-09, S3-12, S3-13), FR-17 (S3-11), and FR-13 (S3-14).
- **S5-NN**: the NN-th row of the assessment §5 table (built versus planned).
- **S8-NN**: the NN-th line of assessment §8, in order: keep 01 to 08, cut 09 to 17, replace 18 to 21, add 22 to 43.
- **F7.1-NN, F7.2-NN**: the NN-th finding of assessment §7.1 and §7.2.
- **U0 to U7**: the upgrade steps of assessment §4, in order (§4 below).
- **Decision N**: the N-th owner decision of assessment §9.
- **Deferred item N**: the N-th entry of `_bmad-output/implementation-artifacts/deferred-work.md`.
- **Guide phase N**: the N-th phase of the original plan's build order (private file, never quoted).
- **T-NN and reviewer IDs**: T-NN is a theme of the reviewer gate, listed with its title, ruling, and source findings in `review-themes.md` in this folder and ruled in `.memlog.md`. A reviewer ID such as scope F14, adversarial M4, or domain D-14 is that review file's own finding ID.

## 2. Decision record

### 2.1 Assessment §9 decisions

Decision 9 was settled before the session: Cuatro Finance is a standalone public repository with a single branch, `main`.

| Decision | Ruling | Why | Rejected |
|---|---|---|---|
| 1. Who is it for now | A daily personal tool first | The owner never used it, and the core never worked end to end (assessment §5). MCP connectors are now table stakes (F7.2-01). | Showcase first, which would pull a separate demo deployment forward |
| 2. Capture without bank sync | Owner-supplied capture: conversation with Claude, statement files, manual entry | No bank sync provider covers Colombia (F7.1-01, F7.2-11); open finance will not reach a personal app in this horizon (F7.1-02) | Belvo (Brazil and Mexico only in 2026, about USD 1.000 a month for real data); bank alert email ingestion, deferred as a new inbound path of medium effort |
| 3. Instruments | Savings accounts in COP and USD, credit cards with cuotas, a mortgage, crypto, other loans | The owner's answer | AFC or FPV, listed stocks and ETFs, CDTs (out of the MVP) |
| 4. LLM use | Claude is the only model; the app calls no LLM API | The Vision already shares the data with Claude by design; amounts stay deterministic (F7.2-13) | Server-side LLM categorization and PDF extraction, which add a second data path and a stored key |
| 5. Alert channel | Email for time-sensitive alerts plus an optional digest, carrying no figures | Claude cannot start a conversation, and the app is desktop first | Web Push first (S8-19 assumed a phone-first app); Telegram (S8-41) |
| 6. Tax features | After the MVP | A tax reform bill filed 2026-10-29 may change the rules (F7.1-09) | Tax features in v1 |
| 7. Hosting | One small VPS; first deploy after the baseline; a returning demo is a separate deployment with its own database | Claude reaches the AI connection over HTTPS; Redis and n8n drop out, so the footprint shrinks | Managed hosting was not evaluated; the architecture step may revisit within NFR-12 |
| 8. Fix first | Yes, with the security, defect, build, upgrade, and backup work of `prd.md` §5.1 | The assessment's own recommendation | Features first |

### 2.2 Feature walk rulings by area

- **A. Accounts, transactions, capture.** One import flow with saved column mappings and duplicate review; XLS and CSV first, OFX only if an account offers it. Formats are described generically, with any real institution names in a git-excluded note. The owner unlocks PDFs before Claude reads them. Own-account transfer matching is in; one feed with search and filters is in. Rejected: tags and split transactions (deferred).
- **B. Categorization.** Category management with rules as data and a review queue; seed rules corrected.
- **C. Budgets and goals.** Monthly budgets per category with a threshold; budget history; goals and sinking funds. Rejected: weekly or custom periods and rollovers.
- **D. Debt and payments.** A deterministic payment plan from the original plan's rules, and payment scenarios. Rejected: the constraint solver (S8-15) and the original plan's rule to pay before the statement closing date, since the payment plan works to each payment due date and card interest terms come from each card's statement terms.
- **E. Cash flow and recurring.** The 90-day forecast with confidence levels, the recurring calendar with Colombian holidays, and subscription detection with an owner-only unwanted flag. Rejected: unusual-charge detection and a daily briefing (deferred).
- **F and G. Net worth, dashboard, reports.** The dashboard, daily balance snapshots, one spending report. Rejected: open-data benchmarks and the Sankey report (deferred).
- **H. The AI connection.** Write access with guardrails instead of the read-only connection the assessment recommended (S8-20, S8-35); conversational capture; honest tool descriptions instead of a stored requests list. Rejected: MCP Apps widgets (deferred).
- **I. Security and access.** Rejected for the MVP: passkeys and app lock, deferred to the phone surface.
- **J. Redesign.** Satellite adoption of the Cuatro design contract; meaning without hue; the owner's no-dash rule governs UI text; desktop first within the 360px floor; Spanish UI.

### 2.3 Reviewer gate rulings

Rulings that shape the steps below (the rest are in `.memlog.md` lines 80 to 85):

- **T-01. Release 1.** A binding Release 1, the working ledger (§8), with launch at its first deploy and a go/no-go of one reconciled statement cycle per account before the planning features. Rejected: keeping the release order a suggestion, and a smaller Release 1 on patched screens with the redesign moved later.
- **T-02. Owner confirmation.** Account terms and closing balances that Claude enters wait for the owner's confirmation in the app; other writes stay immediate, logged, and undoable. Rejected: provenance alone, a split write scope, and an MCP Apps confirmation view.
- **T-04. Grant lifetimes.** An absolute lifetime of 30 days for write grants and 90 for read grants (§3.3). Rejected: no absolute lifetime beyond the 30-day unused rule.
- **T-05. Provider exposure.** What the AI provider receives is recorded as an owner decision (`prd.md` §7.1), and spreadsheet imports are preferred over PDFs. Rejected: per-format PDF parsing in the app, which reopens decision 4.
- **T-07. One currency per account.** A card's USD side is its own linked USD card account, and each crypto asset has its own crypto account (§3.6). Rejected: sub-balances in several currencies or assets inside one account.
- **T-08. Cash.** A cash withdrawal posts as spending under a seeded cash category; per-purchase cash tracking is deferred. Rejected: a cash account type, which reopens decision 3's list.
- **T-09. Subscription detection.** It starts once the ledger holds six months of history; until then a subscription is a recurring event. Rejected: detection from launch.

## 3. Technical choices for the architecture step

The facts in this section were verified on 2026-11-25 (assessment §7 and §10). This landscape moves monthly, so the architecture step re-checks any fact it builds on, especially package versions and peer floors, Claude's authorization behavior and its rollout of the 2026-07-28 spec, and data-source endpoints.

### 3.1 Hosting and deployment

- One small VPS. The original plan sized a 4 vCPU, 8 GB ARM VPS for the app, a worker, the database, and n8n; without n8n and Redis, a smaller host may do.
- Containers for the app, PostgreSQL, and the job runner as its own process, behind a reverse proxy with automatic HTTPS (the plan used Caddy, as other Cuatro projects do). The current proxy configuration does not route to the app (assessment §5), so it is replaced, not reused.
- The database and the job runner sit on a private network (FR-6). Migrations run on deploy. A health check endpoint backs the external uptime monitor (NFR-11).
- When the demo returns, it is a separate deployment with its own database, and only it may ever expose a no-auth connector, with per-IP and global rate limits and result-size caps (F7.2-06). The returning demo refuses every write in one central layer, never through per-route checks.
- Before the VPS work, a local capture-loop check runs the AI connection on a local instance with a fictional ledger, driven from Claude Code (T-01, `prd.md` §10).
- Design input (T-27, `prd.md` §5.1): sign-in, TOTP, and authorization attempts are limited per account and per source, and repeated failures raise an alert that cannot be turned off.
- Open for this step (T-31): which endpoints Claude's connector service calls; whether its source addresses are published, so the connector path could be allowlisted; and whether the screens could be reachable only from the owner's devices, for example over a private network on a free tier, within NFR-12. Until T-31 is settled, decision 7's wording stands.

### 3.2 Job runner

- Replace BullMQ and Redis (S8-18). Candidates: pg-boss (MIT) on the existing PostgreSQL, or a single scheduled runner. The pg-boss option covers cron, retries, dead-letter queues, and enqueueing inside a Prisma transaction, and needs Node 22.12 or later and its own connection string (F7.2-09). BullMQ's PostgreSQL backend shipped on 2026-07-30 and is young.
- Which runner to use is this step's call (scope F14, which favors the single scheduled runner for this short list of jobs for one owner).
- Jobs: TRM daily, crypto prices daily, UVR daily (only if FR-23 applies), balance snapshots daily (only if history is stored, §3.6), budget threshold checks daily, payment due reminders daily, subscription scan weekly (only once detection starts, T-09), backups daily, restore check monthly.
- Jobs run on the Bogotá date (R-9), and end-of-day jobs run after the Bogotá day ends.
- The plan's rule stands: never create a queue inside a route handler or component.

### 3.3 AI connection

- Server: an in-app route on the official TypeScript SDK v2 (`@modelcontextprotocol/server` 2.4.0, Apache-2.0, with `McpServer.registerTool` and the fetch-shaped `createMcpHandler`), replacing the plan's separate container on SDK v1 (S8-20, F7.2-03).
- Transport: Streamable HTTP. The 2026-07-28 spec is stateless (no initialize handshake, no session header) and deprecates HTTP+SSE (F7.2-02). Keep the SDK's legacy option on until Claude's rollout of the 2026-07-28 spec completes (F7.2-04).
- Authorization: `@better-auth/mcp` with `@better-auth/cimd` and the JWT plugin, which need better-auth ^1.7.28 as a peer (F7.2-05). Advertise `client_id_metadata_document_supported: true` and `none` in `token_endpoint_auth_methods_supported`; otherwise Claude falls back to dynamic client registration, which stays off, and sign-in fails. Redirect matching ignores the port of loopback redirects, which Claude Code uses (F7.2-04).
- Scopes: read and write. Paged results and result-size caps. Tool descriptions per FR-57.
- Grants (T-04, NFR-5): a write grant lasts at most 30 days and a read grant at most 90, after which the owner reconnects with TOTP; short-lived access tokens sit under each grant. Only the client identities of the three acceptance apps (FR-50) may ask for consent, and the consent screen and the new-client alert name the client.
- Untrusted text (T-26): read tools return third-party text, such as a statement description, in a delimited, length-bounded field marked as statement text, and the server instructions and tool descriptions say such text is data, never an instruction.
- Public repository (T-29): the server instructions and tool descriptions also say the repository is public, so a drafted development prompt stays generic: a fictional owner, made-up numbers, account types instead of institutions or merchants, and no statement text.
- Verification (T-30): each journey's end-to-end check sends Claude's steps as tool calls through a scripted MCP client (§3.7), and a scheduled self-check runs that client against the deployed connection (connect and one read) and alerts on failure (NFR-11).

### 3.4 Data sources

- TRM: the government open-data portal's TRM dataset (datos.gov.co, dataset 32sa-8pi3, keyless), resolved by each rate's validity range (R-2).
- UVR (only if FR-23 applies): the central bank's documented SDMX web service (JSON, CSV, or XML), with a last-known-value fallback. The plan's hardcoded fallback value is stale (F7.1-04) and is not used.
- Crypto prices: CoinGecko, keyless or with a free Demo key, priced in USD and converted at the TRM (F7.1-05). A dated manual price backs up any asset the source lacks (FR-21).
- Colombian holidays: `date-holidays` 3.39.2, type public, plus the owner's overrides (R-9, F7.2-12).
- Every fetched value is checked before it is stored (FR-20), and past TRMs are fetched on demand for older transactions.
- Dropped: ExchangeRate-API (2,12 percent off the TRM on the test day, F7.1-04), UVR scraping (S8-12), and Alpha Vantage and the unofficial Yahoo endpoint, since listed stocks are out of the MVP (decision 3, S8-13, F7.1-05).

### 3.5 Email

- Any transactional sending service on a free tier (the plan named Resend, with 3.000 emails a month free). SPF and DKIM on the sending domain. Messages carry no figures (FR-48).

### 3.6 Money layer and data model notes

- BIGINT minor units with decimal.js at precision 20 and half-even rounding, as the plan specified.
- Crypto quantities need a column with enough scale for each asset; the plan's (20, 8) cannot hold an asset with more than 8 decimals (S5-01 shows that today's money layer rounds sub-centavo amounts to zero).
- Explicit precision for rates and UVR units; the plan used (20, 6) for UVR balances and exchange rates.
- Dates are Bogotá calendar dates (R-9).
- One currency per account (T-07): a card's USD side is its own USD card account, linked to the COP card and sharing its dates, and each crypto asset is its own crypto account.
- Crypto cost basis is the average cost per asset, in COP (FR-21, verification V-21).
- Debt terms on the liability account itself, instead of the scaffold's separate debt record, which has an untyped account reference, a misspelled enum, and no rate basis (assessment §5).
- Loan and mortgage installments split into principal and interest by their schedules (FR-26, FR-37).
- Budgets are scoped to the owner like every other record (FR-4). The precomputed CashFlowPoint table is dropped: the forecast is computed on request and cached only if measured slow (S8-16).
- Balance and budget history (FR-34, FR-46) reflect the ledger, late-dated writes included; whether that history is stored and recomputed or computed on read is this step's call (T-21, scope F4).
- One compute engine serves both the payoff comparison (FR-38) and payment scenarios (FR-40), which stay two requirements (scope F7).
- Remove the Belvo columns (S8-09). Transfers become linked pairs (issue 35).
- Field encryption stays available for any stored secret, though the MVP plans none, since only a masked account number is stored (FR-7, FR-18).
- Candidate patterns from the original plan: one data access layer that every read and write goes through, which is the simplest place to enforce owner scope (FR-4), field rules (FR-5), and the audit log of every write (A-10); and one parser per statement file format, each returning the same row shape.

### 3.7 Testing

- Vitest unit tests for the money layer, installment schedules, the payoff comparison, the payment plan, payment scenarios, the forecast, categorization, subscription detection (once it starts, T-09), parsers, transfer matching, and UVR if it applies, with the money math checked against fixtures computed outside the code (NFR-10).
- Integration tests for auth, import, alerts, every write tool, and every API route (FR-4, FR-5, FR-9, FR-10).
- One Playwright end-to-end check per journey, with a test authenticator for TOTP (the plan used otpauth). Each check drives the screens and sends each Claude step as its tool calls through a scripted MCP client, asserting tool responses and stored state, never Claude's wording (T-30).
- Claude's own steps are a recorded manual check per app (FR-50), per release and after a connector change (T-30).
- Fictional fixtures only: the plan's parser tests used samples from real exports, which a public repository cannot hold.

### 3.8 Security notes for design

- Threat statement (T-26): third-party text, such as a statement row or a description, is untrusted data, and it can return through read tools in a later conversation. The write tools are bounded (FR-54), but a disclosure cannot be undone, and undo protects integrity only when the owner sees the change. §3.3 sets how read tools return such text.
- Tool responses never carry full account numbers or secrets (FR-52). The audit log is owner-only and part of the export (FR-15).
- Sessions follow NFR-4; connected clients follow NFR-5; attempt limits are in §3.1 (T-27).

### 3.9 Operations

One person runs the app (adversarial M4). The recurring work is the owner's: dependency upgrades and advisory triage under NFR-6, the restore checks (FR-15), the FR-63 recovery drill, and each account's statement import every month. The architecture step keeps the stack small enough for one person to run.

## 4. Upgrade plan

The steps follow the order of assessment §4. Run typecheck and tests after each step, and adopt a release only after it has been public for 7 days (NFR-6). A package nothing uses is deleted, never upgraded (scope F15): U3 waits until its shadcn and storybook question is settled, and the unused testing-library packages (deferred item 3) are removed before the upgrade steps, to return only with component tests.

- **U0.** Unarchive the repository. Done 2026-11-26.
- **U1.** next and eslint-config-next to 16.4.6 (exact pins); react and react-dom to 19.3.1. Next.js is at 16.4.5 today.
- **U2.** better-auth to 1.7.28, the version whose MCP and passkey packages are usable (they need ^1.7.28 as a peer). This closes the auth part of issue 36.
  - The two-factor table gains three columns, so a migration is required, and the enable call's response type changes, which breaks a type in the TOTP setup form. Both the schema change and the type break were found by reading the published packages, and typecheck confirms them during U2.
  - Without the migration, TOTP verification can fail for the owner, so a backup and a passing manual restore check come first (FR-15; `prd.md` §10).
- **U3.** Dev tooling: storybook 10.6.9, vite 7.3.8, vitest 4.1.12, zod 4.6.7, shadcn 4.23.1; jsdom is already removed. This closes the vite part of issue 36. Since the redesign builds the contract's vocabulary natively (FR-58), the architecture step decides whether shadcn and storybook stay at all.
- **U4.** prisma, @prisma/client, and @prisma/adapter-pg to ^7.10.1. Never install @latest here: npm's latest tag for prisma points at an 8.0.0 release candidate.
- **U5.** Node 24 LTS is already pinned in engines and packageManager; align @types/node with it.
- **U6.** Rename middleware to proxy, the Next 16 convention, which clears the build warning in assessment §3.
- **U7, deferred.** One at a time: ESLint 10 (ESLint 9 reached end of life on 2026-08-06), then Vitest 5 (Node 22.12 or later), then Vite 8. TypeScript 7 (typescript-eslint does not support it yet) and Prisma 8 (still a release candidate) wait.
- **React Compiler.** Two of the five accepted lint warnings (deferred item 1) have no runtime effect only while the React Compiler stays off, so enabling it waits until those two forms are patched or replaced.

## 5. Deferred maintenance items for the epics step

From `deferred-work.md`, numbered in its order:

1. Five lint warnings from eslint-config-next 16.4.5, which the owner accepted as warnings on 2026-11-26 (lint still exits 0): two on existing forms and three on post-sign-in redirects. Fixing them changes form re-rendering and post-sign-in navigation, which the maintenance spec ruled out. NFR-10 allows exactly these five until the code carrying them is patched or replaced.
   - Decision 8 put them in the fix-first scope and left patching or replacing the screens to the epics step, leaning replace; the transaction form is already baseline work through FR-11.
   - One of the three redirects sits in shared sign-in client code, not in a screen, so rebuilding the screens does not clear it: it is a task of its own. Every redirect change is accepted against the UJ-1 and UJ-2 end-to-end checks.
   - The two form warnings have no runtime effect only while the React Compiler stays off (§4).
2. A clean-checkout frozen-lockfile install plus build as a gate: now FR-17, which runs it on every push, and FR-16, which requires it. It stays out of the pre-push checks on purpose. It matters because the generated database client is not committed, so only a clean tree shows a missing generate step.
3. Remove the unused testing-library packages, or bring back a DOM test environment when component tests are planned (ruled in §4).
4. Bring the README in line with the repository: it describes a framework version, scripts, services, and deploys that do not exist, and it never lists the lint command. The updated README documents every check run before a push, lint included (NFR-10). FR-14 covers the README's sign-in part as baseline.
5. Make the Prisma CLI, the seed, and Next.js read the same env files with the same precedence. Today, with only the env file the README's setup creates, the migration CLI finds no database setting, and with both files the seed reads its settings from a different file than the app. The maintenance spec kept the current loader on purpose. Schedule this with item 4 and with FR-2's provisioning path, and decide the deploy's env source in the same change, since migrations run on deploy (§3.1).
6. Extend the money arithmetic lint rule to member expressions, compound assignment, and division: now NFR-1. No such code exists today, which makes the extension free now; it lands before the first story that adds money arithmetic (`prd.md` §10).
7. Bounded page size on list requests: now FR-9, baseline (raised at decision 8). A value out of range is brought into range rather than refused, as the item asks, and a request without one gets a fixed default.
8. Align the package version with the CHANGELOG's latest release.
9. Whether `.env.development` is ignored: resolved, since every env file except `.env.example` is ignored.

## 6. Colombian rules research for later features

General legal and market facts from assessment §7, verified on 2026-11-25 and kept for the deferred features. None describes the owner's own position. Re-check each one before a deferred feature relies on it, notably the tax reform and the holiday-law challenge (R-9, F7.2-12). A fact the domain review could not confirm, or found incomplete, carries a re-check note naming its finding (D-14 to D-16).

- **R-12** (moved from `prd.md` §4): for the deferred tax features, every threshold is keyed by tax year and that year's UVT (F7.1-09, F7.2-14). UVT 2026 is COP 52.374 (2025: COP 49.799). Re-check at the source how a UVT amount converts to pesos: D-15 reads the statute as setting its own rounding, not NFR-1's half-even.
- The income tax filing test on assets uses gross assets on 31 December (patrimonio bruto, debts not subtracted) against 4.500 UVT, among other tests. Re-check at the source which TRM values a foreign-currency asset at year end: D-15 reads the statute as using the TRM of its initial recognition, not the year-end TRM that FR-46 records; the locked rates support either.
- GMF (4x1000): the exemption of 350 UVT a month applies, provisionally, to one marked account per holder (Consejo de Estado, 2026-04-06). Re-check the ruling at the source (D-16).
- AFC and FPV benefits carry a yearly cap of 3.800 UVT and a 10-year clock, so contributions belong in dated lots. Re-check at the source, including the general limit on exempt income and deductions that D-15 places these caps inside.
- The original plan also limited the AFC benefit to 30 percent of yearly income. When the AFC projection returns, both that limit and the yearly UVT cap apply, verified against the law in force then, including the general limit that D-15 names.
- The 1 percent e-invoice deduction (cap 240 UVT a year) needs an electronic sales invoice naming the buyer, paid electronically, and not used as a cost, deduction, or deductible VAT. Invoices usually arrive as a ZIP whose AttachedDocument container must be unwrapped; the CUFE identifies each one.
- The CARF crypto reporting rules make year-end COP value and per-asset cost basis the useful crypto outputs. Re-check which year-end value the income tax return takes: D-15 reads it as the tax cost, not the market value.
- A tax reform bill filed on 2026-10-29 may change personal income rules. Re-check at the source (D-16).
- DTF stops being the credit reference rate on 2027-01-01, replaced by IBR. Re-check the date at the source (D-14), and how IBR is quoted: D-14 reads it as a nominal rate per tenor, so R-3 would need a conversion rule when indexed loans return.
- Open finance became mandatory by decree in April 2026, but the regulator's schedule moved to April 2027, and data receivers must be legal entities. Re-check the decree's date at the source (D-16).
- In §2, decision 2's bank sync finding and the aggregator's 2026 coverage and price: re-check at the source (D-16, which reads the defensible form as no provider serving a personal app affordably).
- Market changes: iFood left Colombia in 2022; Codensa is now Enel; recurring Bre-B debits are coming, so subscription detection scans account debits too. Re-check the Bre-B timing at the source (D-16).
- SFC weekly bank interest rates: the open dataset keeps only about two months, so the deferred benchmarks (S8-39) store their own copy (F7.1-04). Re-check the window at the source (D-16).
- A 10-page statement PDF is roughly 30k to 46k input tokens for Claude (F7.2-13); the app itself incurs no LLM cost.

## 7. Notes for the UX step

From a digest of the Cuatro design contract (cuatro-portfolio, contract 2.0.0), for `bmad-ux`:

- **Satellite duties.** Vendor the contract folder verbatim, all or nothing (tokens, fonts, the Tailwind adapter, three font faces, three license texts). Import the Tailwind adapter so the compiled CSS sits beside the fonts file, or have the bundler rewrite font URLs; otherwise the faces fail to load. Consume `--token-*` roles only. Set `color-scheme: dark`. Apply the contract's hand-fix list. Pass floor checks F-1 to F-12 and record a manual accessibility pass per app.
- **Registry.** With Cuatro Finance as a Satellite, the Anchor's registry entry for it changes its source, absorbed-into, and token contract fields. That edit happens in cuatro-portfolio (`prd.md` §10).
- **Ownership.** Every value is contract owned. There are no tokens for status, success, danger, positive or negative amounts, categories, or chart series; there is one hue; the accent is a highlighter, never a fill; no gradients, shadows, or opacity for state. App owned: page max width, validation behavior, overlays (toast, dialog), and dense data screens and tables, where only the separator, the label, and tabular numbers bind.
- **Interaction.** Rows, never cards: the current card components become rows. One breakpoint at 760px, authored at 360px. Boxed, unfilled, square controls. Visible labels above fields, with errors as adjacent text. Loading is a word, never a skeleton or spinner; the UX step picks the Spanish word. An absent value renders nothing, never a placeholder mark. Only transform and opacity animate. Tap only, no gestures. A sticky header that never hides.
- **Numbers.** Tabular figures on every number. The contract font subset covers Spanish letters and a true minus sign (U+2212).
- **Accessibility.** Cuatro Finance targets WCAG 2.2 AA (`prd.md` NFR-3), stricter than the contract's stated 2.1 AA. Add scroll padding so the sticky header never hides focus. The Anchor's own accessibility review also recommended a forced-colors check and a 200 percent text zoom check at 360px; the UX step decides whether to adopt them.
- **Finance-specific open items.** Hue-free encoding of debits, debt, categories, and chart series (FR-59, Open Question 5); Spanish UI text without dashes (FR-62), a recorded deviation from the contract's typography rule, which wants typeset punctuation; desktop-first density inside the 360px floor (FR-61).

## 8. Sizing

- Data: performance is budgeted for 20.000 transactions (NFR-9), one owner, and a handful of accounts.
- Running cost: free tiers for email and prices, keyless TRM and UVR sources, and one small VPS (NFR-12).
- Release 1, the working ledger (`prd.md` §10, T-01), launches at its first deploy and builds its screens on the contract. It covers:
  - `prd.md` §5.1 to §5.4
  - Categories, rules, and the review queue (FR-30 to FR-32)
  - The record-keeping half of FR-36 and FR-37 (cuota counts, due days, statement minimums)
  - A minimal dashboard (FR-45)
  - The payment due, new client, backup, and repeated failed attempts alerts, always on (FR-48, FR-64)
  - The read, write, and capture tools and the spending by category compute tool (FR-53)
- Release 2, the planning features, starts after the go/no-go. It covers:
  - Budgets and goals (FR-33 to FR-35)
  - The rest of FR-36 and FR-37, the payoff comparison, the payment plan, and payment scenarios (FR-38 to FR-40)
  - The recurring calendar, the cash buffer, and the forecast (FR-41, FR-43, FR-44)
  - The rest of the dashboard, net worth history, and the spending report (FR-45 to FR-47)
  - The other alert types, alert toggles, and the weekly digest (FR-48, FR-49)
  - The other compute tools (FR-53)
  - Subscription detection (FR-42), which waits for six months of history (T-09)
