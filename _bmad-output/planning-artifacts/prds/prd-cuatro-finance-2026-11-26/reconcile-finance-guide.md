# Reconcile: original plan (finance guide)

## Summary

The PRD and addendum carry nearly every feature and must-never of the original plan. They cut or defer its integrations and demo on recorded decisions, and they correct several plan facts that research overturned. What they drop is mostly the plan's habit of making computed results explain themselves (a reason on each recommended payment, certainty on every forecast figure, payoff methods framed for the person choosing), plus a handful of safeguards: restore keys kept off the server, TOTP set up before the app is reachable, checks on fetched rates, and a path for a transaction whose TRM is missing. Five contradictions need a fix. The most serious are that the cash buffer can leave a minimum payment unscheduled, and that a loan payment has no home for its interest part.

## Gaps

Line numbers are lines of the private guide, cited by section and line, never quoted. Ordered by importance.

### G1. The keys a restore needs live off the server
- Guide: §11, line 934.
- Missing: the plan keeps its encryption key outside the server because losing it loses the data. FR-15 sends an encrypted backup copy off the server but never says where the keys and secrets needed to decrypt and restore it are kept.
- Belongs: FR-15 [new] and its restore runbook.
- Fix: add a consequence: "The keys and secrets a restore needs are held outside the server (for example in the owner's password manager), and the runbook restores a working app from the off-server copy plus those secrets alone."

### G2. TOTP is set up before the app is reachable
- Guide: §11, line 942 (with §2, line 69).
- Missing: the plan finishes the owner's MFA setup before the app faces the internet. FR-16 gates the first deploy on §5.1 passing but does not order TOTP setup before public reachability.
- Belongs: FR-16 [new], or FR-2 [baseline].
- Fix: "The owner's account has TOTP set up before the deployment is reachable from outside the host."

### G3. Computed recommendations carry their reason
- Guide: §6.3, lines 546 to 551.
- Missing: the plan attaches a plain-language reason and the saving against the minimum to every recommended payment. FR-39 lists payments with no reason, and A-1 leaves all explanation to Claude, so the app's own screens show unexplained figures and Claude has to infer which rule placed a payment.
- Belongs: FR-39, FR-40, FR-53.
- Fix: "Each payment plan line states in words the rule that placed it (minimum, monthly extra by the chosen payoff method, due before the next income event, held back by the cash buffer), and the compute response returns the same reason, so Claude quotes the app's reason instead of inventing one." Apply the same idea to a subscription proposal (FR-42): show the charges and intervals behind it.

### G4. Forecast certainty travels with every forecast figure
- Guide: §6.5, lines 599 to 610.
- Missing: FR-44 shows a confidence level per day in the app, but the forecast compute response (FR-53), the dashboard's lowest balance (FR-45), and each scenario's lowest balance (FR-40) carry none, so Claude can quote a forecast without its certainty.
- Belongs: FR-53, FR-40, FR-45.
- Fix: "Every forecast figure, in the app and in a compute response, carries its confidence level; a lowest balance carries the confidence of its day."

### G5. Fetched rates and prices are checked before they are stored
- Guide: §2, line 79.
- Missing: the plan validates every external response at runtime. The PRD validates files and tool input but not the TRM, UVR, and price responses, and a bad TRM locks into transactions for good (R-2).
- Belongs: NFR-8 or a data-source consequence in §5.2; addendum §3.4.
- Fix: "A fetched rate or price is stored only if it parses, is positive, and covers the expected date; otherwise the job fails visibly (NFR-11) and the last good value stays in use with its date."

### G6. A USD transaction whose TRM is not stored yet
- Guide: §5, lines 369 and 443; §9, line 746.
- Missing: the plan degrades to a last known value and to a hand-kept table. The PRD schedules a daily TRM fetch but never says what happens to a USD transaction dated before the stored history (an older imported statement, an opening balance) or on a day whose TRM has not arrived, and it offers no manual entry when the source is down.
- Belongs: FR-20 and R-2; addendum §3.2 and §3.4.
- Fix: "Past TRMs are fetched on demand for any date a transaction needs. A transaction whose TRM is not yet available posts with its rate pending and locks when the rate arrives, never at a stale rate. As a last resort the owner can enter a missing TRM (or UVR, under FR-23) by hand, recorded in the audit log."

