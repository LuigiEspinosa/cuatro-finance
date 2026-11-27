# Review: verification gaps

## Verdict

Most consequences can pass or fail as written, and the §5.1 baseline and the redesign FRs mostly need only a bound or a negative case. The gaps sit where story writers must compute expected values: the forecast cannot assign spending to accounts; the payment plan, payoff comparison, installment schedules, import classification, transfer detection, history after late-dated writes, and undo each lack a rule a test must assert; and several consequences rest on what Claude does rather than on what the app enforces. ID integrity holds for FR, NFR, SM, A, and R IDs, apart from journey capability lists that miss FRs their own steps use and three assumption IDs indexed at FRs that never carry them.

## Findings

Scope: every FR consequence, NFR, and success metric in `prd.md`, read with `addendum.md`, checked for whether a test or a recorded manual check can pass or fail against it. Line numbers refer to `prd.md`. Severity ranks how badly a story writer would be misled. Numbers in brackets, and the rule choices inside each rewrite, are placeholders that show a testable shape; each stays the owner's decision.

Counts: 1 critical, 10 high, 23 medium, 22 low.

Verifiable as written, no finding: FR-4, FR-7, FR-8, FR-13, FR-16, FR-17, FR-52, FR-59, FR-60, FR-62, NFR-1, NFR-2, NFR-3, NFR-5.

### Critical

#### V-01. FR-44 forecast: category spending has no account (lines 651 to 654, glossary line 166)

- **Why it cannot be verified.** The forecast projects each account's daily balance, but variable and irregular category estimates belong to no account, so no test can state a per-account balance. Also unstated: how a variable category's monthly estimate spreads over days (only irregular spending is said to spread), what the current month adds after its spending so far, whether an estimate excludes spending already scheduled as a recurring event (a subscription would count twice), and how "that day's confidence level" combines several inputs. FR-39, FR-40, FR-43, FR-45, UJ-4, and UJ-8 test the cash buffer against this forecast, so each inherits the gap.
- **Testable rewrite.**
  - Each category estimate is charged to one asset account: the category's paying account when the owner sets one, otherwise the account that paid most of that category in the last 3 closed months.
  - Spending scheduled as a recurring event is excluded from its category's average and budget estimate.
  - In the current month the estimate is the higher of budget and 3-month average, minus the month's spending so far, floored at zero, spread evenly over the remaining days; each later month spreads its full estimate evenly over its days.
  - A day's confidence level for an account is the lowest level of any input that moved that account's balance from today through that day; the total takes the lowest level across accounts.
  - Fixture: two accounts, one income event, one subscription, one budgeted category, and one irregular category, with all 90 daily balances and levels computed outside the code.

### High

#### V-02. FR-28 classes overlap (glossary lines 140 to 142, lines 479 to 481, UJ-4 line 72)

- **Why it cannot be verified.** A Claude-captured transaction with the same account, date, and amount as a staged row fits both "near duplicate" (flag) and "match" (confirm); with the same description key it fits both "duplicate" (skip) and "match". No precedence is given. "Description key" is undefined, "within 3 days" does not say before, after, or inclusive, and a row with two match candidates has no rule, so UJ-4's 9 matches and 1 near duplicate cannot be reproduced.
- **Testable rewrite.** Each staged row gets one class, tried in this order. Match: an existing Claude or manual transaction on the same account with the same amount, dated 3 or fewer calendar days before or after the row; with two or more candidates the row goes to the review queue listing all of them and is never matched automatically. Duplicate: an existing transaction with the same account, date, amount, and description key (the description lowercased, accents removed, runs of spaces collapsed). Near duplicate: same account, date, and amount with a different key. Flagged rows wait in the review queue and do not post on confirm. Boundary tests: a 3-day gap matches, a 4-day gap does not.

#### V-03. FR-26 transfer candidates have no criteria (line 454, glossary line 144, UJ-5 line 76, UJ-6 line 80)

- **Why it cannot be verified.** Unmatched transfer candidates feed the review queue and UJ-5 has a row "recognized as a transfer", but no consequence says what makes a transaction a candidate or when an imported row links to an existing side. Without that rule, a card payment inside an imported savings export counts as spending, which FR-26 forbids, and UJ-5's 41 staged rows posting 29 depends on what the transfer row does on confirm.
- **Testable rewrite.** Linked pair: an unlinked transaction on another of the owner's accounts, opposite direction, same currency and amount (across currencies, COP values within [2] percent at locked rates), dated within [3] days, becomes the other side on confirm, and the imported row posts no new spending. Unmatched candidate: a row that a stored transfer rule marks (rules as data, FR-31, never a transfer word alone, F7.1-07) and that has no such counterpart; it goes to the review queue, where the owner names the other account. Tests: a same-day pair, 3-day and 4-day gaps, a cross-currency pair, and a payment to another person (R-10), which never links.

