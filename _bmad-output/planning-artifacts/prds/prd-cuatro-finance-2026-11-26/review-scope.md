# Review: scope minimalism

## Verdict

The PRD is already lean where the owner cut (the payment solver, bank sync, n8n, Telegram, the tax features, in-app LLM calls, the precomputed forecast table), and its baseline, backup, and audit requirements are load-bearing and stay. Its excess sits in planning machinery with no history to read at launch, derived data stored twice, two engines for one debt comparison, and two exceptions to one currency per account, while the §10 release line does not close over its own dependencies. A first release drawn by dependency (47 FRs, many trimmed, listed at the end) starts the SM-1, SM-2, and SM-3 clocks while that history builds up for the planning release.

## Findings

Read in full: `prd.md`, `addendum.md`, and `.memlog.md`. Every product call in the PRD was the owner's (decision log), so each finding is a proposal for the owner to accept or reject, never a correction; where one touches a recorded pick, it names the area or decision. None proposes cutting security, validation, data-loss protection, accessibility, or correctness.

Severity: high when cutting or deferring clearly speeds a working version without real loss; medium when it saves real work at a small, named cost; low for small trims and document hygiene. Counts: 4 high, 11 medium, 7 low.

### F1 (high). §10, NOTE FOR PM: the release line does not close

- **Cut or defer:** replace the section-based line with the dependency-based one in the last section. FRs inside its first release call FRs it puts in the second: FR-13 sends the root address to the dashboard (FR-45, §5.9); FR-15's failed restore check and FR-51's new connection alert send through FR-48 (§5.10); FR-26 routes unmatched transfer candidates to the review queue (FR-32, §5.5) and splits loan payments by the installment schedule (FR-37, §5.7); FR-27's preview and FR-56's capture apply rules and categories (FR-31, FR-30); FR-28 flags near duplicates for review (FR-32); FR-18 and FR-22 put card and loan terms on the account (FR-36, FR-37).
- **Still covered:** each of those needs sits in the proposed line, at its smallest useful size.
- **Risk:** none in fixing it. Left as is, the epics step pulls these FRs in piecemeal, or ships the AI connection without the new connection alert that Area H requires.

### F2 (high). FR-42 Subscription detection

Also: the Subscription term (§3), FR-41's confirmed subscriptions, the subscription parts of FR-52 and FR-54, and the subscriptions screen in FR-60.

- **Cut or defer:** defer detection, subscription statuses, the unwanted flag, and the price change flag until the ledger holds six months of card and account history. Until then a subscription is a recurring expense event (FR-41) that the owner or Claude adds.
- **Still covered:** the forecast and the payment plan read recurring events, so a hand-added subscription feeds them as a confirmed one would, and UJ-3's match becomes a match to that event. The owner never used the app (decision log), so unless six months of statements are imported first, the weekly scan has nothing to read at launch. No success metric validates FR-42.
- **Risk:** no prompt about forgotten or unwanted subscriptions in the first months, against an Area E pick. When detection returns, it proposes recurring events instead of feeding a second entity.

### F3 (high). One currency per account: R-4 and FR-36 (A-3), FR-21

- **Cut or defer:** hold the glossary's rule that an account has one currency (§3, Account) with no exception. A card's USD sub-balance becomes its own card account in USD, sharing the card's due dates; each crypto asset gets its own crypto account instead of several positions in one.
- **Still covered:** A-3 stays true as a fact about cards. Balances, transfers, reconciliation (one closing balance per account, FR-29), net worth, the payment plan, and payoff math never meet an account in two currencies, and paying the USD side in COP is the COP to USD conversion transfer FR-26 already defines.
- **Risk:** one physical card shows as two accounts (the UX step can group them), and a statement covering both sides stages its rows into two accounts. Where a statement gives one combined minimum for both sides, the payment plan needs a link between the two accounts, still far smaller than a two-currency balance.

### F4 (high). Derived data stored twice: FR-46 and FR-34

Also: the snapshot job (addendum §3.2) and its line in NFR-11.

