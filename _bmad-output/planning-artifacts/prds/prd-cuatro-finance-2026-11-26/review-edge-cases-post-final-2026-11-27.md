# Edge-case review of the post-final update: Cuatro Finance PRD

Reviewer gate of the post-final update (memlog line 116), edge-case lens (`.claude/skills/bmad-review/references/lens-edge-case-hunter.md`), run on 2026-11-27. Scope: the working-tree changes to `prd.md` and `addendum.md` against git HEAD, and how they interact with the rest of both files. Line numbers point at the working copies. A finding already listed in sections 3 to 6 of `review-post-final-2026-11-27.md` is not repeated; "from PF-n" or "from L-n" marks a finding about how that ruling was applied. This file changes no requirement.

Method: every new or changed rule, consequence, glossary entry, and number was traced through boundaries, ordering, empty and first-time states, repeated and concurrent actions, Release 1 and Release 2 states, currency and date edges, and the interplay of undo, void, matching, and owner confirmation. Handled paths are not listed. The lens's deletion check added EC-18. No claims file was named, so the claims check did not run.

Severity, for the gate's triage: critical, a downstream step would build the wrong thing; high, a real gap or contradiction a downstream step would trip on; medium, an ambiguity with a sensible default; low, wording.

Counts: 0 critical, 10 high, 29 medium, 16 low.

Each finding gives its location, the trigger condition, a guard that closes the gap, and the consequence, with a short path where several rules chain.

## High

### EC-01 (high). The duplicate tests take the amount from the transaction, not the row (from PF-1)

- **Location:** `prd.md`:559, 562, 564 (FR-28); :155, 157, 159 (§3 Duplicate, Near duplicate, Cleared); :512 (FR-25); :689 (FR-36).
- **Trigger:** a cleared transaction whose amount differs from the row that cleared it.
- **Guard:** keep each consumed row's date, description key, and amount, and test staged rows against those kept rows; confirming a near-amount match sets the transaction to the row's amount.
- **Consequence:** re-importing an overlapping file posts those rows again, against line 559 and UJ-5.
- **Path:** FR-25 lets a cleared transaction's amount change; a match within 15 percent of a Claude capture (line 562) does not take the row's amount; a first-cuota row posts the purchase's original value, which need not be the row's amount, and a later-cuota row links to its purchase and posts only interest (line 689), so no cleared transaction carries that row's amount and nothing marks the row as already consumed.

### EC-02 (high). Undoing a row's own posting offers to post the row again (from PF-14 and L-10)

- **Location:** `prd.md`:517 (FR-25); :929, 933 (FR-55); :622, 630, 633 (FR-32); :159 (§3 Cleared).
- **Trigger:** voiding a transaction that its own row posted, by undoing that posting.
- **Guard:** when the row posted the transaction, undoing that posting keeps the row skipped with no prompt; the post-as-new choice applies only to a transaction a row cleared by a match.
- **Consequence:** undoing a wrong import, by default, posts every row again.
- **Path:** §3 Cleared counts "posting from that row" as clearing; FR-55 makes undoing a create a void; FR-25 then warns that "the row that cleared it will post as new". The same loop follows undoing a "post it as new" resolution (line 630, undoable under line 633) and a near-duplicate "keep one" that keeps the staged row and voids the cleared transaction (line 622).

### EC-03 (high). A row kept skipped stays skipped for one import only (from L-10)

- **Location:** `prd.md`:517 (FR-25); :630 (FR-32); :559 (FR-28); :110 (§3 Void).
- **Trigger:** re-importing an overlapping file after the owner kept a voided transaction's row skipped.
- **Guard:** record a kept-skipped row with its date, description key, and amount, and have the duplicate test list and skip a staged row equal to it.
- **Consequence:** the next import classes the row as new, and it posts unless the owner spots it.
- **Path:** the row's date and key live on the voided transaction, and voided records take no part in the duplicate tests.

### EC-04 (high). The undo refusal counts undos as later writes (from PF-14 and PF-16)

- **Location:** `prd.md`:928, 931, 934 (FR-55).
- **Trigger:** undoing a write whose fields a later write changed, after that later write was undone.
- **Guard:** refuse an undo only while a field's current value differs from the value that write set, so a later write already undone no longer blocks it.
- **Consequence:** an edited record's creation can never be undone; a range undo skips every such create.
- **Path:** "When a later write changed one of those fields, the undo is refused", and "An undo ... is itself a logged write". Undoing the edit first writes the field again, so the create's undo stays refused; the range undo's newest-first order meets the same rule at each step.