#### V-04. FR-55 undo dependencies (line 770, UJ-6 line 80)

- **Why it cannot be verified.** "Explains the effect and asks before applying" names one dependency (an import match) and leaves the rest open: a later edit of the same record, one side of a transfer, a batch write (an import confirm, a category merge, a rule that filed many rows), and undoing an undo. "Explains" has no required content, so neither the check nor its message can be tested.
- **Testable rewrite.** Undo follows these rules, one test each. (a) A later write changed the same record: undo is refused and names that write. (b) An import matched the record: the app states that the matched statement row will post as a new transaction and applies only after confirmation (UJ-6). (c) One side of a transfer: both sides revert. (d) A batch write: one undo reverts the whole batch. (e) An undo is itself a logged write and can be undone. Every confirmation lists each record that will change, with its before and after values.

#### V-05. FR-56 capture checks rest on Claude (lines 778 to 782, UJ-3 line 68)

- **Why it cannot be verified.** "Returns any likely duplicate ... so Claude can confirm with the owner" and "its description tells Claude to ask" leave the outcome to Claude: nothing says whether the record call stores the transaction while a duplicate exists, or what happens when Claude passes a vague account. A story writer would ship a warning that a hurried client can ignore, and UJ-3's edge case (two cards) has no app-side test.
- **Testable rewrite.** A record call that finds a likely duplicate (A-5) stores nothing and returns the candidates; the same call repeated with every candidate acknowledged by ID stores it. An account reference that matches more than one account (for example "my card" with two cards) stores nothing and returns the candidates. A record call without a date stores today's Bogotá date (tested at 21:00 Bogotá). Tests cover each refusal and the acknowledged retry.

#### V-06. FR-11 and FR-54 amount and date text (line 299, line 760)

- **Why it cannot be verified.** "Parses to the intended value", "ambiguous under that format", "a declared format", and "does not parse unambiguously" name no accepted input, no rejected input, and no list of formats a tool may declare. FR-11 cites R-1, a rendering rule, so no rule states the parse, although this parser sits under every amount in the ledger.
- **Testable rewrite.** Amount text is parsed under one declared format: es-CO (optional period for thousands in groups of three, comma for decimals) or plain (digits with an optional period for decimals, no grouping). A case table is the test. Under es-CO, "48.000" and "48000" are COP 48.000, "6,99" is USD 6,99, and "1.234.567,5" is 1.234.567,50; "1.5", "12.34", "1,234.56", "1.2345", and any COP or USD amount with more than 2 decimals are rejected with the reason. Dates are declared as yyyy-mm-dd or dd/mm/yyyy, and an impossible date such as 31/02/2026 is rejected.

#### V-07. FR-36 installment schedule method (line 572, R-4 to R-6 at lines 190 to 192, NFR-10 line 845, UJ-1 line 60)

- **Why it cannot be verified.** A schedule "at the card's EA rate" has no method (constant principal with interest on the remaining balance, or constant installment), no rule for the first cuota's partial period, and no input shape for a purchase entered mid-schedule (UJ-1 enters "the cuota purchases still running"). NFR-10 requires fixtures computed outside the code, which cannot be computed without the method, and R-6's estimate inherits the gap.
- **Testable rewrite.** Each card stores its schedule method as an interest term (R-5): constant principal (principal divided by the cuota count, interest on the remaining principal at the R-3 monthly rate) or constant installment. The first cuota's interest runs from the purchase date to the first cut day under a stated day-count rule. A running purchase is entered with its original amount, cuota count, and cuotas already billed. Fixtures: one purchase per method plus a 1-cuota purchase, with every cuota's principal and interest computed outside the code.

#### V-08. FR-38 payoff comparison rules (lines 591 to 592)

- **Why it cannot be verified.** The expected schedules depend on rules the consequence omits: whether a paid-off debt's payment rolls to the next debt, the order for equal rates or equal debts, a monthly amount below the sum of minimum payments, where the extra lands on a card with several cuota purchases, and how a minimum-only schedule that never ends is shown. "Neither method is presented as wrong" has no check.
- **Testable rewrite.** When a debt is paid off, its payment rolls to the next debt in method order from the following month. Ties: avalanche takes the smaller debt first, snowball the higher rate, then account creation order. An amount below the sum of minimums is rejected, stating the shortfall. On a card, the extra goes to [the highest-rate cuota purchase first]. A schedule that never pays a debt off shows "no payoff" instead of a date. Neither method carries a recommended, better, or wrong label (a copy test). Fixture: three debts with schedules computed outside the code.