### G7. Payoff methods are explained in the owner's terms
- Guide: §6.2, line 505; §12, line 968.
- Missing: the plan presents avalanche as the method that pays the least interest and snowball as the one that keeps motivation by closing small debts first, and it measures the result against paying only minimums. FR-38 and the glossary define both mechanically, with no minimum-only baseline.
- Belongs: FR-38; glossary "Payoff method".
- Fix: "The comparison states in words what each method optimizes, the interest difference between them, and each method's saving against paying only the minimums. Neither method is presented as wrong."

### G8. Exact duplicates still go to the owner
- Guide: §5, lines 417 to 425.
- Missing: the plan shows every detected duplicate for review before discarding it. FR-28 skips and lists exact duplicates with no way to post one, so two genuine identical charges on the same day (same account, amount, and description) lose one.
- Belongs: FR-28.
- Fix: "The owner can post a listed duplicate. Matching counts rows, so two identical staged rows against one existing transaction leave one row to post."

### G9. A way back in for the only account
- Guide: §3.2, line 160; §7, line 684.
- Missing: the plan has a security settings page and backup codes. FR-1 shows backup codes once at setup, and no FR lets the owner regenerate them or move TOTP to a new authenticator, so a lost device after the codes are used shuts the only user out of the ledger.
- Belongs: FR-1 [built] as a new consequence, or a new FR tagged new; the settings screen in FR-60.
- Fix: "Signed in with TOTP, the owner can regenerate backup codes and move TOTP to a new authenticator. The README documents recovery by someone with server access when both are lost."

### G10. The payoff comparison has no journey and no test target
- Guide: §10, lines 774 and 834.
- Missing: the plan unit-tests both methods against known fixtures and has an end-to-end check that both render with correct total interest. FR-38 is in no journey's capability list, so the one check per journey in NFR-10 skips it, and it is absent from the NFR-10 domain modules and from the unit test list in addendum §3.7.
- Belongs: UJ-4, NFR-10, addendum §3.7.
- Fix: add FR-38 to UJ-4 (Claude compares both methods before recommending the extra), and add the payoff comparison to the NFR-10 domain modules and the addendum's unit test list.

### G11. Money math is checked against independent figures
- Guide: §10, lines 772, 774, and 786.
- Missing: the plan tests money edge cases (negative, zero, very large amounts), checks debt interest against a hand-built spreadsheet, and checks UVR conversion against published values. NFR-10 sets coverage targets only, which a test can meet while agreeing with wrong math.
- Belongs: NFR-10; addendum §3.7.
- Fix: "Installment schedules, payoff comparisons, payment scenarios, and the EA to monthly conversion are checked against fixtures computed outside the code (a spreadsheet or a published amortization table); UVR conversion against published values; the money layer against negative, zero, and very large amounts."

### G12. The forecast shows what drives each day
- Guide: §6.5, lines 599 to 605; §7, line 692.
- Missing: the plan's forecast points carry the day's scheduled income and expenses, and its chart marks them. FR-44 gives a balance and a confidence per day but not the events behind a change, so neither the owner nor Claude can say why a low point happens.
- Belongs: FR-44, FR-53.
- Fix: "Each forecast day lists the recurring events and estimates that move it, in the app and in the compute response."

### G13. Rule precedence
- Guide: §10, line 780.
- Missing: the plan tests rule precedence. FR-31 lets several rules match one transaction without saying which wins, and nothing shows which rule filed a transaction.
- Belongs: FR-31.
- Fix: "When several rules match, a fixed order decides (for example the narrowest rule first, then the newest), and each transaction shows the rule that categorized it."

### G14. Categories in the import preview
- Guide: §7, line 687.
- Missing: the plan's import wizard has a category step before confirming. The FR-27 preview shows parsed rows but not the category each row will get, so wrong categories surface only after posting.
- Belongs: FR-27.
- Fix: "The preview shows each row's category from the rules, and the owner can change it before confirming."