### EC-05 (high). Undoing a create voids a record that others reference (from PF-14)

- **Location:** `prd.md`:929 (FR-55); :110 (§3 Void); :910 (FR-54); :362 (FR-12).
- **Trigger:** undoing the creation of an account, category, rule, goal, or recurring event in use.
- **Guard:** the undo lists the live records that reference the record and either refuses, naming them, or voids them in the same unit; state what a voided account or category does (for example, what an archived one does under FR-12).
- **Consequence:** transactions on a voided account, budgets and rules in a voided category, occurrences of a voided event.
- **Path:** FR-54 lets Claude create each of these and FR-55 lets the owner undo any write; the refusal rule reads only later writes to the record's own fields, never records that point to it.

### EC-06 (high). A passed cut day's card payment drops out of the forecast (from PF-4)

- **Location:** `prd.md`:793 (FR-44); :224 (R-6); :730 (FR-39).
- **Trigger:** a statement cut day has passed and its statement is not entered yet, or none ever was.
- **Guard:** project a payment for every cut day after the latest entered statement, a passed one included, whose following payment due date falls inside the horizon; for a card with no entered statement, start at its opening date.
- **Consequence:** the nearest card payment is missing for up to A-12's 15 days each cycle.
- **Path:** line 793 covers only "each statement cut day inside the horizon", which starts today; R-6's estimate counts purchases "up to the next statement cut day", which a passed cut day leaves ambiguous.

### EC-07 (high). After six months, a never-used category drags every day to low (from PF-5)

- **Location:** `prd.md`:789, 790, 792 (FR-44); :191 (§3 Confidence level).
- **Trigger:** the ledger covers 6 months and a category has no spending in any of them.
- **Guard:** keep a category with no spending in the covered months out of the irregular test at any ledger age: it projects its budget, or with no budget it is unestimated and outside the ranking.
- **Consequence:** unused seeded categories rank low on every account, so every forecast day reads low.
- **Path:** line 789 calls "spending in fewer than 3 of the last 6 months" irregular, which zero months meets; line 792 lands a category with no spending on every account by the split of all spending; the glossary calls the same category unestimated, so the two texts disagree. A budgeted category with no spending yet also drops from its budget to zero at month 6.

### EC-08 (high). An accepted advisory blocks every later deploy, NFR-13's rebuilds included (from PF-15 and PF-17)

- **Location:** `prd.md`:1018 (NFR-6), :1032 (NFR-13); `addendum.md`:171 (§3.9).
- **Trigger:** the owner accepts or mitigates a known advisory that has no fix yet.
- **Guard:** an advisory the owner accepted or mitigated, recorded with its ID and a revisit date, stops blocking a deploy that adds no new known advisory; NFR-13's rebuilds deploy under the same rule.
- **Consequence:** monthly rebuilds and defect fixes cannot ship until a fix exists.
- **Path:** accepting leaves it a known advisory, and "No deploy goes out with a known advisory" lets through only a deploy that removes one.

### EC-09 (high). "The card's rate on its purchase date" has no rate history to read (from PF-9)

- **Location:** `prd.md`:223 (R-5); :687, 688, 697 (FR-36); :1125 (§9.3).
- **Trigger:** a card that does not reprice changes its rate, entered late or confirmed later under FR-65.
- **Guard:** from Release 1, each card rate keeps its effective date and each purchase keeps the rate it was made at; a reprice touches only purchases at the card's rate.
- **Consequence:** Release 2 prices Release 1's pending cuotas at the new rate, or reprices a promotional one.
- **Path:** a card holds one EA rate (line 687) and a purchase stores its own rate only when it differs (line 688); Release 1's record keeping (line 1125) names no rate history, so the data is gone before Release 2 needs it.

### EC-10 (high). The price change band overlaps automatic fulfilment (from PF-13)