#### V-09. FR-39 paying account and held-back extra (lines 599 to 602, glossary line 160, FR-41 lines 624 and 626)

- **Why it cannot be verified.** "The paying account" has no field on any liability account (FR-18, FR-36, FR-37), and payment due dates become recurring events that hold one account, so the plan cannot know which balance to test. "Extra held back by the cash buffer" does not say whether the whole extra or only the excess is held, over which days, or whether a due date on a holiday moves earlier or later.
- **Testable rewrite.** Each liability account names the asset account that pays it, and its due date events carry both accounts. The plan schedules the largest whole-peso part of the monthly extra that keeps the paying account's forecast at or above its cash buffer on each of the next 90 days, and lists the rest as "extra held back by the cash buffer". A due date on a weekend or holiday moves to the previous business day. "Before the next income event" means earlier than the next income event into the paying account after today. Fixture: a buffer that holds back part of the extra.

#### V-10. FR-34 and FR-46 history after late-dated writes (line 547, lines 676 to 677, UJ-7 line 84)

- **Why it cannot be verified.** Card statements usually arrive after the month ends, but "kept" (FR-34) and "records a balance snapshot" (FR-46) do not say whether a later write dated in a closed month, or before a snapshot, changes the history. When a month closes, when a snapshot is taken, and what happens to a day the job missed are also unstated, so UJ-7's six-month history and the net worth chart have no expected values.
- **Testable rewrite.** A month closes at 00:00 Bogotá on the 1st of the next month; its limit freezes then, and its actual spending is recomputed whenever a write dated in that month is added, edited, voided, or undone. The snapshot for date D holds each account's balance at the end of D in Bogotá and its COP value at D's rates; a write dated on or before D recomputes the snapshots from that date on; a missed day is filled on the next run. Test: an import after month end changes last month's actual spending and its net worth point.

#### V-11. NFR-10 end-to-end checks for Claude journeys (line 845, addendum §3.7)

- **Why it cannot be verified.** Each journey gets one end-to-end check (Playwright, per addendum §3.7), but UJ-2, UJ-3, UJ-4, UJ-7, and UJ-8 run through Claude, whose steps (asking which card, recommending, drafting a prompt) no automated test can drive or assert. A story writer either cannot meet the gate or quietly drops the Claude steps.
- **Testable rewrite.** Each journey has one end-to-end check of the app's side: screens through the browser, and each Claude step as the tool calls it implies, sent by a scripted MCP client with the journey's inputs. The check asserts tool responses and stored state, never Claude's wording. Claude's own steps are covered by the recorded FR-50 check per Claude app.

### Medium

#### V-12. FR-40 scenarios never flag the buffer (lines 610 to 611, UJ-4 line 72)

- **Why it cannot be verified.** UJ-4's edge case ("the scenario says so") has no consequence: nothing flags an option that breaches a cash buffer, and "the forecast's lowest balance" names no account. Saving "a chosen option" as the monthly extra is undefined for a one-off option.
- **Testable rewrite.** Each option reads the paying account's forecast (V-09), shows its lowest balance in the next 90 days with that day's level, and is flagged with the first day that account falls below its cash buffer. Only a monthly option can become the monthly extra; a one-off option is saved as a one-off planned payment. Each option also returns the months saved against the minimum, so Claude quotes UJ-4's "7 months sooner" instead of computing it.

#### V-13. FR-35 goals: formula, on track, cycles (lines 555 to 558, FR-41 line 624, UJ-8 line 88)

- **Why it cannot be verified.** The needed monthly contribution has no formula, "on track" has no test, and UJ-8's edge case ("the goal plan flags that month") has no consequence. A planned contribution is a transfer, but a recurring event holds one account, so the source the forecast debits is never recorded. A sinking fund has no repeat interval, so "its next cycle" has no target date.
- **Testable rewrite.** Needed contribution equals target minus progress, divided by the whole months left, rounded up to the peso (fixture from UJ-8: COP 6.000.000 over 8 months gives COP 750.000). On track: planned contributions dated on or before the target date sum to at least target minus progress. The goal plan flags each month in which a planned contribution takes its source account below its cash buffer. A planned contribution names its source and funding accounts. A sinking fund holds an interval; when its target date passes, a new cycle starts at zero progress with the same target and the date moved by the interval.

