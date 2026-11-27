# Review: product lens

*Reviewer gate: Mode 1 (Product Diagnostic) of the product-lens skill, applied to `prd.md` only, 2026-11-26. Findings cite PRD sections and IDs rather than line numbers.*

## Verdict

Go, with conditions. The PRD is unusually clear about who it serves and what it will not build, and its jobs, journeys, and counter-metrics state a sharp thesis: Claude keeps a reconciled ledger current and advises from the app's exact figures. It does not yet set up a fair test of that thesis (the MVP is the whole v1 with no go/no-go point, the first months' forecast overstates headroom, and planned payments and contributions never meet the transactions that fulfil them), so the three high findings should be folded in before UX and architecture build from it.

## Mode 1 answers

### 1. Who is this for?

Answered, and well. There is one user, the owner, who holds the only account (§2, §3 "Owner"). §2 pins them down by account mix (savings in COP and USD, credit cards with cuotas, a mortgage, other loans, crypto), by habit (uses Claude daily), and by setting (mostly at a desktop). §2.2 names who it is not for (family, advisors, demo visitors, recruiters, phone-first use), and the fictional Mariana carries every journey (§2.3). No finding.

### 2. What's the pain?

Partly answered. §2.1 states seven jobs, and their triggers imply frequency: every spend (daily), every card statement (monthly), every month end, and the occasional purchase goal. Severity and the current workaround get one sentence in §1 ("Why it matters"): no single app covers the combination without stitching apps together or paying for premium tiers. The PRD never says what the owner does today, how long the bookkeeping takes, or how often a due date or a budget slips, so no metric in §11 has a baseline (F-11).

### 3. Why now?

Implicit. No section argues it, but the PRD names two enablers: Claude's apps accept custom MCP connectors, so an assistant can read and write the ledger (§1, FR-50), and no provider offers bank sync for Colombian accounts, so capture has to come through the owner (§1, §8). It also tracks dated external changes: DTF stops being the credit reference rate on 2027-01-01 (R-7), the 2026 holiday law is under legal challenge (R-9), and a tax reform was filed on 2026-10-29 (§9.2). The redesign follows the design contract the Anchor now publishes (§5.12). The dependency on connector support is not stated as a risk (F-13).

### 4. What's the 10-star version?

Deliberately absent: the product "grows from real needs instead of a roadmap" (§1, FR-57). The deferral list sketches it anyway: a phone surface with push and passkeys, bank alert email ingestion, a daily briefing and unusual-charge detection, MCP Apps widgets, renta readiness and the other tax features, wider investment coverage, and a public demo (§9.2). The PRD keeps room for several of them: tax thresholds keyed by tax year (R-12), year-end balance snapshots (FR-46), and the demo as a separate deployment (§9.2, decision 7). Adequate for a personal tool, but the growth loop that replaces the roadmap leaves no record (F-12) and has no privacy rule for the prompts it drafts (F-10).

### 5. What's the MVP?

Not answered as asked. §9.1 puts every feature group in the MVP, §5.1 to §5.12 (FR-1 to FR-63, the full redesign included), which is the whole v1 rather than the smallest thing that proves the thesis. The thesis itself is narrower: "Claude does the work" (SM-C2) and "a reconciled ledger beats breadth" (SM-C3). The suggested first release in the §10 note (a working ledger with the read and write tools and conversational capture) comes close to that smallest thing, but it is a suggestion with no exit criterion (F-2) and it depends on features it leaves for later (F-4). Its advice half also cannot be judged fairly in the first months (F-1).

### 6. What's the anti-goal?

Answered, and well. §8 lists what the product will not be or do: multi-user, a money mover, a bank-sync or open-finance client, an in-app AI chat, an investment advice engine, a light theme, or a restyle of the Anchor's copy, and in the MVP no tax software, public demo, or phone app. §9.2 defers items with reasons and keeps a separate "cut, not deferred" list, and SM-C2 and SM-C3 make time in the app and features shipped explicit non-goals. One edge blurs: the vision promises a "savings and investment plan" (§1) that no compute tool backs (F-9).

### 7. How do you know it's working?

Partly answered. §11 has four metrics and three counter-metrics, each tied to FRs. SM-1 (every account reconciles within 7 days of its statement, three months running) is a genuine outcome, SM-2 is computable from the transaction source (FR-24), and SM-C1 guards capture quality. But SM-1 and SM-2 can both be met by statement imports with no conversation (F-5), the advice jobs have no outcome metric (F-6), SM-3 has no data the app records (F-3), SM-C1's terms are undefined (F-7), SM-1's clock starts at an event the app never sees (F-8), and "after launch" is undefined (F-2).