- **Location:** `prd.md`:775 (FR-42); :762 (FR-41); :1199 (A-11); :632 (FR-32).
- **Trigger:** a charge 5 to 10 percent off a confirmed subscription's amount.
- **Guard:** a charge in the price change band fulfils nothing until its item is resolved; test it only against an open occurrence inside A-11's date window, and only when no confirmed subscription with that key is within 5 percent; say whether "keep the old one" lets it fulfil.
- **Consequence:** the charge fulfils at once and also waits as a price change; same-key subscriptions flag each other.
- **Path:** FR-41 fulfils any charge within 10 percent automatically, while FR-42 says accepting the price change "lets that charge fulfil its occurrence"; FR-42's test has no date window and no rule for two subscriptions under one description key.

## Medium

### EC-11 (medium). A rejected opening balance or starting debt leaves no value (from L-4)

- **Location:** `prd.md`:965 (FR-65); :438 (FR-18); :626 (FR-32); :705 (FR-37); :914 (FR-54).
- **Trigger:** the owner rejects a Claude-entered opening balance or starting debt of a new account.
- **Guard:** state what the account holds while the value waits, and let the owner enter the value on rejection as the one set at creation rather than as an adjustment.
- **Consequence:** "the previous value, if any" is none; FR-18 allows only an adjustment, and FR-37's debt has no start.

### EC-12 (medium). The payment plan has no result when no part of the extra fits (from PF-6)

- **Location:** `prd.md`:731 (FR-39).
- **Trigger:** a later month's full extra, or a minimum payment, breaks the buffer even with none of this month's extra.
- **Guard:** when even none of this month's extra keeps every day at or above the buffer, hold all of it back and name the breach day and its cause.
- **Consequence:** "the largest part that keeps" every day at or above the buffer does not exist.

### EC-13 (medium). Later card cycles have no lower bound (from PF-4)

- **Location:** `prd.md`:793 (FR-44); :1026 (NFR-10).
- **Trigger:** a second or later projected card cycle inside the horizon.
- **Guard:** each cycle sums spending after the previous cut day through its own cut day, and the several-cycle fixture pins it.
- **Consequence:** "posted and projected spending up to that cut day" counts earlier cycles again.

### EC-14 (medium). A range undo folds per-record choices into one confirmation (from PF-16)

- **Location:** `prd.md`:930, 931, 933 (FR-55); :517 (FR-25).
- **Trigger:** the range holds a cleared transaction's creation, an import match, or a void.
- **Guard:** the range undo's list shows each such choice with a stated default (keep the row skipped, take no match offer), which the owner can change before confirming.
- **Consequence:** the post-as-new and likely-duplicate prompts get no answer inside one confirmation.

### EC-15 (medium). A range undo can apply to writes the owner never saw (from PF-16)

- **Location:** `prd.md`:931 (FR-55); :915 (FR-54).
- **Trigger:** the client keeps writing between the range undo's list and the owner's confirmation.
- **Guard:** the range ends when it is listed; apply only the listed writes, and list again if any listed record changed since.
- **Consequence:** newer writes are undone unseen, or block listed undos without notice.

### EC-16 (medium). Undoing a void offers a match two transactions cannot make (from L-10)

- **Location:** `prd.md`:930 (FR-55); :156, 158 (§3 Match, Likely duplicate).
- **Trigger:** undoing a void when a likely duplicate of the restored transaction exists.
- **Guard:** offer to void one of the two, naming which stays cleared, or to keep both; warn about any live likely duplicate, whenever it posted.
- **Consequence:** a match pairs a staged row with an uncleared transaction, so the offer has no defined result.
- **Path:** when the void freed a row that then posted as new, both transactions are cleared by the same row; a duplicate posted before the void, the usual reason to void, draws no warning because the rule reads only "a transaction posted since".

### EC-17 (medium). Review queue items outlive their subject

- **Location:** `prd.md`:626, 629, 630 (FR-32); :930, 931 (FR-55).
- **Trigger:** the void, payment, or Claude write behind an open item is undone or voided.
- **Guard:** an item closes, logged, when its subject goes: the voided-row item when its void is undone, the split item when its payment is voided, a waiting input when an undo removes it.
- **Consequence:** a stale "post it as new" posts the row while the restored transaction counts too.

### EC-18 (medium). Two identical rows against one transaction lose the second (from L-9)

- **Location:** `prd.md`:560, 565 (FR-28); :623 (FR-32).
- **Kind:** deletion, confidence medium. Removed: "Matching counts rows: two identical staged rows against one existing transaction leave one row to post."
- **Trigger:** the owner confirms one of two identical rows contending for one transaction.
- **Guard:** confirming one row of a contended set posts the others as new; rejecting posts them all.
- **Consequence:** tested again, the other row is a duplicate of the now-cleared transaction and is skipped.