#### V-14. UJ-8 pocket versus monthly USD purchases has no tool (line 88)

- **Why it cannot be verified.** Claude "compares keeping the money in her savings pocket with buying USD each month", but no compute tool (FR-53) covers that comparison and the app does not project the TRM, so under A-1 Claude has no app figure to quote and the step cannot be checked.
- **Testable rewrite.** Either add the comparison to FR-53 with stated inputs (amounts at the latest TRM only, labeled as such), or reword UJ-8 so Claude compares the options without figures and states that the app does not project exchange rates, a capability gap under FR-57.

#### V-15. R-6 and FR-36: the statement minimum payment has no input (line 192, line 573, glossary line 139)

- **Why it cannot be verified.** The card shows "the statement's figure once a statement is imported", but import maps only date, description, and amount columns, and FR-29 and FR-54 record only a statement's closing balance and date. The minimum payment that FR-39 and SM-3 depend on has no input path to test.
- **Testable rewrite.** Entering a card statement records its closing balance, closing date, minimum payment, and payment due date; the card shows that minimum, labeled with its statement date, until the next cut day.

#### V-16. FR-37 loan terms (lines 581 to 583, UJ-1 line 60)

- **Why it cannot be verified.** "Interest and charges" post as spending, but no field holds charges (such as insurance), so the split of an entered installment cannot be computed. Current debt, rate, installment, and remaining term over-determine the schedule, with no rule for when they disagree. UJ-1 enters no original principal although FR-37 lists it, and the extra payment rule has no fixture.
- **Testable rewrite.** Each month the installment splits into interest (balance times the R-3 monthly rate), charges (a fixed monthly amount stored on the account), and principal (the rest). When the entered terms disagree by more than one installment, the app shows the computed term beside the entered one and saves only after the owner picks. State whether original principal is required. Fixture: one extra payment under each extra payment rule, with the new term or installment computed outside the code.

#### V-17. FR-31 rule matching and order (lines 511 to 515)

- **Why it cannot be verified.** "Matches on description text" has no matching semantics, and "the narrowest rule first" has no ordering (an account-only rule against an amount-only rule). Nothing says whether a category Claude or the owner sets explicitly survives the rules, or whether a new rule refiles existing transactions (UJ-6 saves one from the queue).
- **Testable rewrite.** A rule's text matches as a substring after both texts are lowercased and stripped of accents. More narrowing conditions (account, amount range) win; then the longer text; then the newest rule. Rules fill only an empty category, so an explicit category is kept. A new or edited rule refiles existing transactions only when the owner applies it to them. One test per tie level.

#### V-18. FR-25 "keeps the pair consistent" (line 443)

- **Why it cannot be verified.** "Consistent" names no observable state, and for a cross-currency pair there is no obvious reading of it.
- **Testable rewrite.** Changing the date of either side changes both. In a same-currency pair, changing one amount changes the other to match; in a cross-currency pair, the other side is kept and the stored implied rate is recomputed. Voiding either side voids both, and undo restores both. A test asserts both sides after each edit.

#### V-19. FR-29 statement period and later writes (lines 489 to 490, UJ-6 line 80)

- **Why it cannot be verified.** "The statement period's transactions" has no period start, and nothing says what a later write dated inside a reconciled period does to its status (UJ-6 undoes a card transaction and "both cards reconcile").
- **Testable rewrite.** A statement period runs from the day after the previous statement's closing date (for the first statement, the account's opening date) to this closing date. A later write dated inside a reconciled period clears that reconciliation and shows the new difference.

#### V-20. FR-42 detection and price flags (lines 634 to 638, UJ-3 line 68)

- **Why it cannot be verified.** "An average interval near 7, 14" has no tolerance, "normalized merchant" has no definition, two charges give one interval whose deviation is undefined, and "is flagged" (a price change) has no destination among the review queue types or the alert types. UJ-3's charge "matched to the subscription the app already tracks" has no linking rule.
- **Testable rewrite.** The normalized merchant is the FR-28 description key. Near means 6 to 8, 13 to 15, or 28 to 31 days; with two charges the deviation test is skipped. A charge links to a confirmed subscription when its merchant key matches and it falls within 3 days of the next expected charge. A linked charge more than 5 percent off the expected amount creates a review queue item of a named type.

#### V-21. FR-21 cost basis method (line 403)

- **Why it cannot be verified.** Cost basis after a partial sell depends on a method (average cost, or first in, first out) that is not stated, and a sell's realized gain is not covered, so no figure can be asserted.
- **Testable rewrite.** Cost basis uses one stated method. Fixture: buy 0,01 units of a crypto asset for COP 3.000.000, buy 0,01 units for COP 5.000.000, sell 0,01 units; the remaining position's basis is COP 4.000.000 under average cost (COP 5.000.000 under first in, first out), and the sell records its realized gain or loss.

