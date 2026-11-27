# Gate triage: medium and low findings, 2026-11-27

Scope: the medium and low findings and the rubric's mechanical notes in `review-rubric-post-final-2026-11-27.md`, `review-edge-cases-post-final-2026-11-27.md`, and `review-verification-post-final-2026-11-27.md`, merged and checked against `prd.md`, `addendum.md`, and the rulings at `.memlog.md` lines 94 to 123. The compliance lows C-1 to C-4 are skipped (applied, memlog line 122). The gate items G-1 to G-12 were ruled and applied while this triage ran (memlog lines 119 to 123), so it reads the text after them: no edit below falls inside their applied text, and a gap left inside that text is deferred with a default.

Line numbers are for the working copy as it stood after memlog line 123 (files unchanged since 10:37, UTC-5). Each current text below occurs exactly once in its file (checked by script), so apply by text; A1's inserted line shifts later `prd.md` lines by one.

Rubric IDs, in file order: RB-M1 confirmation set dates and creation state; RB-M2 three void and undo paths; RB-M3 write cap calls and windows; RB-M4 NFR-1 rounds twice; RB-M5 goal in another currency; RB-M6 plan when later extras breach alone; RB-M7 R-5 and a purchase's own rate; RB-M8 what the forecast leaves out; RB-M9 undoing a creation others depend on; RB-M10 FR-42's hidden deferral; RB-M11 UJ-4 confirmation order. RB-L1 to RB-L7 are its lows in order, RB-N1 to RB-N8 its mechanical notes in order.

Counts: 33 autofix, 3 needs owner, 20 defer, 3 reject, 9 covered (68 merged items from 99 findings; a finding whose parts take different dispositions is split, each part named).

## Autofix

**A1. Statement entry as one unit.** EC-48, V-7, RB-M1 (dates), RB-N2 (no glossary entry). The closing date dates the closing balance, so it waits with it under L-4's one confirmation.
- `prd.md` 966: ``statement entry (closing balance, and for a card its minimum payment and printed payment due date)`` becomes ``statement entry (closing balance and date, and for a card its minimum payment and printed payment due date)``
- `prd.md` 581: ``A closing balance, minimum payment, or printed payment due date that Claude enters takes effect only once the owner confirms the statement entry, with one confirmation for all three (FR-65).`` becomes ``A closing balance and date, minimum payment, or printed payment due date that Claude enters takes effect only once the owner confirms the statement entry, with one confirmation for all of them (FR-65).``
- `prd.md` after 136 (Statement period), insert: ``- **Statement entry**: the values entered for one statement: its closing balance and closing date and, for a card, its minimum payment and printed payment due date. When Claude enters them, they wait for one confirmation by the owner (FR-29, FR-65).``

**A2. R-6 follows the confirmation.** RB-M11 (R-6 half).
- `prd.md` 225: ``A card's minimum payment is the figure its statement states, entered with the statement (FR-29), at high confidence.`` becomes ``A card's minimum payment is the figure its statement states, entered with the statement and in force once the statement entry takes effect (FR-29, FR-65), at high confidence.``

**A3. Compute responses name waiting inputs.** RB-M11 (FR-53 half). A waiting input is not "used", so no response mentions it today.
- `prd.md` 906: ``Each response names every Claude-entered input it used that the owner has not confirmed (FR-65).`` becomes ``Each response names every Claude-entered input it used that the owner has not confirmed, and any still awaiting confirmation on the accounts it covers (FR-65).``