### EC-19 (medium). Which date puts a cleared transaction in a statement period (from PF-1)

- **Location:** `prd.md`:578, 581, 582 (FR-29); :159 (§3 Cleared).
- **Trigger:** a cleared transaction whose own date and row date fall in different periods.
- **Guard:** the reconciled-mark rule (line 582) and the write record (line 581) use the row's date for a cleared transaction and its own date otherwise.
- **Consequence:** an edit removes the wrong statement's reconciled mark, or the record misses it.

### EC-20 (medium). Writes made before the owner confirms a statement entry go unrecorded (from L-4)

- **Location:** `prd.md`:580, 581 (FR-29); :965 (FR-65); :74 (UJ-4).
- **Trigger:** Claude enters a statement, then edits transactions to close the difference before confirmation.
- **Guard:** the record starts at the statement entry, and the confirmation shows the writes made since.
- **Consequence:** the owner confirms a zero difference without seeing how it closed.

### EC-21 (medium). The cleared balance has no rule for the opening balance and adjustments (from PF-1)

- **Location:** `prd.md`:148, 159, 160 (§3 Adjustment, Cleared, Reconciliation); :578 (FR-29); :438 (FR-18).
- **Trigger:** an adjustment, which no statement row clears, dated before a statement's closing date.
- **Guard:** the cleared balance starts from the opening balance and counts every confirmed adjustment at its own date.
- **Consequence:** "counts only cleared transactions" leaves it out, so the difference never reaches zero.

### EC-22 (medium). The forecast's first months read empty or partial inputs (from PF-5)

- **Location:** `prd.md`:790, 792 (FR-44); :362 (FR-12); :657 (FR-34); `.memlog.md`:98.
- **Trigger:** no closed month yet, a mid-month opening date, or spending only outside the last 3 closed months.
- **Guard:** define a covered month (a closed month the ledger holds from its first day, or count days); with no split, land the estimate on the account of the category's latest spending, else list it as left out; keep archived accounts out of every split; align "those months" with the ruling's "same months".
- **Consequence:** averages divide by zero or by a part month, and a split can be empty.

### EC-23 (medium). Undoing a correction can restore a superseded manual TRM (from L-19)

- **Location:** `prd.md`:220 (R-2); :461 (FR-20); :928 (FR-55).
- **Trigger:** a correction, then the official TRM replaces a manual one, then the correction is undone.
- **Guard:** undoing a correction restores the date and re-locks at the TRM in force for it now; state what undoing a manual TRM entry does.
- **Consequence:** a manual rate stays locked forever, or the undo is refused naming a final re-lock.
- **Path:** the official re-lock reaches only transactions that used the manual TRM at that moment, and nothing else changes a locked rate. In the other order, the re-lock is a later write to the rate, so the correction's undo is refused, naming a re-lock that cannot be undone.

### EC-24 (medium). Release 1 payments still awaiting a split when Release 2 ships (from PF-8)

- **Location:** `prd.md`:707, 710 (FR-37); :629 (FR-32).
- **Trigger:** open "awaiting its split" items at Release 2's first deploy.
- **Guard:** state whether the computed schedule fills them as labeled estimates and closes the items, or they wait for the lender's split.
- **Consequence:** two builds give two different debts and queue counts.

### EC-25 (medium). The installment check compares unlike figures (from PF-8)

- **Location:** `prd.md`:705, 709, 711 (FR-37).
- **Trigger:** a loan with fixed charges, the equal principal default, or a rounding difference.
- **Guard:** compare the next installment, net of its fixed charges, with what the debt, EA rate, and remaining term compute under the loan's method, and ignore differences within a stated tolerance.
- **Consequence:** nearly every loan shows both figures, since the entered installment includes insurance.

### EC-26 (medium). Write cap windows and repeat alerts are unstated (from PF-16)

- **Location:** `prd.md`:915 (FR-54); :850 (FR-48); :1201 (A-13).
- **Trigger:** the daily cap is reached and the client keeps calling in later hours.
- **Guard:** name the windows (clock hours and the Bogotá day, or rolling), send one alert per client while the daily cap holds, and give the write limit alert a send time like the new client alert's.
- **Consequence:** "the first refusal in each hour" raises a fresh alert every hour until the day ends.