### G15. One data access layer and one parser per format
- Guide: §3.3, lines 237 and 239.
- Missing: the plan routes all database access through one layer and gives each file format its own parser returning one row shape. Addendum §3 keeps the money layer rule but neither pattern, though one write path is the simplest way to make the audit log record writes from every source (A-10) and to enforce owner scope (FR-4) and field rules (FR-5) once.
- Belongs: addendum §3.6.
- Fix: record both as candidate patterns for the architecture step.

### G16. A returning demo is read-only in one layer
- Guide: §9, line 760.
- Missing: the plan enforces demo read-only in one central layer rather than per route. The demo is deferred (decision 1), but the addendum §3.1 note on the returning demo does not carry the principle.
- Belongs: addendum §3.1.
- Fix: add "the returning demo refuses every write in one central layer, never through per-route checks."

### G17. AFC research misses the plan's income limit
- Guide: §5, line 452.
- Missing: the plan limits the AFC benefit to 30 percent of yearly income. Addendum §6 records only the yearly UVT cap and the 10-year clock.
- Belongs: addendum §6 (deferred tax features).
- Fix: note that both limits apply when the AFC projection returns, to be verified against the law in force then.

## Contradictions or misstatements

### C1. The cash buffer outranks minimum payments
- Guide: §6.3, lines 542, 559, and 561.
- Issue: the plan lists avoiding late fees as its first goal, next to a rule never to go below the buffer. FR-39 resolves the tension toward the buffer: it never schedules a payment below the buffer and only says so when a minimum cannot be met, which leaves a minimum unscheduled and works against SM-3.
- Where: FR-39.
- Fix: "Minimum payments are always scheduled by their payment due date. The cash buffer limits only the monthly extra; when a minimum would breach the buffer, the plan keeps the payment and flags the breach."

### C2. Locked rates versus corrections
- Guide: §4, line 245; §9, lines 723 to 727.
- Issue: the plan forbids re-fetching a rate to re-value history. FR-20 says the locked rate and COP value are never recomputed, yet FR-25 lets the owner or Claude edit a USD transaction's date and amount, so a corrected date either keeps the wrong day's TRM or breaks the rule.
- Where: FR-20, FR-25, R-2.
- Fix: "Correcting a USD transaction's date or amount re-locks it at the TRM of the corrected date, as an audited write with before and after values. Nothing else changes a locked rate."

### C3. Forecast inputs drift from the plan's confidence model
- Guide: §6.5, lines 595 and 607 to 610.
- Issue: the glossary copies the plan's three confidence levels, but FR-44 has no input that yields the low level (irregular amounts from annual averages), and it adds an input the plan did not use (this month's budgets) with no level. A budget is a target, so a category that runs over its limit month after month (as in UJ-7) makes the forecast optimistic.
- Where: glossary "Confidence level"; FR-44.
- Fix: forecast variable spending from actual averages as the plan did, or from the higher of the budget and the 3-month average; give every input a level; then either add the annual-average input or drop the low level.

### C4. Loan and mortgage payments have no home for the interest part
- Guide: §6.6, line 624.
- Issue: the plan files installment payments under their own debt-payment category. FR-26 makes the whole payment a transfer that lowers the debt, and no FR posts the interest or other charges inside an installment. A loan's debt then falls by the full payment, drifts from the lender's figure, cannot reconcile (FR-29, SM-1), and its interest never shows as a cost.
- Where: FR-26, FR-37.
- Fix: "A loan or mortgage payment follows its installment schedule: the interest and any other charges post as costs on the liability account, so the debt falls only by the principal part. Card interest and fees arrive as statement rows."

### C5. FR-42 does not say how regularity is measured
- Guide: §6.4, lines 584 and 585.
- Issue: the plan tests regularity as a standard deviation of the intervals under 3 days. "Regular within 3 days" in FR-42 reads either that way or as every interval within 3 days, and the two detect different sets.
- Where: FR-42.
- Fix: name the measure, for example the standard deviation of the intervals under 3 days, so the consequence is testable.