**A4. What the cleared balance starts from.** EC-21, V-9 (adjustments). An adjustment is a transaction no row clears, so with it the difference never reaches zero.
- `prd.md` 579: ``at the statement's precision, placing each cleared transaction by the date of the row that cleared it,`` becomes ``at the statement's precision: the opening balance or starting debt, plus each adjustment in force dated by then, plus each cleared transaction, placed by the date of the row that cleared it,``
- Note: §3 Cleared (line 160, G-1's applied text) says the cleared balance "counts only cleared transactions" and needs the same base. That sentence is the coach's call; without it, move A4 to the FR-29 epic as a defer.

**A5. Which writes the reconciliation records, and by which date.** EC-19, EC-20, V-9, RB-L2.
- `prd.md` 582: ``While a reconciliation's difference is not zero, it records each write that changes a transaction in its statement period, and shows those writes beside the result once the difference reaches zero, so how a difference closed stays visible.`` becomes ``From the statement entry, before the owner confirms it too, and while a reconciliation's difference is not zero, it records each write that creates, changes, or voids a transaction in its statement period (a cleared transaction placed by its row's date, any other by its own), and shows those writes beside the result, in the confirmation item too, once the difference reaches zero, so how a difference closed stays visible.``
- `prd.md` 583: ``A write that changes a cleared transaction in a reconciled period warns first`` becomes ``A write that changes or voids a cleared transaction placed in a reconciled period by its row's date warns first``

**A6. Rows contending for one transaction.** EC-18, V-10. Matching is one to one, so the rows not confirmed are new.
- `prd.md` 624: ``confirm one, or reject so the row posts as new (FR-28);`` becomes ``confirm one, and any other row contending for that transaction posts as new, or reject so the rows post as new (FR-28);``

**A7. Who marks a loan payment all principal.** EC-44, V-27 (who), RB-N3. PF-8's ruling (memlog line 100) says "the owner marks it all principal", which FR-37 follows; FR-32 lets Claude resolve every item. This aligns FR-32 with the ruling. The reviewers' fix (the owner or Claude) reverses the ruling's wording and would need the owner.
- `prd.md` 634: ``which only the owner confirms, in the app (FR-65).`` becomes ``which only the owner confirms, in the app (FR-65), and marking a loan or mortgage payment all principal, which only the owner does (FR-37).``

**A8. Review queue items close with their subject.** EC-17. Without it, a stale "post it as new" double counts a restored transaction.
- `prd.md` 634: ``Every resolution is logged and can be undone (FR-55).`` becomes ``Every resolution is logged and can be undone (FR-55). An item closes, logged, when an undo or a void removes what it is about: the void behind a voided-row item, the payment behind a split item, or a waiting input.``

**A9. No whole month left.** EC-37, V-28.
- `prd.md` 668: ``divided by the whole months left, rounded up to the peso or the cent, NFR-1)`` becomes ``divided by the whole months left, or all of it when less than one whole month is left, rounded up to the peso or the cent, NFR-1)``

**A10. Source account wording and a planned contribution's direction.** EC-46, V-31 (direction), RB-N2 (bare "the source" collides with the glossary's Source).
- `prd.md` 176: ``Only a transfer from the source into the funding account`` becomes ``Only a transfer from the source account into the funding account``
- `prd.md` 671: ``only a transfer from the source into the funding account`` becomes ``only a transfer from the source account into the funding account``
- `prd.md` 178: ``a scheduled income or expense with a direction, an amount, an account (two for a planned contribution)`` becomes ``a scheduled income or expense with a direction (a planned contribution, a transfer, has none), an amount, an account (two for a planned contribution)``
- `prd.md` 759: ``Each recurring event has a direction, an amount, an account`` becomes ``Each recurring event has a direction (a planned contribution has none), an amount, an account``

**A11. Reached and missed under a moving TRM.** RB-M5 (reached), EC-34 (reached, missed), V-19 (reached). States the literal reading that PF-11's reason implies (addendum §2.4: today's rate decides); a reached state that latches would be a new owner call.
- `prd.md` 673: ``- A goal whose progress reaches its target shows as reached.`` becomes ``- A goal whose progress reaches its target shows as reached; with a target in another currency, only while progress at the latest TRM covers it.``
- `prd.md` 675: ``- A goal whose target date passes short of its target shows as missed, with the amount still missing.`` becomes ``- A goal whose target date passes short of its target, judged at that date's TRM for a target in another currency, shows as missed, with the amount still missing on that date.``

**A12. Payment plan when no part of the extra fits.** RB-M6, EC-12, V-18. The largest part that fits is then zero (PF-6); this names the cause and adds the fixture.
- `prd.md` 732: ``and lists the rest as held back, naming the first day it would breach the buffer.`` becomes ``and lists the rest as held back, naming the first day it would breach the buffer. When no part fits, because a minimum payment or a later month's extra breaches the buffer without it, the plan holds back all of this month's extra and names that first breach day and its cause.``
- `prd.md` 1028: ``how much of this month's is held back and a forecast across several card cycles`` becomes ``how much of this month's is held back, one where it holds all of it back, and a forecast across several card cycles``