### EC-27 (medium). What counts as one write call (from PF-16)

- **Location:** `prd.md`:910, 915, 917, 919 (FR-54); :946 (FR-56); :1032 (NFR-13); :1202 (A-14).
- **Trigger:** Claude stages a statement's rows, resolves many queue items, or repeats a likely-duplicate call.
- **Guard:** one staging call carries a whole statement's rows, up to A-14's 5.000, and say whether a call that stores nothing (a scope error, a likely duplicate) counts.
- **Consequence:** a month's statements, or NFR-13's catch-up after time away, can hit the cap.

### EC-28 (medium). NFR-11 shows jobs that are meant to be idle as failed (from PF-18)

- **Location:** `prd.md`:1030 (NFR-11); `addendum.md`:98, 99, 101, 107, 108, 109 (§3.2).
- **Trigger:** a conditional job that is off (UVR, snapshots, budget checks, digest, scan), or alert sends.
- **Guard:** NFR-11's failure rule covers only active jobs, and alert sends report each failed send (FR-48 line 850) instead of an interval.
- **Consequence:** "no success within twice its interval" flags every idle job.

### EC-29 (medium). A daily backup age check sees a missing backup a day late (from PF-18)

- **Location:** `addendum.md`:104 (§3.2); `prd.md`:385 (FR-15), :1200 (A-12).
- **Trigger:** the daily backup fails just after the daily age check ran.
- **Guard:** run the backup and restore check age checks hourly, or after each scheduled backup with a stated margin.
- **Consequence:** "no backup within 26 hours" alerts up to about 48 hours after the last backup.

### EC-30 (medium). The self-check's authorization has no stated path (from PF-17)

- **Location:** `prd.md`:1030 (NFR-11), :882 (FR-51), :1017 (NFR-5), :1032 (NFR-13); `addendum.md`:119, 122 (§3.3).
- **Trigger:** the hourly self-check connects its scripted client, including during a long absence.
- **Guard:** state how the self-check is authorized within FR-51 and NFR-5 without widening either, and alert ahead of any lapse so it never reads as an outage.
- **Consequence:** FR-51 refuses any other client and grants lapse, so the monitor reports a false outage.

### EC-31 (medium). A scheduled rebuild can change a service's major version (from PF-17)

- **Location:** `prd.md`:1032 (NFR-13), :386 (FR-15); `addendum.md`:171 (§3.9).
- **Trigger:** a monthly rebuild whose patched base moves to a new major version, the database's included.
- **Guard:** a scheduled rebuild keeps each service's major version; a major change follows the upgrade plan after a passing manual restore check; name where a base's advisories at high or above are read.
- **Consequence:** an unattended rebuild changes the database version under its data.

### EC-32 (medium). The recovery drill must run, but not pass (from L-1)

- **Location:** `prd.md`:414 (FR-63); :386 (FR-15); :1147 (§10 item 2).
- **Trigger:** the drill before U2, or before an auth table migration, fails.
- **Guard:** the drill passes before U2 and before each such migration, which wait until it does; a failed run is recorded too.
- **Consequence:** U2 can go ahead on a failed drill, unlike FR-15's restore check, which must pass.

### EC-33 (medium). A goal funded by a crypto account has no conversion or rounding (from PF-11)

- **Location:** `prd.md`:664, 667, 669 (FR-35); :118 (§3 Asset account); :1013 (NFR-1).
- **Trigger:** a goal whose funding account is a crypto account, so its default currency is the asset.
- **Guard:** limit a funding account to a COP or USD savings account, or state the crypto conversion and rounding; say which currency a cross-currency planned contribution's 10 percent tolerance reads.
- **Consequence:** the TRM conversion and "rounded up to the peso or the cent" do not apply.

### EC-34 (medium). Progress at the latest TRM can leave a reached target, or drop below zero (from PF-11)

- **Location:** `prd.md`:668, 669, 672, 674 (FR-35); :1195 (A-7).
- **Trigger:** the TRM moves after a goal is reached, or a withdrawal exceeds progress.
- **Guard:** state whether reached holds once reached and which day's TRM decides missed; floor progress at zero, or refuse a withdrawal mark above progress.
- **Consequence:** reached flips with the TRM; negative progress makes the needed contribution exceed the target.