- **Cut or defer:** store neither the daily balance snapshot nor the month-close copy. Compute past balances, net worth history, and budget history on read from the ledger, each month's budget limit, and the rates and prices FR-20 already stores; cache only if measured slow, the rule addendum §3.6 already applies to the forecast (S8-16).
- **Still covered:** FR-34's read tool, FR-46's history, and decision 6's year-end balances all come from that one computation, and a late import or a correction to a past month shows in history instead of leaving a stale copy.
- **Risk:** FR-33 must keep each month's limit as its own record (UJ-7 already writes next month's budgets), so changing a limit never rewrites the past. A day with no stored rate or price uses the last good value with its date (FR-20, NFR-8). The snapshots were picks in Areas C and F; the behavior stays, only the stored copy goes.

### F5 (medium). Computed views as tools, not screens: FR-60 with FR-38, FR-40, FR-44, FR-46, FR-47

- **Cut or defer:** ship the forecast, payoff comparison, payment scenarios, net worth history, and spending report as compute and read tools (FR-52, FR-53), with their headline figures on the dashboard (FR-45), and defer their dedicated screens and any chart.
- **Still covered:** the thesis has Claude do the work (SM-C2), and compute responses carry their figures, rate dates, and confidence. FR-47's drill-down is the feed filtered by category and period (FR-24), and every write stays visible in the feed and the audit log (FR-55). Entity screens stay: budgets, goals, recurring events, and debts with this month's payment plan. With no chart in the MVP, the chart series part of Open Question 5 waits too.
- **Risk:** the owner cannot browse a forecast or a report without Claude. The single report was the owner's pick (Areas F and G), so this one is squarely the owner's call; the screens reuse the same computations when wanted.

### F6 (medium). Debt schedules and terms out of the first release: FR-22, FR-36, FR-37, R-5, R-6

- **Cut or defer:** in the first release, record the data and take the figures from statements. Each card purchase records its number of cuotas (kept now because it is hard to recover later); the minimum payment is the statement's figure (R-6, first clause); a loan or mortgage payment posts with the principal, interest, and charges that the lender's statement states, which Claude reads as it reads a card statement (UJ-4). EA rates, interest terms as data, installment schedules, payoff dates, and R-6's estimate between statements join the planning release that reads them (FR-38 to FR-40, FR-44).
- **Still covered:** SM-1 reconciles against the lender's own figures, and FR-26's "any other charges" can only come from a statement, since FR-37's terms carry no charges field. Nothing in the first release reads a schedule.
- **Risk:** until the planning release, each loan payment needs its split from the statement (by Claude or by hand), and a card shows no estimated minimum before its first imported statement.

### F7 (medium). FR-38 and FR-40 are one comparison

- **Cut or defer:** merge them into one comparison over payment options: minimum only, a monthly extra by avalanche or by snowball, or a one-off amount, for one debt or all. Each option returns payoff date, total interest, interest saved against the minimum, and the forecast's lowest balance with its confidence. FR-39 applies the saved option to this month.
- **Still covered:** every consequence of both FRs, FR-38's explanation of what each method optimizes included. FR-38's "saving against paying only the minimum payments" and FR-40's "interest saved against the minimum" are already the same figure.
- **Risk:** none in behavior. One engine, one compute tool, and one fixture set (NFR-10) instead of two.

### F8 (medium). FR-49 Weekly digest, and FR-48's per-type setting

- **Cut or defer:** cut the digest from the MVP and defer the setting that turns each alert type on or off.
- **Still covered:** the digest is off by default and carries only counts that the dashboard and the alert list already show, and Claude briefs on demand (decision 5). Before budgets exist, FR-48 sends three types: payment due, new connected client (always on by decision), and failed backup or restore check, which as data-loss protection should not be silenced either. All on, no setting.
- **Risk:** the owner cannot mute payment reminders until a type proves noisy. FR-54's ban on changing alert settings still holds.

### F9 (medium). FR-44's averaged confidence tiers