## Findings

### F-1 (high): the first months' forecast overstates headroom

- **Location:** FR-44, FR-40, FR-35, FR-18, FR-27, FR-42, FR-34; UJ-1, UJ-4, UJ-8; §11.
- **Issue:** The ledger starts at each account's opening balance and date (FR-18, UJ-1), and no FR says whether past statements can be imported as history or how such rows would sit against the opening balance. The forecast then runs on history the ledger does not have. In the first two months every category has spending in fewer than 3 of the last 6 months, so FR-44 classes all of them as irregular, and the PRD does not say whether a category's budget (the medium rule) takes precedence over that test. Depending on how the 3-month and 12-month averages are taken, which the PRD does not state, they divide a few weeks of spending by three or by twelve. Either way projected spending runs low and the lowest balance runs high: the unsafe direction for exactly the questions UJ-4 and UJ-8 answer ("can we afford more", "does this contribution break the cash buffer"). The low confidence label cannot tell "irregular" from "no history yet". Subscription detection (FR-42) and budget history (FR-34) also start empty, and the §11 window (three months after launch) falls inside this period.
- **Fix:** Add a history path to FR-18 or FR-27: at setup the owner can import past statements, which post as history that counts in averages, budget history, and subscription detection without changing the opening balance (or the owner sets an earlier opening date). In FR-44, take averages over the months the ledger covers, apply the irregular test only once the ledger covers the six months it looks at, fall back to the category's budget before then, and where there is neither, mark the forecast "insufficient history", a state distinct from low, in the app and in the compute response, so FR-40 and the goal plan say so instead of reporting a lowest balance.

### F-2 (high): the MVP is the whole v1, with no point where the thesis is tested