#### V-22. FR-15 restore check and export (lines 330 and 332)

- **Why it cannot be verified.** The monthly restore check has no pass criterion, a daily backup that never runs raises nothing (FR-48 covers only a failed one), and "export ... as files" names no format and no completeness test.
- **Testable rewrite.** The check restores the latest off-server backup into a scratch database and passes when each table's row count and each account's balance equal the values recorded at backup time. No passing check in [35] days, or no backup in [26] hours, raises the FR-48 alert. The export writes one file per record type in [CSV]; a test seeds one record of each type FR-15 names and finds each in the export with every stored field.

#### V-23. FR-2 and NFR-4: tool calls and sessions (line 223, line 839)

- **Why it cannot be verified.** Baseline, assessment §4 and §6. The consequence at line 223 applies a session test to tools, but a tool call carries an access token from the FR-51 flow, not a session, so the test has nothing to assert. NFR-4 bounds sessions, yet no consequence bounds those tokens, and "idle" is undefined.
- **Testable rewrite.** Every screen and API route rejects a request without a session that completed TOTP. Every tool rejects a call without a valid access token issued through a sign-in that completed TOTP. A test enumerates the route and tool registries, so a new entry without the check fails. Idle means no authenticated request for 30 minutes. An access token expires after [60] minutes, and no token works after a revoke or the 30-day disconnect (NFR-5).

#### V-24. FR-54 removal and scope (lines 758 to 759)

- **Why it cannot be verified.** "A deletion requested through Claude becomes a void" describes what Claude does with a request, which the app cannot observe, and no consequence states the scope negative case: a write tool called with read scope only.
- **Testable rewrite.** The AI connection exposes no delete operation; the void tool is its only removal, and a voided record stays in history. A write tool called with a read-only token changes nothing, returns a scope error, and is logged (FR-55).

#### V-25. FR-57, §7.2, and A-1 rest on Claude (lines 790 to 791, line 862, lines 31 and 961)

- **Why it cannot be verified.** "So Claude can tell a capability gap from an error", "Claude drafts the development prompt", and "the figures Claude cites come from compute tools" describe Claude's conduct, which the app cannot enforce. The journeys also have Claude quote derived figures no tool consequence returns: UJ-4's total debt and total minimum payments (the dashboard shows them, FR-45, but no tool is said to) and its months sooner.
- **Testable rewrite.** Every tool description has a "covers" part and a "does not cover" part, and a test fails on a description missing either. Every tool error carries a code that separates invalid input, not found, not allowed, and not supported. For each figure a journey shows Claude quoting, a read or compute tool returns it ready to quote, and a contract test per journey asserts those outputs. The app stores no record for a capability gap.

#### V-26. FR-50 protocol versions (line 724, addendum §3.3)

- **Why it cannot be verified.** "The current MCP protocol version" moves over time, and "until Claude supports the current one in every app" depends on outside apps, so neither has a fixed pass condition.
- **Testable rewrite.** The AI connection serves the 2026-07-28 protocol and the legacy mode named in addendum §3.3. A recorded check per Claude app (claude.ai web, Claude Desktop, Claude Code) notes the mode each used; the legacy mode is removed only in a release whose check shows all three connecting without it.

#### V-27. FR-61 "desktop first" and "usable" (lines 824 to 825)

- **Why it cannot be verified.** "Designed and tested for desktop first" names no desktop size, and "usable at 360px" has no criterion beyond the scroll.
- **Testable rewrite.** Desktop acceptance runs at [1440 by 900]. At 360 CSS px, every FR-60 screen shows no horizontal page scroll, no clipped or overlapping text, and every action the desktop layout offers; an automated check per screen and the FR-58 manual pass record it.

#### V-28. NFR-9 performance measure (line 844, addendum §3.1 and §8)

- **Why it cannot be verified.** "Responds" has no measurement point, "the target host" is not fixed (addendum §3.1 leaves the host size open), and the dataset names only a transaction count ("a handful of accounts").
- **Testable rewrite.** On the host the architecture step fixes (its size recorded with each run), with a fixture of 20,000 transactions over [8] accounts, [100] rules, and [30] recurring events, server time to last byte stays under 1 second per FR-60 screen and 2 seconds per tool at the 95th percentile of [100] warm requests each. Lighthouse desktop, dashboard and feed: performance 90 or more, accessibility 100.