### EC-35 (medium). Two goals on one funding account (from PF-10 and PF-11)

- **Location:** `prd.md`:174, 176 (§3 Contribution, Goal withdrawal); :668 (FR-35); :762 (FR-41); :910 (FR-54).
- **Trigger:** two goals share a funding account, or a source and funding pair for planned contributions.
- **Guard:** a contribution or withdrawal mark names one goal, and a transfer that could fulfil occurrences of two events goes to the review queue.
- **Consequence:** a mark, or one transfer, cannot say whose progress it changes.

### EC-36 (medium). Crypto quantities at and past zero (from PF-12)

- **Location:** `prd.md`:470, 471, 472 (FR-21).
- **Trigger:** a sell or fee above the held quantity, a fee that empties it, a fiat fee, or a move between own crypto accounts.
- **Guard:** refuse a sell or fee above the quantity; when the quantity reaches zero, the remaining COP cost posts as a realized loss; a COP or USD fee adds to a buy's cost and lowers a sell's proceeds; a move between own crypto accounts carries cost at the average.
- **Consequence:** the average cost divides by zero, and fiat fees and moves have no rule.

### EC-37 (medium). The contribution needed with no whole month left

- **Location:** `prd.md`:667 (FR-35).
- **Trigger:** the target date falls inside the current month.
- **Guard:** with no whole month left, the contribution needed is the whole remaining amount, due by the target date.
- **Consequence:** "divided by the whole months left" divides by zero.

### EC-38 (medium). Classification runs at staging, not at confirmation

- **Location:** `prd.md`:559 (FR-28); :546 (FR-27); :534 (§5.4); :919 (FR-54).
- **Trigger:** a capture, a manual entry, or a second staging of the same statement lands before confirmation.
- **Guard:** classify again when the owner or Claude confirms, or allow one open staging per account.
- **Consequence:** both copies post, against §5.4's "never posts twice".

### EC-39 (medium). NFR-1 rounds a stored COP value twice (from L-8)

- **Location:** `prd.md`:1013 (NFR-1); :125 (§3 Minor units).
- **Trigger:** a computed COP value is stored to the centavo, then shown to the peso.
- **Guard:** state that showing a stored COP value rounds its stored centavos as a second, display-only step, and drop "once", or show it from its exact value; the fixtures follow the same rule.
- **Consequence:** an exact 1.234,505 stores as 1.234,50 and shows 1.234; one rounding gives 1.235.

## Low

### EC-40 (low). Release 1's skip rule does not say what a payment is (from PF-7)

- **Location:** `prd.md`:847 (FR-48).
- **Trigger:** a refund or a reversal credit posts to a card after its anchor.
- **Guard:** a payment is a transfer into the liability; a refund or reversal is not one.
- **Consequence:** the payment due alert is skipped though nothing was paid.

### EC-41 (low). Twice-monthly charges average just over 15 days (from PF-13)

- **Location:** `prd.md`:771 (FR-42).
- **Trigger:** a subscription charged on two fixed days a month, averaging about 15,2 days apart.
- **Guard:** widen the band to 13 to 16 days, or state that such subscriptions are added by hand.
- **Consequence:** detection never proposes it.

### EC-42 (low). Addendum §4 drops the owner review from the fix version exception (from PF-15)

- **Location:** `addendum.md`:175 (§4); `prd.md`:1018 (NFR-6).
- **Trigger:** a reader follows §4's "unless a known advisory names it as its fix".
- **Guard:** add "after the owner reviews its changes, recorded with the advisory ID".
- **Consequence:** the upgrade plan reads as allowing adoption without NFR-6's review.

### EC-43 (low). R-1's code rule leaves out crypto quantities and UVR units (from L-20)

- **Location:** `prd.md`:219 (R-1).
- **Trigger:** a crypto quantity or a UVR balance shown beside coded COP and USD amounts.
- **Guard:** a crypto quantity carries its asset's code, and a UVR balance the label UVR.
- **Consequence:** bare quantities sit beside coded amounts.

### EC-44 (low). Who may mark a loan payment all principal (from PF-8)

- **Location:** `prd.md`:707 (FR-37); :629, 633 (FR-32).
- **Trigger:** Claude resolves an "awaiting its split" item by marking it all principal.
- **Guard:** align FR-37's "the owner can instead mark it all principal" with FR-32, which lets Claude resolve the item.
- **Consequence:** FR-37 reads as owner-only while FR-32 allows Claude.