**A13. A day with no ranked input.** V-17 (second half).
- `prd.md` 798: ``- A day's confidence is the lowest level of any input feeding that account's balance from today through that day.`` becomes ``- A day's confidence is the lowest level of any input feeding that account's balance from today through that day, or high when no ranked input feeds it.``

**A14. What counts as a payment for the Release 1 skip.** EC-40. Keeps memlog line 86's "any payment skips the alert"; a refund is not a payment.
- `prd.md` 849: ``once a payment to that liability account has posted since its anchor`` becomes ``once a payment to that liability account (a transfer into it, never a refund or a reversal) has posted since its anchor``

**A15. Undoing a void: what the offer does.** EC-16 (first half), V-11, RB-M2 (second path), RB-N2 ("match" used for two posted transactions). Defines L-10's "offers the match"; the restored transaction stays, since restoring it was the owner's act, and under G-1 the row stays consumed.
- `prd.md` 932: ``and offers to match the two, so one charge never counts twice.`` becomes ``and offers to void that transaction, whose clearing row, if any, then clears the restored one, or to keep both, so one charge never counts twice.``

**A16. A range undo applies only what it listed.** EC-15, V-29 (second half).
- `prd.md` 933: ``lists and skips any single undo the rule above refuses, and applies only after the owner confirms.`` becomes ``lists and skips any single undo the rule above refuses, and applies only after the owner confirms, undoing only the listed writes; if a listed record changed after the list was made, it lists again first.``

**A17. Undoing a confirmation or a rejection.** EC-53.
- `prd.md` 967: ``Only the owner confirms, never Claude.`` becomes ``Only the owner confirms, never Claude. Undoing a confirmation or a rejection returns the input to waiting, with the previous value in force.``

**A18. Codes beside crypto quantities and UVR units.** EC-43, extending L-20's rule to the other units.
- `prd.md` 220: ``never a bare "$".`` becomes ``never a bare "$"; a crypto quantity carries its asset's code, and a UVR balance the label UVR.``

**A19. NFR-1 rounds a stored COP value twice.** RB-M4, EC-39, V-22 (wording). L-8 chose display rounding of the stored value; this removes the clash with "once".
- `prd.md` 1015: ``A computed value is rounded half-even once: when it is stored, or when it is shown if it is never stored. Stored COP values keep their centavos, and showing one rounds it half-even to the peso (R-1).`` becomes ``A computed value is rounded half-even once, to its minor unit, when it is stored, or once, to what is shown, when it is never stored. Stored COP values keep their centavos, and showing one rounds the stored value half-even to the peso, a display step that never changes what is stored (R-1).``