- **Location:** §9.1; §10 (the release-order note); §11 (SM-1 "after launch", SM-C2, SM-C3); FR-16; §5.11 (the note on SM-C1).
- **Issue:** §9.1 scopes all 63 FRs, the full redesign included, as the MVP. The thesis the metrics test is a ledger kept current by Claude and imports (SM-C2, SM-C3), which the first release in the §10 note already covers, but that order is only a suggestion, carries no exit criterion, and the §11 metrics start "after launch", which is never defined. If launch means the full MVP, the thesis is first measured after every feature and every redesigned screen ships. The shipped core has no deployable package yet (FR-16 is new), so the owner gets no use from the app until the first deploy, and the planning features (§5.5 to §5.10 in the note's grouping) would be built on a capture loop nobody has used.
- **Fix:** Without changing scope, name the first release as the MVP's thesis test, define launch in §11 as its deploy, and add a go/no-go to §10 before the planning features start: for example, SM-1 holds for two statement cycles and SM-C1 stays under its threshold; otherwise capture is fixed first. The §5.11 note already applies this rule to the write tools; extend it to the release order.

### F-3 (high): planned payments and contributions never meet the transactions that fulfil them

- **Location:** FR-39, FR-35, FR-41, FR-44, FR-48 (A-9), FR-25, FR-54; glossary "Contribution"; §11 SM-3.
- **Issue:** Nothing links an actual transaction to the planned item it fulfils. A payment plan line (FR-39) has no paid state, so the app cannot tell a met due date from a missed one: SM-3 has no data, and the reminder on the due date (A-9) fires even after the owner has paid, which trains them to ignore alerts. The glossary defines a contribution as "a transfer marked as funding a goal", and goal progress counts only contributions (FR-35, A-7), but no FR says who marks a transfer or how (FR-25's edits and FR-54's write tools do not include it), so UJ-8's "on track" has no input. And since nothing removes a planned occurrence once its transaction posts (FR-41, FR-44), a payment, contribution, or income event that lands early is counted again on its scheduled day; for early income, that overstates cash.
- **Fix:** Add a fulfilment rule. A transfer to a liability account settles that account's plan line for the period once it reaches the minimum payment or installment. A transfer into a goal's funding account is offered as a contribution to that goal, confirmed in the app or through a write tool, logged and undoable. An income event's occurrence is settled by the matching credit. Settled items leave the reminders and the forecast, and an unsettled plan line past its due date shows as missed, which gives SM-3 its data.

### F-4 (medium): the suggested first release depends on features it leaves for later

- **Location:** §10 (item 1 and the release-order note); FR-15, FR-26, FR-27, FR-28, FR-51, FR-56; §5.5, §5.7, §5.10.
- **Issue:** The note puts §5.1 to §5.4 and the AI connection's capture first and §5.5 to §5.10 second, but the first group needs parts of the second. The import preview shows each row's category from the rules (FR-27), conversational capture runs the rules (FR-56), and FR-26 and FR-28 file loan interest under its own category and send unmatched transfer candidates and near duplicates to the review queue: all §5.5. Loan and mortgage payments split by the installment schedule (FR-26, FR-37), every card purchase is a cuota purchase (R-4, FR-36), and SM-1 needs every account to reconcile: all §5.7. FR-15, inside the fix-first scope, and FR-51 both raise alerts through FR-48 (§5.10), while §10 item 1 puts the fix-first scope before any new feature (decision 8).
- **Fix:** Move §5.5 and the record-keeping half of §5.7 (FR-36 and FR-37: cuota purchases, installment schedules, the principal and interest split) into the first release, leaving FR-38 to FR-40 in the second. For the alerts, either place FR-48's email channel and alert list in the fix-first scope for the backup and new-client alerts, which is the owner's call against decision 8, or let FR-15 rely on NFR-11's in-app job status until FR-48 ships.

### F-5 (medium): both primary metrics can be met with no conversation at all

- **Location:** §11 SM-1, SM-2, SM-C2; FR-27, FR-28, FR-55; §2.1 (first job); §12 OQ2.
- **Issue:** SM-2 counts Claude and file imports together against manual entry, and a row Claude stages from a PDF statement posts with source import anyway (FR-27). Monthly statement imports alone therefore satisfy SM-2, and they also satisfy SM-1, which checks completeness after each statement. Neither metric shows whether the owner actually tells Claude about spending, which is the first job ("so the ledger stays current without data entry") and the thesis SM-C2 names. OQ2 (whether Claude's phone apps reach the connector) bears on exactly this, and its effect would stay invisible.
- **Fix:** Keep SM-2's target, report it split by path (told to Claude, staged through the AI connection as FR-55's client log identifies, imported in the app, manual), and add a currency measure the app can compute from FR-28: the share of each statement's rows matched to a transaction Claude captured earlier.

### F-6 (medium): the advice jobs have no outcome metric

- **Location:** §2.1 (jobs 2 to 4); §11 SM-3, SM-4; FR-35, FR-40, FR-43, FR-46.
- **Issue:** Half of the vision is advice on exact figures: pay more than the minimum without a short month, save toward a purchase, set a better budget split. §11 measures it only through SM-3 (no missed due date, which F-3 shows the app cannot yet compute) and SM-4 (a budget exists every month), an activity count that carrying last month's budgets forward satisfies without any review.
- **Fix:** Add one outcome per advice job, each a yes or no or a count so no personal amount enters the file: the monthly extra saved through FR-40 is paid each month (needs F-3); no asset account falls below its cash buffer (days below, from FR-43 and the balance snapshots of FR-46); every active goal is on track or has been re-planned; and each new month's budgets are set or confirmed after the previous month closes.

### F-7 (medium): SM-C1 does not define a correction and misses the riskiest capture path

- **Location:** §11 SM-C1; §5.11 (the note on SM-C1); FR-25, FR-27, FR-28, FR-29, FR-55.
- **Issue:** SM-C1 trips when more than 5 percent of a month's Claude transactions are "voided or corrected", and the §5.11 note makes it the trigger for revisiting the write tools, but "corrected" is undefined. A category change in the review queue is categorization, not capture. A match confirmation "records the statement's description and date with" the captured transaction (FR-28); if that overwrites them, nearly every matched Claude transaction counts as corrected. Meanwhile rows Claude reads from a PDF statement post with source import (FR-27), so the extraction most likely to go wrong sits outside the count; reconciliation (FR-29) catches a misread amount but not a misread date, description, or cuota count.
- **Fix:** Define a correction as a change to account, amount, currency, date, or direction, or a void, and track category changes separately. State in FR-28 whether a match keeps the statement's values beside the captured ones or replaces them, and exclude match confirmations from SM-C1 either way. Include rows staged through the AI connection (identified by FR-55's client log) in SM-C1's denominator.

### F-8 (medium): nothing prompts the monthly reconcile that SM-1 depends on