### Resolved in the PRD's favor (no change needed)
- Number format (§9, line 735): the plan calls period thousands with comma decimals a European, non-Colombian format. It is the es-CO convention the PRD adopts (R-1), and the per-account number format in FR-27 handles exports in either convention.
- Rate basis (§4, line 327; §6.2, line 515; §6.8, line 672; §12, line 960): the plan gives annual rates with no basis, and as APR in its demo data. The PRD fixes EA with the monthly conversion (R-3, FR-22).
- UVR scope (§5, line 431): the plan says Colombian mortgages are UVR denominated. The PRD says some are and makes UVR conditional (glossary, FR-23, Open Question 1).
- Seed rules (§6.6, lines 618 to 626): the plan's rules use outdated merchant names and treat transfer words and wallet names as transfers. The PRD corrects both (FR-30, R-10, addendum §6).
- UVR source (§5, line 443; §8, line 704; §9, line 746): the plan says no API exists and hardcodes a fallback value. The addendum uses the central bank's documented web service and a dated last known value (addendum §3.4, FR-23).
- Bank sync and open banking (§2, line 73; §5, lines 369 and 375): the plan assumes an aggregator covers Colombian banks on a free tier and that no open-banking rule exists. Addendum §2 (decision 2) and §6 record that neither holds today.

## Qualitative intent

- Financial correctness before features (§7, line 679): captured, as the fix-first order (§10), SM-C3, and the trust job in §2.1.
- Zero tolerance for money bugs (§10, line 768): captured as coverage targets (NFR-10); the independent checks that give it teeth are dropped (G11).
- The money layer as the one place for arithmetic, written first and changed last (§3.3, line 236; §6.1, line 458): captured (FR-19, NFR-1 with its lint rule, §10 item 5).
- Never floating point (§6.1, lines 499 to 501; §9, lines 717 to 721): captured (NFR-1, FR-11, the FR-27 number formats).
- Rates locked at transaction time (§4, line 245; §9, line 727): captured (R-2, FR-20); the correction path is unstated (C2).
- Degrade gracefully to manual import (§5, line 369): captured and promoted to the main capture model (decision 2); the same habit is missing for a TRM that is not stored yet (G6).
- Uncertain cases go to the owner (§5, line 423; §6.6, line 614): captured (review queue, near duplicates, matches, transfer candidates, rule offers), except exact duplicates (G8).
- Recommendations explain themselves in plain language (§6.3, line 549): dropped from the app; A-1 hands all explanation to Claude (G3).
- Forecasts state their certainty (§6.5, lines 604 to 610): captured on the forecast screen, dropped from tool responses and derived figures (G4).
- Debt methods framed for the person choosing (§6.2, line 505): dropped (G7).
- Real math, not a UI wrapper (§12, line 978): captured (R-3, A-1, FR-53).
- MFA is mandatory for a finance app (§2, line 69): captured (FR-1, FR-2, NFR-4); the order of TOTP setup before exposure is dropped (G2).
- The app never handles bank credentials (§5, line 373): captured in spirit (FR-27 never asks for a statement password; §7.2 never contacts an institution).
- Security first, bank-level (§1, line 11; §12, line 980): captured (the §5.1 baseline before any feature).
- Demo read-only through one layer (§9, line 760): deferred with the demo; the principle is not recorded for its return (G16).
- Colombian specificity as the point of the product (§1, line 11; §12, line 974): captured and deepened (R-1 to R-12, cuotas, EA, holidays, Spanish UI with Colombian terms).
- Proactive budget alerts (§1, line 17): captured (FR-33, FR-48), now content-free by decision 5.
- Asking about one's finances in natural language (§6.7, line 632; §12, line 976): captured and extended from questions to managing records (§5.11).
- Accessible, controlled presentation of financial data (§2, line 66): captured (NFR-3, FR-58 to FR-61).
- Portfolio and recruiter showcase as a design driver (§1, line 13; §12, lines 948 to 982): dropped on purpose (decision 1).
- Voice and tone: the plan sets none for UI copy or for Claude; the personal-accountant framing, the Spanish UI, and the no-dash rule come from the owner, so nothing is lost.

## Deliberate, not gaps