- **Cut or defer:** ship the forecast with its high inputs (recurring events, minimum payments, installments, planned contributions) and variable spending at each category's budget, and defer the 3-month and 12-month averages until that much history exists. Irregular costs the owner knows, such as UJ-8's yearly insurance, are yearly recurring events, which are high confidence.
- **Still covered:** UJ-4 and UJ-8 run on budgets and recurring events. The deferral also avoids a misreading in the first months: with under three months of history, every category has spending in fewer than 3 of the last 6 months, so the irregular rule as written classes all of them as irregular and forecasts them at a 12-month average of a short history, a fraction of their real rate, with their budgets ignored.
- **Risk:** a category with no budget adds nothing until history exists, so the lowest balance can read high; the forecast should name the categories it leaves out. The tiers were an Area E pick.

### F10 (medium). Rate and price fallbacks: FR-20, FR-21, FR-23

- **Cut or defer:** load the TRM history once, from the ledger's earliest date, and append daily. When a date's rate is still missing, refuse the USD write with that reason, so Claude or the owner retries or enters the rate by hand (FR-20's last resort). Drop the pending rate and the provisional totals. Defer the manual crypto price until an asset the price source lacks is held, and the manual UVR until its source fails for longer than the stale label covers.
- **Still covered:** R-2 holds (nothing locks at a stale rate), and no total ever includes an unlocked amount, so totals, net worth, the forecast, and compute responses need no provisional handling, which the PRD specifies nowhere outside FR-20. The last good value with its date (FR-20, NFR-8) covers valuation outages. The manual TRM stays, because a lock needs one specific date's rate.
- **Risk:** a USD transaction dated on a day the rate source fails waits for a retry or a hand-entered rate.

### F11 (medium). FR-21's cost basis and unrealized gain or loss

- **Cut or defer:** keep recording each buy and sell with its quantity and COP cost, the data decision 6 keeps for the tax features, and defer computing cost basis and gain or loss until those features fix the method. The PRD names none, and after any sell, average cost and a lot method give different figures.
- **Still covered:** net worth needs only the valuation, and no journey or success metric reads a gain or loss.
- **Risk:** Claude cannot quote a gain or loss until then, since A-1 bars it from computing its own.

### F12 (medium). FR-55's undo when a later record depends on the write

- **Cut or defer:** refuse that undo and name the later write that depends on it, instead of explaining and applying the knock-on effect (UJ-6's edge case).
- **Still covered:** a refused undo changes nothing, so nothing is lost, and undo stays one step for every write without dependents, the common case. Area H's rule that any Claude change is undoable in the app still holds, in order.
- **Risk:** in the rare dependent case the owner undoes or edits in order, one more step.

### F13 (medium). Open Question 1 before the architecture step: FR-23

- **Cut or defer:** answer Open Question 1 before architecture rather than keeping UVR optional (§12). A yes builds FR-23 once; a no deletes the UVR fields.
- **Still covered:** the answer is on the mortgage's own statement.
- **Risk:** none. Kept open, the UVR source, its daily job, R-8's precision, issue 33's validation, and NFR-10's published-value fixtures become optional work in every design.

### F14 (medium). The job runner: addendum §3.1 and §3.2

- **Cut or defer:** take the addendum's second candidate, a single scheduled runner, over a queue library. Each job runs as an idempotent task on a fixed schedule (for example hourly, skipping work already done that day) and records its run where NFR-11 reads it. Backups run on a host or database schedule outside the app, so they never depend on the app being healthy.
- **Still covered:** after F2 and F4 the list is at most seven daily, weekly, or monthly jobs for one user, and none needs the lead candidate's retries, dead-letter queues, or enqueueing inside a transaction. If the runner lives in the app's process or container, the job runner clauses of FR-6 and FR-16 fall away, and FR-6 holds for the database as written.
- **Risk:** no retry sooner than the next scheduled run, which no listed job needs; one fewer dependency for NFR-6 to watch.

### F15 (medium). Delete before upgrading: addendum §4 (U3) and §5 (item 3)

- **Cut or defer:** settle U3's own closing question (whether storybook and shadcn stay once FR-58 builds the component vocabulary natively) before U3 runs, and remove them rather than upgrade them if they go. Remove the unused testing-library packages now (item 3); component tests can add them back.
- **Still covered:** the vite and vitest parts of U3 stay, since they close the vite part of issue 36.
- **Risk:** none if the question is settled first; fewer packages shrink what NFR-6 watches.

### F16 (low). FR-41's frequencies and R-9's holiday override

- **Cut or defer:** "every N days or months" already covers weekly, every two weeks, monthly, and yearly, and FR-41's own month-end rule makes "monthly on the last day" the same as monthly on day 31, so three rules (every N days, every N months on a chosen day, twice a month on two chosen days) cover all seven listed cases. Defer the owner's ability to add or remove a holiday until the holiday library is wrong on a date that matters; its updates already keep holiday data current (addendum §3.4).
- **Still covered:** every listed frequency and every business-day shift.
- **Risk:** if the holiday law changes faster than the library plus NFR-6's 7-day delay, a shift can be a day off until the update; reminders fire three days ahead (A-9). The override was an Area E pick.

### F17 (low). Fields and filters with no consumer

- **Cut or defer:** FR-36's credit limit (entered in UJ-1) and FR-37's original principal are fields no FR reads; FR-24's amount range filter, FR-31's amount range narrowing, and FR-55's audit log filters by client and by tool serve no journey. Defer each until a real case.
- **Still covered:** the feed's account, category, date, source, and text filters (UJ-6 finds Claude's writes by source and week), account narrowing on rules, and the audit log's date filter.
- **Risk:** small; each returns as one field or one filter.

### F18 (low). FR-27's formats

- **Cut or defer:** extend the rule "OFX only if an account offers it" to XLS and CSV, and build only the parsers the note behind Open Question 4 names, one at a time.
- **Still covered:** Claude stages rows from any file it can read through the same checks (FR-54, FR-28).
- **Risk:** none.

### F19 (low). Rules stated twice, and one in the wrong document

- **Cut or defer:** keep each rule in one home and cite it elsewhere: the landing screen (FR-13, FR-45, §3 Dashboard); the clean-checkout build (FR-16, FR-17); revocation and the 30-day disconnect (FR-51, NFR-5); failed-job visibility (FR-15, NFR-11); TOTP on every session (FR-2, NFR-4); account numbers and alert content (NFR-7, FR-18, FR-48, FR-52, §7.1). Move R-12, which governs only the deferred tax features, to addendum §6.
- **Still covered:** no rule is dropped, and the epics step writes one acceptance test per rule.
- **Risk:** none.

### F20 (low). NFR-9's 20,000 transaction target

- **Cut or defer:** build the 20,000 transaction load harness on the target host when the ledger nears that size or a screen feels slow; meanwhile, measure the 1 and 2 second targets on real data and a modest fictional seed.
- **Still covered:** the Lighthouse runs on the dashboard and the feed, whose accessibility score of 100 is load-bearing and stays.
- **Risk:** a slow query pattern can land early; the 1 second target on real data catches the visible cases.

### F21 (low). FR-50's Claude Code acceptance

- **Cut or defer:** optional. Both claude.ai web and Claude Desktop cover every journey; Claude Code adds a second authorization flavor (UJ-2's edge case, the loopback redirect) and its tests, and could follow the first release.
- **Still covered:** the two other clients.
- **Risk:** the owner cannot reach the ledger from Claude Code until then. It was the owner's pick (Area H).

### F22 (low). FR-15's export

- **Cut or defer:** a backup taken as a plain database dump, decrypted per the runbook, is already a complete export the owner can take at any time, so per-type export files can wait.
- **Still covered:** every backup, off-server copy, restore check, and runbook requirement in FR-15 stays as written.
- **Risk:** the export is a database dump rather than files a spreadsheet opens.

### Examined and kept

Not flagged, because they are load-bearing or already minimal: the whole baseline (FR-1 to FR-17 and FR-63), backups, both restore checks, and TOTP recovery included; FR-28's duplicate and match rules, and FR-29, which SM-1 measures; FR-55's log of every call and of every write from every source, which one data access layer (addendum §3.6) makes simpler than logging some sources; the always-on new connection alert and the 30-day disconnect; NFR-3 with its manual pass; NFR-10's money layer coverage and outside fixtures; NFR-6's 7-day rule; FR-57, which already stores nothing for a capability gap; and the owner's cuts in §9.2.

## A minimal first release

The NOTE's line is drawn by section, and F1 shows it does not close. This one is drawn by dependency: the smallest set in which every FR's calls resolve, which starts SM-1, SM-2, SM-3, and SM-C1 at launch, and which leaves planning until the ledger holds the history it reads (F2, F9). It holds more FRs than the NOTE's line, not fewer: it adds the seven FRs the NOTE's line calls but leaves out (FR-30, FR-31, FR-32, FR-36, FR-37, FR-45, FR-48) and FR-53's spending figure, which Claude needs to answer a spending question under A-1, and it moves FR-21 and FR-22 out. It is sharper in what each FR carries.

**Release 1: the ledger Claude manages. 47 FRs, plus FR-23 if Open Question 1 is yes.**

- Baseline, all of §5.1: FR-1 to FR-17 and FR-63 (export per F22 if the owner agrees).
- Accounts and money: FR-18, FR-19, FR-20 (F10), with one currency per account (F3); FR-36 and FR-37 limited to the payment due day, each purchase's number of cuotas, the statement's minimum payment, and the month-end rule (F6).
- Ledger: FR-24 (F17), FR-25, FR-26 (loan splits from the statement, F6).
- Import and reconciliation: FR-27 (F18), FR-28, FR-29.
- Categorization: FR-30, FR-31 (F17), FR-32.
- Dashboard and alerts: FR-45 with net worth over the accounts this release holds, the debt summary, and the review queue count; FR-48 with three alert types, all on (F8).
- AI connection: FR-50 (F21), FR-51, FR-52 and FR-54 over the records above, FR-53 for spending by category for a period only, FR-55 (F12), FR-56, FR-57.
- Redesign: FR-58, FR-59, FR-61, FR-62, and FR-60 for this release's screens (sign-in and TOTP, dashboard, accounts, feed, import, categories and rules, review queue, alert list, connected clients and audit log, settings).

It completes UJ-2, UJ-5, and UJ-6 (with F12's edge case) and the ledger parts of UJ-1, UJ-3, and UJ-4, and carries their end-to-end checks (NFR-10). The UX step can design these screens and the shared patterns first (§10, item 6), and the planning screens when release 2 starts.

**Release 2: planning and valuation. Starts SM-4.** FR-21 (one asset per account, buys and sells with quantity and COP cost; F3, F11), with the money layer's crypto precision change (§10, item 5) moving with it; FR-22 and the rest of FR-36 and FR-37 (F6); FR-33; FR-34 and FR-46 computed on read (F4); FR-35; FR-38 merged with FR-40 (F7); FR-39; FR-41 (F16); FR-43; FR-44 (F9); FR-47 as a compute tool (F5); FR-48's budget alerts; the rest of FR-53; and screens for budgets, goals, debts with this month's plan, and recurring events. It completes UJ-1, UJ-4, UJ-7, and UJ-8.

**Later, each on its trigger.** FR-42 after six months of history (F2); the averaged forecast tiers once that history exists (F9); crypto cost basis and gain or loss with the tax features (F11); computed-view screens and charts when the owner wants them without Claude (F5); the alert setting when a type proves noisy (F8); the manual crypto price and UVR on a real gap (F10); holiday overrides when the library errs on a date that matters (F16); the 20,000 transaction harness (F20); per-type export files (F22). Cut: FR-49 (F8).

**Smaller still, not recommended.** If the owner accepted Claude's transcription for every statement file in release 1, FR-27's upload, parsers, and mapping screen (and UJ-5) could move to release 2, since Claude stages rows through the same checks (FR-54, FR-28). That would give up decision 4's deterministic parse of XLS and CSV in exactly the months SM-1 starts measuring, so this review does not recommend it.