### EC-45 (low). A host restart after an unattended update (from PF-17)

- **Location:** `prd.md`:1032 (NFR-13).
- **Trigger:** an automatic operating system update restarts the host while the owner is away.
- **Guard:** every service starts on its own after a host restart, and a job missed during it runs on start.
- **Consequence:** services stay down, or a daily job is skipped, until the owner returns.

### EC-46 (low). A planned contribution has no direction (from PF-10)

- **Location:** `prd.md`:758 (FR-41); :177 (§3 Recurring event); :524 (FR-26).
- **Trigger:** a recurring event with two accounts, a transfer that is neither income nor expense.
- **Guard:** say that a planned contribution lowers its source and raises its funding account, with no direction.
- **Consequence:** "a scheduled income or expense with a direction" does not fit it.

### EC-47 (low). Voiding a transfer whose two sides were each cleared

- **Location:** `prd.md`:516, 517 (FR-25).
- **Trigger:** voiding one side of a transfer whose sides were cleared on two accounts' statements.
- **Guard:** the warning names each side's row, with a choice per row.
- **Consequence:** "the row that cleared it" names one row while two statements lose a cleared side.

### EC-48 (low). The statement entry's confirmed values omit the closing date (from L-4)

- **Location:** `prd.md`:964, 965 (FR-65); :576, 577, 580 (FR-29).
- **Trigger:** Claude enters a statement whose closing date, which sets the next period, is wrong.
- **Guard:** name the closing date among the statement entry's values confirmed together.
- **Consequence:** it is unstated whether that date takes effect before the owner confirms.

### EC-49 (low). The reach of Release 2's per-type alert setting (from PF-16)

- **Location:** `prd.md`:848 (FR-48).
- **Trigger:** Release 2 adds the per-type on or off setting.
- **Guard:** say it covers only the budget and statement expected types, so every Release 1 type stays always on.
- **Consequence:** the sentence names three never-off types, leaving payment due and backup alerts open.

### EC-50 (low). The official UVR replacing a manual one in past values (from L-11)

- **Location:** `prd.md`:491 (FR-23); :820 (FR-46).
- **Trigger:** the official UVR replaces a manual one that snapshots or COP values used.
- **Guard:** values that used the manual UVR follow the official one, as FR-46 says for the TRM.
- **Consequence:** past mortgage values keep the manual UVR (only if FR-23 applies).

### EC-51 (low). A one-off planned event names one account

- **Location:** `prd.md`:178 (§3 Planned event); :745 (FR-40); :760 (FR-41).
- **Trigger:** a one-off goal contribution, or a one-off extra payment saved from a scenario.
- **Guard:** a planned event that moves money between two accounts names both, like a planned contribution.
- **Consequence:** the forecast lowers one account and never raises the other.

### EC-52 (low). The fix version's own newer dependencies (from PF-15)

- **Location:** `prd.md`:1018 (NFR-6).
- **Trigger:** the fix version brings other versions public for less than 7 days.
- **Guard:** say whether the exception covers the versions the fix requires.
- **Consequence:** the exception and the 7-day rule disagree on one upgrade.

### EC-53 (low). Undoing an owner confirmation or rejection

- **Location:** `prd.md`:626, 633 (FR-32); :965 (FR-65).
- **Trigger:** the owner undoes a confirmation or a rejection of a Claude-entered input.
- **Guard:** either undo returns the input to waiting, with the value in force before it.
- **Consequence:** the input's state after the undo is unstated.

### EC-54 (low). Statements entered out of date order (from PF-17)

- **Location:** `prd.md`:1032 (NFR-13); :577, 583 (FR-29).
- **Trigger:** a later statement is entered before an earlier one.
- **Guard:** periods follow closing date order, and entering an earlier statement re-derives the later one's period and pending list.
- **Consequence:** "the previous statement" can mean the one entered last rather than the one before by date.

### EC-55 (low). The full monthly extra once every debt is paid off (from PF-6)

- **Location:** `prd.md`:731 (FR-39); :789 (FR-44); :720 (FR-38).
- **Trigger:** every debt pays off inside the horizon while later months still hold the full extra.
- **Guard:** the monthly extra stops once no debt remains.
- **Consequence:** the forecast deducts an extra that has nowhere to go.