#### V-29. NFR-11 alert path and silent jobs (line 846)

- **Why it cannot be verified.** "The owner is alerted" names no monitor or channel (an app that is down cannot send its own email), and a job that never starts produces no failure to show.
- **Testable rewrite.** An external monitor checks the health endpoint (addendum §3.1) at least every 5 minutes and emails the owner after 2 failed checks in a row; a recorded drill stops the app and notes the alert time. A scheduled job with no success within twice its interval shows as failed, with its last success time.

#### V-30. NFR-6 rules that can block each other (line 841)

- **Why it cannot be verified.** When the fix for a high or critical advisory is newer than 7 days, "no deploy with a known high or critical advisory" and "adopted only after 7 days public" cannot both pass, and the PRD does not say which wins. "Known advisory" also has no stated source.
- **Testable rewrite.** The measure is the package manager's audit of production dependencies at high level. A release that fixes a high or critical advisory may be adopted before 7 days, recorded as an exception with the advisory ID; every other version waits 7 days.

#### V-31. SM-1 measurement (line 936)

- **Why it cannot be verified.** "Within 7 days of the statement arriving" uses a date the app never records, "no unexplained difference" is softer than FR-29's zero difference, "after launch" has no date, and "every account" includes accounts that receive no statement (crypto).
- **Testable rewrite.** For three consecutive calendar months after the first deploy, every account that receives statements has, for each statement, a reconciliation with difference zero recorded within 7 days after the statement's closing date. A report lists account type, closing date, reconciliation date, and difference.

#### V-32. SM-3 "missed" has no measure (line 940)

- **Why it cannot be verified.** The app holds no record of a missed payment, and the metric does not say what ledger state counts as one.
- **Testable rewrite.** For every minimum payment the plan scheduled in the first three months, the ledger holds a payment transfer to that liability account, dated on or before its payment due date, of at least the minimum; a report lists any without one.

#### V-33. SM-C1 "corrected" (line 944, FR-28 line 481)

- **Why it cannot be verified.** "Voided or corrected" has no definition. A confirmed match records the statement's description and date with the Claude transaction, which a naive count reads as a correction, so the counter-metric would trip on every statement.
- **Testable rewrite.** Rate equals the month's Claude transactions later voided, or whose amount, account, date, or category a later write changed within 30 days, divided by the month's Claude transactions. Updates recorded by a confirmed match are excluded.

#### V-34. FR-27 file bounds and mismatched files (lines 467 to 472)

- **Why it cannot be verified.** An uploaded file is untrusted input, yet no size or row bound is stated, and a file that no longer fits the saved column mapping, an unsupported type, and a password-protected file have no stated outcome. "The owner unlocks a password-protected PDF" is the owner's act, not the app's.
- **Testable rewrite.** A file over [10 MB] or [5.000 rows] is rejected before parsing, naming the limit. A file that does not fit the saved mapping is rejected, naming the missing column, and the owner can remap. An unsupported or password-protected file is rejected with a message; the app never asks for or stores its password.

### Low