- **Location:** §11 SM-1; §5.10, FR-48, FR-49; FR-29, FR-36; §9.2 (bank alert email ingestion).
- **Issue:** SM-1 needs the owner to import and reconcile every account each month. Claude cannot start a conversation (§5.10), FR-48's alert types cover due dates, budgets, new clients, and backup and restore checks but not an unreconciled statement, and the weekly digest is off by default and counts only review items and alerts (FR-49). SM-1's clock also starts at "the statement arriving", which the app never sees, since there is no inbound channel (§9.2 defers email ingestion). The app does know each card's statement cut day (FR-36) and each reconciled statement's closing date (FR-29).
- **Fix:** Count SM-1's window from the statement's closing date, with a length the owner sets, and add an alert type for an account whose statement period closed that long ago without a reconciliation (cards from the cut day; other accounts from the last reconciled closing date plus one month), with its count in the digest.

### F-9 (medium): the "savings and investment plan" has no figures behind it

- **Location:** §1; UJ-8; FR-18, FR-22, FR-53; §7.2; §8; A-1.
- **Issue:** The vision promises "a savings and investment plan" (§1), and in UJ-8 Claude compares keeping the money in a savings pocket with buying USD each month. No compute tool compares savings options (FR-53), savings accounts carry no interest rate (FR-18; FR-22 covers cards, loans, and the mortgage), and §8 rules out an investment advice engine. A-1 and §7.2 say every figure Claude cites comes from a compute tool, but not what Claude does with figures the app does not hold (a savings yield, an exchange rate outlook, a price the owner quotes). As written, UJ-8 either runs without figures or has Claude compute its own, against A-1.
- **Fix:** State the boundary in A-1 and UJ-8: in the MVP, Claude compares where to hold savings in words, cites only app figures and figures the owner gives in the conversation (named as such), and projects no returns; and say "savings plan" in §1 until investment planning has a home. If the owner wants figures for the comparison, add an EA rate to savings accounts and a compute tool that projects a goal's contributions at a stated rate.

### F-10 (medium): drafted development prompts can carry personal details into the public repository

- **Location:** FR-57; §1; UJ-7; §7.1.
- **Issue:** The growth loop has Claude draft a development prompt inside a conversation about the owner's own finances, for the owner to take to this repository (§1, UJ-7, FR-57). §7.1 keeps personal details out of committed files, but nothing tells Claude to keep them out of the drafted prompt, which is the input that later work in the public repository starts from.
- **Fix:** Add a consequence to FR-57: the tool descriptions say the repository is public, so a drafted prompt describes the need generically, uses fictional examples, and carries no institution, account detail, amount, or other personal detail (§7.1).

### F-11 (low): the pain has no baseline

- **Location:** §1 ("Why it matters"); §2.1; §11.
- **Issue:** The pain is stated as jobs, with no figure for how often it bites, what it costs, or what the owner does today, so a metric such as SM-3 cannot show what the app changed. The build-versus-buy claim (no single app without stitching apps or paying for premium tiers) names no kind of tool that was tried.
- **Fix:** Add a short "today" note in non-financial terms (the kinds of tools in use, hours a month on bookkeeping, how often statements get reconciled now), and keep any baseline that touches money or institutions in a git-excluded note under `.private/`, as §7.1 does for institution names.

### F-12 (low): several deferrals lack a trigger, and real-case triggers have no evidence

- **Location:** §9.2; §1; FR-57.
- **Issue:** §9.2 promises "each with its reason and when to revisit", but open-data benchmarks and the Sankey report have neither, the phone surface and DTF or IBR loans have no revisit point (§1's "once the desktop version works" is undefined), and listed investments say only "when needed". Triggers such as "revisit on a real case" (tags and splits) or "if conversation and statement files leave gaps" (email ingestion) depend on remembering capability gaps, which FR-57 does not store.
- **Fix:** Give each §9.2 entry a reason and an observable trigger (for the phone surface, SM-1 holding plus OQ2's answer, the way the demo entry uses SM-1), and keep a content-free count of capability gaps by tool area, so the triggers have evidence without storing what the owner asked.

### F-13 (low): the main interface is a third-party dependency with no stated fallback

- **Location:** §1; §5.4; FR-50, FR-60; §12 OQ2.
- **Issue:** The primary interface depends on custom-connector support in each Claude app and on the MCP protocol versions they accept (FR-50), and the PRD records this only as an open question about phone apps (OQ2). Most of the app works through its own screens (FR-60), but two paths run only through Claude: conversational capture and PDF statements (§5.4 imports only XLS, CSV, and OFX in the app). If connector support changes, statements that come only as PDF fall back to manual entry.
- **Fix:** Add a short risk note under §7 or §12 naming the dependency and the fallback for each Claude-only path: manual entry plus in-app reconciliation for PDF statements, with in-app PDF parsing as a deferred item to revisit if the connector stops working.