**A20. The es-CO check covers the codes.** V-34 (L-20's rule had no check).
- `prd.md` 1029: ``The es-CO output is checked for four-digit COP amounts such as 1.234 and for no stray ",00" on COP, and the holiday data`` becomes ``The es-CO output is checked for four-digit COP amounts such as 1.234, for no stray ",00" on COP, and for the COP or USD code on every amount with no bare "$", and the holiday data``

**A21. NFR-13's return step.** RB-L6 (return step).
- `prd.md` 1034: ``the owner reconnects any connected client whose grant lapsed (NFR-5)`` becomes ``the owner reconnects any connected client whose grant lapsed or that was disconnected after 30 days unused (NFR-5)``

**A22. FR-42 carries its deferral.** RB-M10. Records PF-13's deferral, revisit, and first check (memlog line 103) under C-4's rule (memlog line 122).
- `prd.md` 769: ``Once detection starts, it proposes recurring expense events rather than a second kind of record. (assessment §5)`` becomes ``Once detection starts, it proposes recurring expense events rather than a second kind of record. Price steps, skipped months, and currency drift wait for this FR's epic, revisited when detection starts; its first check is whether real descriptors carry changing reference numbers, which would split one merchant across description keys, recorded with fictional examples only (§7.1). (assessment §5)``

**A23. What the chosen options give up.** RB-L1.
- `addendum.md` 68: ``A payment lowers the debt in full until its split is entered, with a review queue item meanwhile.`` becomes ``A payment lowers the debt in full until its split is entered, with a review queue item meanwhile; until then the debt reads low, and net worth high, by that payment's interest and charges.``
- `addendum.md` 69: ``**PF-11. Goals across currencies.** Contributions convert at the latest TRM.`` becomes ``**PF-11. Goals across currencies.** Contributions convert at the latest TRM, so progress moves with the rate and a goal can leave reached with no new transaction.``

**A24. "Adds to the cost basis" reads like the rejected option.** RB-L5. Keeps PF-12's behavior (memlog line 102: the total COP cost stays, the average rises).
- `prd.md` 473: ``A fee paid in the asset lowers the quantity and adds to the cost basis: the total COP cost stays, so the average cost per unit rises.`` becomes ``A fee paid in the asset lowers the quantity and leaves the total COP cost unchanged, so the average cost per unit rises.``
- `addendum.md` 70: ``A fee paid in the asset adds to the cost basis.`` becomes ``A fee paid in the asset lowers the quantity and keeps the total COP cost, so the average cost per unit rises.``
- `addendum.md` 147: ``A fee paid in the asset adds to it, and a sell's realized gain or loss`` becomes ``A fee paid in the asset raises it, the total COP cost staying the same as the quantity falls, and a sell's realized gain or loss``

**A25. A sell records its proceeds.** V-21 (proceeds).
- `prd.md` 471: ``A buy or a sell records the quantity and its COP cost.`` becomes ``A buy records the quantity and its COP cost, and a sell the quantity and its COP proceeds.``

**A26. Addendum §4 carries NFR-6's conditions.** EC-42, RB-N5, V-24 (addendum part).
- `addendum.md` 178: ``unless a known advisory names it as its fix (NFR-6)`` becomes ``unless a known advisory names it as its fix and the owner has reviewed its changes, recorded with the advisory ID (NFR-6)``

**A27. The architecture step names the base advisory source.** RB-L6 (source), EC-31 (source), V-15 (source). NFR-6's audit covers production package dependencies only.
- `addendum.md` 174: ``unattended, and how every service is rebuilt from its patched base at least monthly and after an advisory at high or above in that base, within NFR-12's cost.`` becomes ``unattended, how every service is rebuilt from its patched base at least monthly and after an advisory at high or above in that base, and which source reports those base advisories, within NFR-12's cost.``

**A28. The recovery drill must pass before U2.** EC-32, RB-N6. A drill before U2 only helps if U2 waits for a pass, as it does for FR-15's restore check.
- `prd.md` 415: ``That procedure runs on a test deployment before the auth library upgrade (U2 in `addendum.md`), again before any later migration that touches auth tables, and at least yearly, each run recorded with its date.`` becomes ``That procedure runs on a test deployment and must pass before the auth library upgrade (U2 in `addendum.md`) and before any later migration that touches auth tables, which wait until it does; it also runs at least yearly, each run recorded with its date and result.``
- `prd.md` 1149: ``Encrypted backups and a passing manual restore check (FR-15) before the auth library upgrade`` becomes ``Encrypted backups, a passing manual restore check (FR-15), and a passing run of FR-63's recovery drill before the auth library upgrade``

**A29. §10's Release 2 line.** RB-N4.
- `prd.md` 1144: ``the per-type alert setting and the remaining alert types; the rest of FR-36, FR-37, and FR-45;`` becomes ``the per-type alert setting and the remaining alert types; the Release 2 parts of FR-29 and FR-32; the rest of FR-36, FR-37, and FR-45;``

**A30. Assumptions index roundtrip.** RB-N1, plus FR-42, which cites A-11 since G-9.
- `prd.md` 1195: ``- **A-5** (§3, FR-11, FR-26, FR-28, FR-56, §12)`` becomes ``- **A-5** (§3, FR-11, FR-26, FR-28, FR-55, FR-56, §12)``
- `prd.md` 1201: ``- **A-11** (FR-26, FR-28, FR-32, FR-35, FR-36, FR-37, FR-41, §12)`` becomes ``- **A-11** (§3, FR-26, FR-28, FR-32, FR-35, FR-36, FR-37, FR-41, FR-42, §12)``

**A31. One term: write limit.** RB-N2 (write cap and write limit). "Limit" already names the alert type and the error, so the four "cap" uses change.
- `prd.md` 864: ``bounded write tools with a per-client write cap,`` becomes ``bounded write tools with a per-client write limit,``
- `prd.md` 1051: ``and its per-client write cap,`` becomes ``and its per-client write limit,``
- `prd.md` 1189: ``added the connected client write caps to A-13`` becomes ``added the connected client write limits to A-13``
- `addendum.md` 74: ``A per-client write cap with an alert`` becomes ``A per-client write limit with an alert``

**A32. A one-off transfer names both accounts.** EC-51. FR-40 saves a one-off extra payment as a planned event, which needs the debt it pays.
- `prd.md` 179: ``- **Planned event**: a one-off scheduled income or expense with an amount, an account, and a date.`` becomes ``- **Planned event**: a one-off scheduled income or expense with an amount, an account, and a date; a one-off transfer, such as an extra payment or a goal contribution, names both its accounts.``
- `prd.md` 761: ``A planned event (amount, account, date) enters the payment plan and the forecast like an occurrence.`` becomes ``A planned event (amount, account or, for a one-off transfer, both accounts, date) enters the payment plan and the forecast like an occurrence.``

**A33. Undoing a correction re-locks at the TRM now in force.** EC-23 (first path). Restoring the old rate can bring back a manual TRM the official one has since replaced; a re-lock is still never undone on its own (L-19). The other order is G-3's refusal (C3).
- `prd.md` 221: ``undoing the correction behind it restores the date and its rate together`` becomes ``undoing the correction behind it restores what the correction changed and re-locks the transaction at the TRM now in force for its restored date``

## Needs owner

**NO-1. A goal funded by a crypto account.** RB-M5 (crypto), EC-33, V-19 (crypto); FR-35 line 665. Any account can fund a goal, whose default currency is then the asset, and no TRM converts it.
- Recommended: a funding account is a COP or USD savings account; cross-currency goals convert at the TRM alone, and saving toward crypto waits for a real need.
- Alternative: allow a crypto funding account, valued at the latest price and TRM, with the asset's precision and a stated round-up; FR-35, NFR-1's exception, and the goal fixtures widen.

**NO-2. How the hourly self-check is authorized.** EC-30, V-15 (self-check, longest absence); NFR-11 line 1032, FR-51 line 884, NFR-5 line 1019. The scripted client must hold a grant, yet FR-51 accepts only the three acceptance apps and NFR-5 lapses a read grant after 90 days, so the check reads as a false outage.
- Recommended: a fourth client identity for the self-check alone, read scope limited to one health read, its grant renewed by the owner with TOTP and alerted 14 days before it lapses; FR-51 grows by one narrow identity, and a long absence shows as a lapse alert, not an outage.
- Alternative: the self-check stops before authorization (it connects and reads the server's published metadata, holding no grant); FR-51 and NFR-5 stay as they are, but the hourly check no longer proves an authorized read works.

**NO-3. What Release 2's per-type alert setting may turn off.** RB-L3, EC-49; FR-48 line 850. It names three never-off types, which leaves payment due and failed backup or restore check alerts switchable; memlog line 84 says only that toggles arrive in Release 2.
- Recommended: the setting covers only the budget and statement expected types, so all five Release 1 types stay always on.
- Alternative: add the failed backup or restore check alert to the never-off list and let the owner turn off payment due alerts; fewer emails, but a due date then depends on the owner keeping them on.

## Defer

Each with its owner, default, and revisit condition.

**D1. A waiting opening balance or starting debt.** RB-M1 (creation state), EC-11, V-8; FR-18 line 439, FR-65 line 967. Owner: the epic that builds FR-65, with the UX step. Default: the opening balance and opening date wait as one entry; meanwhile the account counts from zero and shows the waiting values; after a rejection the owner enters the value once in the app as the creation value, not as an adjustment. Revisit: when the UX step designs the confirmation item.

**D2. Per-record choices inside a range undo.** RB-M2 (range path), EC-14, V-29 (first half); FR-55 line 933, FR-25 line 518. Owner: the epic that builds FR-55, with the UX step. Default: the preview lists each post-as-new, import-match, and likely-duplicate choice with "keep the row skipped" and "keep both" preset, changeable before the owner confirms. Revisit: when the UX step designs the range undo preview.

**D3. Write limit windows, counted calls, and alerts.** RB-M3, EC-26, EC-27, V-13; FR-54 line 917, FR-48 line 852, A-13. Owner: the epic that builds FR-54, which revisits A-13 (PF-16). Default: clock hours and Bogotá days; a call counts once whatever rows it carries, one staging call per statement up to A-14's 5.000 rows; a refused call or a scope error does not count; one alert per client and window, none hourly once the daily limit holds, sent within 5 minutes. Revisit: when that epic revisits A-13, or if a normal import or NFR-13's catch-up reaches the limit.

**D4. Members of "what the forecast leaves out".** RB-M8; FR-44 line 792. Owner: the epic that builds FR-44. Default: each unestimated category and each generated transfer side still pending outside balances (FR-26); waiting inputs are named through FR-53 (A3). Revisit: when the FR-44 fixtures are written.

**D5. Forecast input edges.** EC-22 (first half), EC-13, V-17 (first half); FR-44 lines 791, 793, 795. Owner: the epic that builds FR-44; NFR-10's several-cycle fixture pins the cycle bound. Defaults: a covered month is a closed month the ledger holds from its first day, and with none a category projects its budget or is unestimated; a split uses live accounts only (FR-12) and, when empty, lands on the account of the category's latest spending or joins the left-out list; each projected card cycle sums spending after the previous cut day through its own (inside G-5's text); a budget-only projection is medium, as line 790's higher-of rule gives (inside G-7's text). Revisit: when the FR-44 fixtures are written.

**D6. Goal details.** RB-M5 (amount currency), EC-33 (tolerance side), V-31 (currency), EC-34 (progress below zero), EC-35; FR-35 lines 669 to 671, FR-41 line 763. Owner: the epic that builds FR-35 and FR-41. Defaults: a planned contribution's amount is in its source account's currency and A-11's tolerance reads the source side; progress never shows below zero; a contribution or withdrawal mark names one goal, and a transfer that could fulfil occurrences of two events goes to the review queue. Revisit: when the goal plan fixtures are written, or after NO-1.

**D7. Crypto quantities at the edges.** EC-36, V-21 (fee order, bounds); FR-21 lines 471 to 474. Owner: the epic that builds FR-21, with the architecture step's scale (addendum §3.6). Defaults: a sell or a fee above the held quantity is refused; at zero quantity the remaining COP cost posts as a realized loss; a fee in the asset on a sell applies before the realized result; a COP or USD fee adds to a buy's cost and lowers a sell's proceeds; a move between two crypto accounts of one asset carries cost at the average; NFR-10's money layer check adds the largest quantity and price, one unit more rejected. Revisit: when the architecture step sets the crypto scale.

**D8. Classes tested again at confirmation.** EC-38; FR-27 line 547, FR-28 line 559. Owner: the import epic. Default: the tests run again when the owner or Claude confirms, any changed class shows before posting, and an account holds one open staging at a time. Revisit: when the import epic designs staging.

**D9. Undoing a manual TRM entry.** EC-23 (rest); FR-20 line 462, R-2. Owner: the epics step, inside FR-20's fix-first work. Default: its transactions return to rate pending (FR-20) until a TRM covers the date, and the undo is refused once the official TRM replaced it (R-2). Revisit: when the epics step marks FR-20's consequences.

**D10. Loan splits across the releases.** EC-24, EC-25, V-27 (date, Release 2); FR-37 lines 708 to 712. Owner: the epic that builds FR-37, whose Release 1 story takes the date. Defaults: entered interest and charges post on the payment's date; at Release 2's first deploy the computed schedule fills each payment still awaiting its split as a labeled estimate and closes its item, a lender's split still replacing it; the installment check compares the installment net of its fixed charges under the loan's method and ignores a rounding difference. Revisit: at Release 2 planning.

**D11. Statements entered out of date order.** EC-54, V-30; FR-29 line 578, NFR-13. Owner: the epic that builds FR-29. Default: periods follow closing date order; a statement whose closing date precedes the account's latest one warns, naming that statement, and re-derives the later period. Revisit: when the FR-29 stories are written.

**D12. Detection details.** EC-41, V-23, RB-L4 (account half); FR-42 lines 772 and 776. Owner: the FR-42 epic, holder of PF-13's deferral. Defaults: population standard deviation; band ends inclusive on the average; a twice-monthly charge is added by hand (FR-41's twice-a-month rule); the price change test reads only charges on the subscription's account (inside G-9's text). Revisit: when detection starts.

**D13. The official UVR replacing a manual one.** V-25, EC-50; FR-23 line 492, FR-46 line 822. Owner: the epic that builds FR-23, only if Open Question 1 resolves yes. Default: the replacement is final, like an official TRM re-lock (R-2), and stored values that used the manual UVR follow the official one. Revisit: when Open Question 1 resolves.

**D14. Unattended upkeep.** EC-31 (major version), EC-45; NFR-13 line 1034, addendum §3.9. Owner: the architecture step. Defaults: a scheduled rebuild keeps each service's major version, and a major change goes through the upgrade plan after a passing manual restore check (FR-15); every service starts on its own after a host restart, and a job missed meanwhile runs on start. Revisit: when the architecture step picks the update and rebuild mechanisms.

**D15. The one job list stays complete.** RB-N7, V-15 (rebuild age); addendum §3.2. Owner: the architecture step, which picks the runner. Default: every scheduled job it creates joins the list, the monthly rebuild if scheduled, and FR-34's month close and NFR-5's 30-day disconnect if they run as jobs, so NFR-11 flags any that stalls. Revisit: when the architecture step picks the job runner.

**D16. Where the drill is recorded, and a missed year.** V-32; FR-63 line 415. Owner: the epic that builds FR-63, with the UX step. Default: each run shows beside the restore check results (FR-15) and is flagged 12 months after the last one. Revisit: when the UX step places job health and restore results.

**D17. FR-16's observables on the deployed host.** V-33; FR-16 lines 395 and 397. Owner: the epic that builds FR-16, with addendum §3.1. Default: one command from a clean checkout builds and starts the app, the database, and the job runner, and each deploy records a check from outside the host that none of the deployment's services answers except through the HTTPS front (FR-6, baseline, assessment §4). Revisit: when the architecture step settles §3.1.

**D18. Which version may skip the 7-day delay.** V-24 (versions), EC-52; NFR-6 line 1020. Owner: the epic that builds FR-8's deploy check. Default: the exception covers the version the advisory names, also when it arrives as a dependency of a direct dependency; any other version it needs that is under 7 days old goes to the owner first. Revisit: the first time a fix needs another version under 7 days old.

**D19. Rounding cases in the money layer fixtures.** V-22 (cases); NFR-10 line 1028. Owner: the epic that builds the money layer (FR-19). Default cases: ,50 on an even and an odd peso, a value just above half, a stored value shown to the peso, and FR-35's round-up in COP and USD. Revisit: when the money layer fixtures are written.

**D20. Undoing a void when the duplicate came first.** EC-16 (second half); FR-55 line 932. Owner: the epic that builds FR-55. Default: the warning and A15's offer cover any live likely duplicate, whenever it posted, since a range undo can restore a void Claude made of a real duplicate; L-10's case stays as written. Revisit: when the range undo is built.

## Reject

**R1. Frontmatter.** RB-N8. Memlog line 115 sets the frontmatter at Close.

**R2. The months behind an unused category's split.** EC-22 (months). PF-5's "same months" reads as the split months every category uses (line 793), and the reconcile checked PF-5 as ruled (memlog line 114).

**R3. One rule per bullet.** RB-L7. The epics step takes acceptance criteria one consequence at a time from any bullet; splitting now would churn lines the gate rulings just rewrote.

## Covered

**C1. Covered by G-1.** RB-M2 (kept-skipped path): a row the owner kept skipped is a consumed row (line 158).

**C2. Covered by G-2.** EC-47: line 518 reads per voided transaction, so each side of a voided transfer that a row cleared by a match gets its own choice.

**C3. Covered by G-3.** V-26: an official re-lock since the correction changed the rate, so the correction's undo is refused and names it (line 930).

**C4. Covered by G-4.** RB-M9, V-12: line 931 refuses undoing a referenced create and names the records; "counts in SM-C1" is harmless, since SM-C1 counts only Claude transactions (line 1173).

**C5. Covered by G-6.** V-16, EC-55: line 794 sends each later month's extra as each debt's share by the payoff method, so the shares follow FR-38's schedule and end with the last debt.

**C6. Covered by G-8.** RB-M7, V-20: R-5 (line 224) moves only purchases at the card's rate, and FR-36 (line 689) dates every card rate change.

**C7. Covered by G-9.** RB-L4 (band overlap half): FR-42 (line 776) holds a band charge until resolved, and FR-41 (line 763) defers to it; the account half is D12.

**C8. Covered by G-11.** EC-28, EC-29, V-14: the age checks run hourly (addendum line 107), and NFR-11 (line 1032) judges only jobs in use; alert sends keep FR-48's failed-send rule (line 852).

**C9. Covered by G-12.** RB-M11 (UJ-4 order): UJ-4 (line 74) confirms the statement entry before the plan; its R-6 and FR-53 halves are A2 and A3.