| ID | Location | Why it cannot be verified | Testable rewrite |
|---|---|---|---|
| V-35 | FR-9, lines 278 to 279 (baseline, deferred item 7) | The default and maximum page size are not stated. | Without a size a list returns [50] items; the maximum is [200]; sizes 0, 201, 2,5, and "abc" return 1, 200, 50, and 50 items. |
| V-36 | FR-6, line 255 (baseline, assessment §4) | The credential consequence sets no strength bound. | Each credential is randomly generated with at least [32] characters and comes from the environment or a secret store; the deployment refuses to start without one; a secret scan in continuous checks finds none in the repository. |
| V-37 | FR-12, line 307 | Archiving does not say what happens to new transactions, or to the balance in net worth, snapshots, and the forecast. | An archived account takes no new transactions and leaves pickers, the forecast, and the payment plan; net worth [keeps] its balance; archiving with a nonzero balance [asks for confirmation]. |
| V-38 | FR-30, lines 500 to 504 | Merging two categories that both hold a budget for one month has no rule; "covers Colombian spending" names no list; archiving has no stated effect. | Merged budgets sum their limits. The seed is a named list, GMF included, checked after a fresh install. An archived category takes no new assignment, and its rules stop matching. |
| V-39 | FR-33, lines 538 to 539 | Refunds, USD spending, and repeated crossings are not covered. | Progress is the month's debits minus credits in the category, USD at locked rates. Each budget raises at most one threshold alert and one limit alert per month, from the daily check (addendum §3.2). |
| V-40 | FR-48, lines 700 to 701; UJ-2 line 64 | "A count where useful" names no alert types, and no delivery bound backs UJ-2's "minutes later". | Name the alert types that carry a count. A new connected client alert is sent within [5] minutes; scheduled alerts within [1] hour of their job. |
| V-41 | FR-20, line 394 | A provisional total has no stated value, and "as a last resort" has no trigger. | A pending-rate transaction counts at the latest TRM and the total shows "provisional" until it locks; manual entry is offered when no TRM covers the date [3] days after it. |
| V-42 | FR-24, line 433; FR-47, line 685 | Text filter semantics, the currency of an amount range, and "previous period of the same length" for calendar months are open. | Text matches a substring, ignoring case and accents; the amount range applies to the absolute amount in the transaction's currency; for a calendar month the previous period is the previous calendar month, otherwise the same number of days just before. |
| V-43 | FR-45, line 669; UJ-1 line 60 | "Budget status" has no content, and UJ-1's empty dashboard has no consequence. | Budget status lists each budgeted category with spent, limit, and percent. With no accounts, the dashboard shows only a pointer to create one. |
| V-44 | FR-41, line 624; FR-43, line 644; FR-49, line 710 | A recurring event has no start date, end date, or direction ("every N days" needs an anchor); an unset cash buffer has no meaning; the digest has no day. | Each event has a direction, a start date, and an optional end date; an unset buffer is zero [or: no check]; the digest goes out [Monday 07:00 Bogotá]. |
| V-45 | FR-1, lines 213 to 214; FR-3, line 228; FR-63, lines 359 to 360 | The consequences name no negative-case tests: a wrong or reused code, a check that every screen offers sign-out, the old authenticator after a move, the ledger after recovery. | A wrong TOTP code or a used backup code leaves TOTP incomplete. Every FR-60 screen offers sign-out. After a move, the old authenticator's codes fail and the new one activates after one valid code. The README recovery, run on a test deployment, restores sign-in with record counts unchanged. |
| V-46 | FR-14, line 321; FR-58, lines 806 to 807 | "Exactly as implemented" and the manual pass have no pass criteria; "a commit the owner reviews" leaves no record. | A recorded check follows the README's sign-in and TOTP steps on a fresh deployment with no step added or skipped. The manual pass records pass or fail per screen for keyboard reach with visible focus, 360px, greyscale, and reduced motion. The release record names the adoption commit and the owner's review date. |
| V-47 | FR-10, line 287 | "Exactly once" does not say whether writes between page requests are allowed. | Paging returns each transaction at most once, and every transaction that existed for the whole pass exactly once, while others are added or voided between requests. |
| V-48 | FR-22, line 411; FR-23, line 419 | An entered rate has no bounds and its monthly equivalent no precision; "validated together" lists no rules. | A rate outside 0 to [100] percent EA is rejected; the monthly equivalent shows [2] decimals. List the UVR fields validated together and the rejection for each. |
| V-49 | NFR-8, line 843; NFR-12, line 847 | "Older than 2 days" has no reference date for a TRM valid over several days; "small VPS" has no spec. | A TRM is stale when none covers the date it is used for; a price is stale when it is more than 48 hours old. NFR-12 is measured against the host spec the architecture step fixes. |
| V-50 | NFR-7, line 842; NFR-10, line 845 | The log rule has no check, and "very large amounts" has no bound. | A test seeds canary values (a password, a token, a 16-digit number, a description) and fails if any appears in captured logs. The money layer is tested at the largest amount it accepts (stated, within the BIGINT minor units of addendum §3.6) and rejects one unit more. |
| V-51 | SM-2, line 937; SM-4, line 941; SM-C2 and SM-C3, lines 945 to 946 | SM-2 has no counting unit; "a budget exists" is ambiguous; SM-C2 and SM-C3 have no source (analytics are cut in §9.2). | SM-2 counts non-voided transactions by source per Bogotá month, a transfer once. SM-4: every category with spending in the month has a budget [or: at least one budget exists]. State that SM-C2 and SM-C3 are judged by the owner, not measured. |
| V-52 | FR-5, line 247; FR-18, line 373 | "Balance changes only through transactions" leaves no path to correct an opening balance. | The opening balance is the account's first transaction, so correcting it is an audited transaction edit; no account edit changes a balance. |
| V-53 | FR-32, lines 523 to 524 | The resolutions for each item type are not listed. | Uncategorized: set a category, optionally save a rule. Near duplicate: keep both or keep one. Match: confirm, or reject so the row posts as new. Transfer candidate: link to an account, or mark not a transfer. One test per resolution and its undo. |
| V-54 | FR-51, lines 731 to 734; UJ-2 line 64 | UJ-2's edge case (Claude Code's loopback redirect) has no consequence; only addendum §3.3 states the rule. | Claude Code completes sign-in through its loopback redirect, shown in the recorded FR-50 check. |
| V-55 | FR-19, line 382; FR-53, line 749 | "Comes from the money layer" is not observable from outside. | The NFR-1 lint rule fails on money arithmetic, parsing, or formatting outside the money layer, and a contract test compares each money-returning tool with the money layer's result for the same input. |
| V-56 | FR-18, line 373 | A typed full account number has no outcome, and crypto accounts have no number. | Typing a full number stores only its last four digits [or: is rejected]; the masked number is optional for crypto accounts. |