- Aggregator bank sync with its consent widget, webhook, link tokens, sync columns, and sync tests (§1, line 21; §5, lines 371 to 402; §7, line 686; §10, lines 818 and 828): cut (S8-09, decision 2).
- Any open-finance connector (§5, line 369): cut (S8-14; PRD §8).
- n8n automations and their host (§1, line 39; §2, line 78; §7, line 693; §11, lines 845, 896 to 903, and 946): cut (S8-10; decision 5 moves the alert jobs to the job runner).
- Redis and BullMQ workers with the queue-and-return-early pattern (§2, line 72; §3.3, line 238; §9, lines 748 to 752): replaced by a job runner (S8-18; addendum §3.2, which keeps the no-queue-in-handler rule).
- Live rates from ExchangeRate-API (§1, line 29; §2, line 75; §8, line 702): replaced by the daily TRM (S8-11; addendum §3.4).
- UVR scraping (§9, line 746): cut (S8-12); UVR comes from the central bank's web service, and only if the mortgage is UVR (FR-23, Open Question 1).
- Stock and ETF tracking with paid or unofficial price feeds (§1, line 31; §7, line 691; §8, line 705): deferred and cut (S8-05, S8-13; decision 3).
- AFC tracking and its tax benefit projection (§1, line 27; §4, line 272; §5, lines 377 and 450 to 452): deferred (decisions 3 and 6).
- Umami analytics (§8, line 713): cut (S8-17).
- The payment-timing constraint solver, a recommended pay date per bill, and the rule to pay before the statement closing date (§1, line 35; §6.3, lines 540 to 563; §7, line 690): replaced by the deterministic payment plan (S8-15; memlog area D; addendum §2, area D).
- Avalanche as the only home for the extra in the timing rules (§6.3, line 561): widened to either payoff method (FR-39; memlog area D).
- A separate MCP container and port on SDK v1 (§3.1, line 121; §6.7, lines 634 to 662; §11, lines 890 to 894): replaced by an in-app route on SDK v2 (S8-20; addendum §3.3).
- Question-only MCP tools (§1, line 37; §6.7, line 632): replaced by read, compute, and write tools with guardrails (memlog area H; PRD §5.11).
- Demo mode, demo seed, no-auth demo routes, the env-flag database swap, demo tests, Open Graph tags, and recruiter talking points (§1, lines 13 and 43; §3.2, lines 161 and 162; §3.3, line 240; §6.8; §7, line 694; §9, lines 758 to 760; §10, lines 822 and 836; §12): deferred (decision 1, S8-07, §9.2), returning as a separate deployment (decision 7); Open Graph tags are implied by decision 1, not named.
- A weekly spending summary and alert emails with figures (§2, line 74; §7, lines 689 and 693; §8, line 701): replaced by content-free alerts and a counts-only digest, off by default (decision 5; FR-48, FR-49).
- Weekly and custom budget periods (§1, line 17; §4, lines 254 and 311 to 316; §7, line 689): deferred (memlog area C; §9.2).
- An automatic unwanted flag on subscriptions (§1, line 23): replaced by an owner-only flag (memlog area E; FR-42).
- Encrypting full account numbers and provider tokens (§3.3, line 241; §4, lines 266 to 268): replaced by storing only a masked suffix, with encryption kept for stored secrets (decision 8; FR-18; addendum §3.6).
- Parser tests on samples from real exports (§10, line 784): replaced by fictional fixtures (decision 2 prerequisites; PRD §7.1; addendum §3.7).
- USD in the US number format (§6.1, lines 487 to 492): replaced by es-CO with two decimals (A-8, NFR-2).
- Green and red deltas, branded account badges, and the plan's component kit (§2, line 66; §3.2, lines 174 to 177): replaced by meaning without hue, token roles only, and the contract vocabulary (memlog area J; FR-58, FR-59; addendum U3).
- Real-time balance streaming (§2, line 64): moot without bank sync (decision 2).
- EUR, checking accounts, lines of credit, investment funds, and a generic investment account type in the plan's enums (§1, line 31; §4, lines 251 to 255): outside the owner's instrument list (decision 3); §9.2 does not name them, so naming them there would keep the epics step from reopening them.
- A full schema written up front with no ad hoc columns (§7, line 683): superseded by the brownfield baseline (PRD §0 tags; addendum §3.6).
- A README with an architecture diagram and a one-command deploy (§7, line 694): folded into README alignment (deferred item 4, FR-14) and the composed deployment (FR-16).
- Hosting sized for n8n and a worker (§11, line 932): resized in addendum §3.1 (decision 7).