## ID integrity

- **FR-1 to FR-63.** 63 headings, each ID once; FR-63 sits in §5.1 after FR-17, as §0 says, and §9.1 names the same set. Every FR cross-reference resolves to an FR whose text supports it (for example FR-36 and FR-37 to FR-41's month-end rule, FR-37 to FR-26's interest split, FR-48 to FR-15 and FR-51).
- **NFR-1 to NFR-12.** Each once, and every citation resolves (NFR-1 at FR-19, NFR-2 at FR-62, NFR-3 at FR-58, NFR-5 at FR-51, NFR-6 at FR-8, NFR-7 at §7.1, NFR-8 and NFR-11 at FR-20, NFR-10 at §5.1 and FR-17, NFR-12 at §7.3). NFR-4 and NFR-9 are cited by no FR (only addendum §3.8 and §8), so no story inherits them unless the epics step assigns them.
- **SM-1 to SM-4 and SM-C1 to SM-C3.** Each once; references at lines 486, 714, 901, and 966 resolve, and every FR in a "Validates" list exists.
- **A-1 to A-10.** Each once in §13, with wording that matches where they appear. Three index entries name places that do not carry the ID: A-2 (indexed at FR-37), A-3 and A-4 (both indexed at FR-36) appear only in R-7, R-4, and R-5, which those FRs cite, against §0's rule that an assumption carries its ID where it appears (line 23). A-5 also appears in §12 question 3 (line 952), which its index entry (line 965) omits.
- **R-1 to R-12.** Each once in §4, and every citation matches the rule cited. R-12 is cited by no FR, as expected for the deferred tax features. FR-11 cites R-1, a rendering rule, for parsing, so no rule states the parse (V-06).
- **UJ-1 to UJ-8.** Each once, and every FR in a capability list exists. The lists miss FRs their own steps use, and the §5 "Realizes" lines disagree with them. Since NFR-10 builds one end-to-end check per journey, the lists set each check's scope.

| Journey | Gap |
|---|---|
| UJ-1 | Lists FR-43, but no step sets a cash buffer. §5.1 claims UJ-1, but the list holds no §5.1 FR (the sign-in is FR-1). |
| UJ-2 | §5.1 claims UJ-2, but the list holds no §5.1 FR. The edge case has no FR consequence (V-54). |
| UJ-3 | Omits FR-24 (the feed), FR-55 (undoable), and FR-42 (the subscription match). §5.3 claims UJ-3, but the list holds no §5.3 FR. |
| UJ-4 | Omits FR-43, which the narrative and the edge case use. |
| UJ-5 | Holds; its posted count depends on V-02 and V-03. |
| UJ-6 | Omits FR-26 (linking a transfer candidate), FR-28 (the near duplicate and the match), and FR-29 (both cards reconcile). §5.11 does not claim UJ-6, though the list holds FR-55. |
| UJ-7 | Holds. |
| UJ-8 | Omits FR-52 (reading income events and budgets); the pocket versus USD step has no FR (V-14). |

  In the other direction, §5.2 and §5.6 do not claim UJ-3 (which lists FR-20 and FR-33), §5.8 does not claim UJ-1 (FR-43), and §5.10 has no "Realizes" line though UJ-2 lists FR-48.

- **Other references.** S8 IDs stay within 01 to 43; U2 and U7 resolve to addendum §4; deferred items 1, 2, 4, 6, and 7 to addendum §5; decisions 1 to 8 to addendum §2; gap G9 (FR-63) to `reconcile-finance-guide.md` line 59; Open Questions 1, 2, 3, and 5 to §12. Not checked: the content behind S8 and F7 IDs (the assessment is local and outside this review's inputs), GitHub issue numbers (no web access in this review), and guide phase 7 at FR-34 (the private plan, not opened, by rule).
