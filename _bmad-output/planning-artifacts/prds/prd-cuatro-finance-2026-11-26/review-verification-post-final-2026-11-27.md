# Verification-gap review: post-final update of the Cuatro Finance PRD

Reviewer gate of the post-final update, run on 2026-11-27 with the verification-gap lens. It changes no requirement. Line numbers point at the working copy of `prd.md` and `addendum.md`.

## 1. Scope and method

- **Change set.** The working-tree diff of `prd.md` and `addendum.md` against HEAD (read-only git), read with the surrounding working-copy text. The rulings at `.memlog.md` lines 94 onward were read for intent. Sections 3 to 6 of `review-post-final-2026-11-27.md` were read so that none of its findings is repeated unless its fix as applied is incomplete or created a new problem. No other review or reconcile file in this folder was read.
- **Question.** For each new or changed consequence, rule, NFR, and fixture: could a downstream test or check establish it, what evidence would show it holds, and does the PRD define the expected result, the threshold, the observable, and who checks it.
- **Evidence.** Each finding rests on the cited text. No shipped test was consulted, since every finding is a gap in what the PRD gives the tests and checks that later steps will write. Where a finding says a rule is missing, both files were searched for it.
- **Severity**, for the gate's triage: critical, a downstream step would build the wrong thing; high, a real gap or contradiction a downstream step would trip on; medium, an ambiguity with a sensible default; low, wording.
- **Shape**, from the lens: regression gap, missing-adoption gap, or other.

Counts: 0 critical, 6 high, 18 medium, 10 low.

## 2. High

### V-1 (high, regression gap). The duplicate tests compare an amount that can change

- **Where:** §3 Duplicate, Near duplicate, and Cleared (lines 155, 157, 159); FR-28 (lines 559, 562, 564); FR-25 (line 512); FR-54 (line 919). Consumers: the duplicate step of every import and of Claude's staged rows, and FR-29's cleared balance (line 578).
- **Gap:** a cleared transaction keeps the clearing row's date and description key, but both tests take the amount from the transaction itself, which FR-25 lets the owner or Claude edit. Nothing says which amount a confirmed near-amount match (within 15 percent, line 562) keeps; a search of both files found no such rule.
- **Missing check:** a fixture that confirms a near-amount match (a capture of 50.000 against a row of 52.000), or edits a cleared transaction's amount, then imports the same file again and asserts the row is skipped. As written, the row posts.
- **Ships wrong:** line 559's new promise, that an overlapping import skips every row already cleared, fails for those rows. A match that keeps the capture's amount also leaves the statement unreconciled by the gap.
- **Fix:** confirming a near-amount match sets the transaction's amount to the row's (logged and undoable), and a cleared transaction keeps the clearing row's amount beside its date and key, which both tests compare.

### V-2 (high, other). A row kept skipped after a void posts again on the next overlapping import

- **Where:** FR-25 (line 517), FR-32 (line 630), FR-28 (line 559), §3 Void (line 110). Consumer: the duplicate step on the next overlapping file.
- **Gap:** voiding a cleared transaction lets the owner keep its row skipped, but voided records take no part in the duplicate tests and nothing else records the skipped row, so a later import of an overlapping file classes the same row as new.
- **Missing check:** void a cleared transaction, keep its row skipped, import the same file again, and assert the row is listed and skipped. No rule gives that result.
- **Ships wrong:** the charge the owner chose to drop comes back as a posted transaction on every overlapping import: the double count PF-1 set out to end, now created by the L-10 fix.
- **Fix:** a row kept skipped stays on record with its date, description key, and amount, and the duplicate test lists and skips a staged row identical to it, which the owner can still post.

### V-3 (high, other). Unused categories: the glossary says unestimated, FR-44 says low

- **Where:** §3 Confidence level (line 191); FR-44 (lines 789, 790, 792, 796); `addendum.md` §2.4 PF-5 (line 65). Consumers: each day's confidence and every lowest balance (FR-35, FR-40, FR-45, FR-53).
- **Gap:** the new glossary entry makes a category with no spending in the covered months and no budget unestimated at any ledger age. FR-44 makes any category with spending in fewer than 3 of the last 6 months, zero included, irregular (low) once the ledger covers 6 months, and a budgeted category with no spending then drops its budget for a 12-month average.
- **Missing check:** a forecast fixture past month 6 with one category never used and no budget, asserting its level and the day confidence of the accounts it lands on. The two texts give different expected results.
- **Ships wrong:** under FR-44 the unused category projects zero at low and, landing by the split of all spending (line 792), drags every account's day confidence to low, unless a zero estimate is left out, which nothing says. That is the effect addendum line 65 gives as its reason to reject ranking unestimated below low.
- **Fix:** the irregular rule applies only to a category with some spending in the covered months; one with none projects its budget or, without one, is unestimated, at any ledger age.

### V-4 (high, other). A price change both fulfils and waits

- **Where:** FR-42 (line 775), FR-41 (lines 762, 763), FR-32 (line 632). Consumers: occurrence fulfilment, the payment plan's paid lines, and SM-3's missed data.
- **Gap:** FR-41 fulfils an occurrence automatically within 10 percent of its amount (A-11), while FR-42 sends a charge more than 5 percent off a confirmed subscription's amount to the review queue and lets it fulfil only once accepted, so a charge 5 to 10 percent off gets both. "Keep the old one" leaves the charge's fulfilment undefined. FR-42 does not limit the charge to the subscription's account, as FR-41 does, nor say whether a subscription added by hand counts as confirmed.
- **Missing check:** a charge 7 percent above a confirmed subscription's amount: assert whether its occurrence is fulfilled before the owner resolves the item, and after "keep the old one".
- **Ships wrong:** tests written from FR-41 and from FR-42 cannot both pass, and with "keep the old one" on a charge more than 10 percent off, the occurrence passes as missed although it was paid.
- **Fix:** a charge that raises a price change never fulfils automatically; accepting it or keeping the old amount both let it fulfil its occurrence; the charge must be on the subscription's account; and say which subscriptions count as confirmed.

### V-5 (high, other). The advisory rule blocks the deploy of a mitigation

- **Where:** NFR-6 (line 1018) with FR-8 (line 323, baseline, assessment §4); `addendum.md` §4 (line 175). Consumer: the check that gates each deploy.
- **Gap:** no deploy goes out with a known advisory unless it removes one, and the new response rule lets the owner accept or mitigate an open advisory, but nothing says whether an accepted or mitigated advisory, recorded with its ID, still blocks a deploy. Read as written, while any known advisory is open, a deploy that ships a mitigation, or any unrelated fix, cannot go out. No step is named that runs the audit before each deploy and reads that record.
- **Missing check:** with an open advisory recorded as accepted, assert whether a deploy that adds and removes none goes out.
- **Ships wrong:** the epic that builds FR-8's deploy check has to guess, and the strict reading leaves the owner unable to deploy at all while no fix exists.
- **Fix:** state whether a deploy may go out while every open known advisory is accepted or mitigated and recorded with its ID, provided it adds none, and name the step that runs the audit before each deploy.

### V-6 (high, missing-adoption gap). UJ-4 asks for the plan while the statement entry still waits

- **Where:** UJ-4 (line 74), R-6 (line 224), FR-29 (line 580), FR-65 (line 965), NFR-10 (line 1029). Consumer: UJ-4's end-to-end check.
- **Gap:** L-4 made a Claude-entered minimum payment and printed due date wait with the closing balance, but UJ-4 still has Mariana confirm only "that closing balance", and has Claude ask for the payment plan before she confirms, when the statement's minimum is not yet in force. R-6 still says the statement figure is entered with the statement, with no mention of the wait.
- **Missing check:** UJ-4's end-to-end check asserts the plan's minimum payments after Claude enters the statement, and the journey gives it no defined expected value.
- **Ships wrong:** the check is written against figures the rules forbid, or a rule is weakened so the journey passes.
- **Fix:** in UJ-4 she confirms the statement entry with one tap before Claude asks for the plan, and R-6 says the statement's figure takes effect once confirmed (FR-65).

## 3. Medium

### V-7 (medium, missing-adoption gap). The closing date sits outside the statement entry

- **Where:** FR-65 (line 964), FR-29 (lines 576, 580), FR-54 (line 910). Consumers: the next statement period (line 577) and the statement expected check (line 583).
- **Gap:** FR-54 and FR-29 have Claude enter the closing balance and date, but FR-65 defines a statement entry as the closing balance and, for a card, the minimum and printed due date, so whether a Claude-entered closing date takes effect at once or waits is undefined.
- **Missing check:** Claude enters a statement; before the owner confirms, assert where the next period starts and whether the statement expected item stays.
- **Fix:** the closing date belongs to the statement entry and waits with it.

### V-8 (medium, other). A Claude-created account before its opening balance is confirmed

- **Where:** FR-18 (line 438), FR-65 (line 965), FR-37 (line 705). Consumers: the account's balance or derived debt, net worth, and imports into the account.
- **Gap:** the opening balance or starting debt waits, but the account's balance meanwhile is undefined, and so is the result of a rejection, since "the previous value, if any" has none at creation. FR-18's "set once at creation" then leaves only an adjustment to set the right value.
- **Missing check:** Claude creates an account with an opening balance; assert the balance, net worth, and an import's result before confirmation and after a rejection.
- **Fix:** until confirmed, the account counts from a zero opening balance (or starting debt) and shows the pending value; after a rejection, the owner enters the value once in the app, as at creation.

### V-9 (medium, other). Which writes the reconciliation records, and by which date

- **Where:** FR-29 (lines 578, 581, 582). Consumers: the reconciliation result and the reconciled mark.
- **Gap:** a cleared transaction now sits in a period by its clearing row's date, but "a write that changes a transaction in its statement period" and "a cleared transaction in a reconciled period" do not say which date places it, nor whether a new record, a void, a post from a row, or an adjustment counts, though those are the usual ways a difference closes.
- **Missing check:** close a difference once by posting a missing row and once by an adjustment, and assert each write shows beside the result.
- **Fix:** a cleared transaction is placed by its row's date and any other by its own; record every write that changes the period's cleared balance or pending list, creations, voids, and adjustments included.

### V-10 (medium, other). Rows contending for one transaction: what the others do

- **Where:** FR-32 (line 623), FR-28 (lines 560, 565). Consumer: the import's posting step.
- **Gap:** the resolution "confirm one, or reject so the row posts as new" was written for one row with several candidates. With several rows for one transaction, the rows not confirmed have no defined outcome, and testing them again would class an identical one as a duplicate of the now cleared transaction.
- **Missing check:** two identical rows against one capture; confirm one and assert the other posts.
- **Fix:** confirming one row posts the others as new, listed; rejecting posts them all as new.

### V-11 (medium, other). Undoing a void "offers to match the two"

- **Where:** FR-55 (line 930); §3 Match and Likely duplicate (lines 156, 158). Consumer: the ledger after the undo.
- **Gap:** a match pairs a staged row with a transaction. Matching two posted transactions has no defined result: which one stays, whether it stays cleared, and what becomes of the other.
- **Missing check:** void a capture, post its statement row as new, undo the void, and accept the match; assert which one transaction remains and its cleared state.
- **Fix:** accepting keeps the cleared transaction and voids the restored one again, logged and undoable (or name the other choice).

### V-12 (medium, other). Undoing the creation of a record others depend on

- **Where:** FR-55 (lines 928, 929), FR-54 (line 913), §3 Void (line 110). Consumers: accounts, categories, rules, and goals created through Claude.
- **Gap:** undoing any creation now voids the record, but accounts and categories have no void state elsewhere (no write tool deletes or archives an account or archives a category), and the later-write refusal covers only fields the undone write changed, not records that depend on it, such as transactions on a voided account.
- **Missing check:** Claude creates an account and records transactions on it; the owner undoes the creation; assert the result.
- **Fix:** an undo of a creation is refused while live records depend on the record, naming them, like the later-write rule.

### V-13 (medium, other). The write cap's windows, counted calls, and alert timing

- **Where:** FR-54 (line 915), FR-48 (lines 846, 850, 851), A-13 (line 1201). Consumers: the write tools and the write limit alert.
- **Gap:** "an hour" and "a day" may be clock windows on Bogotá time or rolling ones. It is unsaid whether refused calls, scope errors, or a staging call that carries many rows count. "The first refusal in each hour or day" can mean an alert every hour once the daily cap is hit. The alert has no delivery bound, since FR-48 bounds only new client alerts and scheduled alerts. A statement staged one row per call can pass 100 calls in normal use.
- **Missing check:** a burst across an hour boundary, and a 150-row statement staged by Claude: assert which calls are refused, how many alerts fire, and when each is sent.
- **Fix:** windows are the clock hour and the Bogotá day (or rolling, stated); refused calls do not count; a call counts once whatever its rows; one alert per limit and window, sent within 5 minutes.

### V-14 (medium, other). Job health for alert sends, and the age check's cadence

- **Where:** NFR-11 (line 1030); `addendum.md` §3.2 (lines 104, 105, 109); FR-15 (line 385). Consumer: job health in the app.
- **Gap:** "no success within twice its interval" has no meaning for alert sends, whose listed cadence is a delivery bound, not an interval. A daily age check can report FR-15's 26-hour backup limit up to about a day late, depending on its slot. A monthly restore check shows as failed only after two months, against FR-15's 35-day alert.
- **Missing check:** a send held past its bound shows as failed, and a missed backup raises its alert soon after the 26-hour mark.
- **Fix:** a send not delivered within its bound shows as failed; the age checks run hourly or right after the backup slot; job health for the restore check uses FR-15's 35 days.

### V-15 (medium, other). NFR-13 has no observable for its rebuilds and away rule

- **Where:** NFR-13 (line 1032), `addendum.md` §3.9 (line 171), NFR-5 (line 1017), NFR-11 (line 1030), `addendum.md` §3.3 (line 119). Consumers: host upkeep and the hourly self-check.
- **Gap:** no record or flag shows a rebuild older than a month, so a stopped rebuild fails no check. The source of "an advisory at high or above in that base" is unnamed, since NFR-6's audit covers production package dependencies only. No longest absence is stated, and the PRD does not say how the self-check's scripted client holds access, while NFR-5 lapses a read grant after 90 days and addendum line 119 limits consent to the acceptance apps' client identities.
- **Missing check:** each service's last rebuild date shows with job health and is flagged when older than a month and a few days; a simulated absence of 100 days keeps the self-check passing.
- **Fix:** record and flag rebuild age, name the source of base advisories, and state how the self-check authenticates and whether NFR-5's lapses apply to it.

### V-16 (medium, other). Later card cycles: the card's share of the monthly extra

- **Where:** FR-44 (lines 789, 793), FR-39 (line 730), FR-38 (line 720), NFR-10 (line 1026). Consumer: the forecast fixture across several card cycles.
- **Gap:** FR-39 splits only this month's extra by the payoff method. For later months nothing says how the full extra divides among debts, a split that shifts as debts pay off, so the card's share cannot be computed outside the code.
- **Missing check:** NFR-10's forecast fixture across several card cycles, with two debts, one of which pays off inside the horizon.
- **Fix:** later months split the full extra by FR-38's month-by-month schedule under the chosen payoff method.

### V-17 (medium, other). Confidence of a budget-only projection, and of a day with no ranked input

- **Where:** FR-44 (lines 790, 791, 796), §3 Confidence level (line 191). Consumers: day confidence and every lowest balance.
- **Gap:** a category with no spending that projects its budget has no stated level, and a day fed only by unestimated inputs, or by none, has no lowest level to show, since the ranking leaves unestimated out.
- **Missing check:** a fixture with one budget-only category and one account fed only by an unestimated category, asserting each day's level.
- **Fix:** a budget-only projection is medium; a day with no ranked input shows high beside its left-out list, or a named state.

### V-18 (medium, other). The payment plan when no part of the extra keeps the buffer

- **Where:** FR-39 (line 731), NFR-10 (line 1026). Consumers: the payment plan and its fixture.
- **Gap:** with later months holding the full extra, the buffer can break even when nothing is scheduled this month, and "the largest part that keeps" the buffer then does not exist.
- **Missing check:** a fixture where the later months' extra alone breaches the buffer: assert this month's scheduled part and the day named.
- **Fix:** schedule zero, hold back the whole extra, and name the first breach day with the reason that the committed extra in later months causes it.

### V-19 (medium, other). Goal progress at the latest TRM can undo "reached"

- **Where:** FR-35 (lines 664, 669, 672, 674). Consumers: the goal plan and the reached and missed states.
- **Gap:** progress converted at the latest TRM moves every day, so a goal shown as reached can fall short again and show as missed at its date. A goal funded from a crypto account takes the asset as its default target currency, which no TRM converts.
- **Missing check:** reach a USD target from COP contributions, lower the TRM, and assert the state; create a goal on a crypto account.
- **Fix:** say whether reached holds once shown, and limit the funding account to a COP or USD asset account.

### V-20 (medium, other). A card rate change has no effective date

- **Where:** R-5 (line 223), R-4 (line 222), FR-36 (lines 688, 697), FR-65 (line 965). Consumer: cuota schedules (Release 2).
- **Gap:** "each purchase keeps the card's rate on its purchase date" needs the date a change takes effect: when entered, when the owner confirms it (a Claude-entered term waits), or the statement's date. A purchase stores its own rate only when it differs from the card's, so a change that does not reprice would still move the purchases that stored none.
- **Missing check:** a rate change entered after the date it takes effect, with a purchase in between; assert each purchase's rate.
- **Fix:** a rate change carries an effective date, and one that does not reprice stores the old rate on every pending purchase dated before it.

### V-21 (medium, other). Crypto: a fee on a sell, the sell's proceeds, and the bound check

- **Where:** FR-21 (lines 470 to 473), NFR-10 (line 1026), `addendum.md` §3.6 (line 145). Consumers: the cost basis and the realized result.
- **Gap:** whether a fee paid in the asset on a sell applies before or after the sell's realized result changes that result. "A buy or a sell records the quantity and its COP cost" does not name a sell's proceeds, which the realized result needs. NFR-10 checks the COP and USD bound, but nothing checks the largest quantity and price scale the architecture will set.
- **Missing check:** a sell with a fee in the asset, computed outside the code; and the largest quantity at the price scale, with one unit more rejected.
- **Fix:** state the order and that a sell records its COP proceeds, and add the crypto bounds to NFR-10's money layer check.

### V-22 (medium, other). NFR-1 rounds once in name and twice in fact

- **Where:** NFR-1 (line 1013), R-1 (line 219), NFR-10 (lines 1026, 1027). Consumer: every shown COP value.
- **Gap:** a computed value is "rounded half-even once", but a stored COP value keeps its centavos and rounds again to the peso when shown, and the two orders differ: 1.234,5049 stores as 1.234,50 and shows 1.234, while rounding the exact value gives 1.235. No named check covers the half-even step to the peso or the goal plan's round-up.
- **Missing check:** money layer cases at ,50 on an even and an odd peso, a value just above half, and the round-up exception in COP and USD.
- **Fix:** say that the shown peso rounds the stored centavo value, and add those cases to NFR-10.

### V-23 (medium, other). Subscription detection: which deviation, and the band ends

- **Where:** FR-42 (line 771), `addendum.md` §3.7 (line 157). Consumer: the subscription scan and its fixtures.
- **Gap:** "standard deviation" does not say population or sample, which differ by a factor of about 1,4 with three charges: intervals of 28 and 33 days give 2,5 and 3,5, one under the 3-day limit and one over. The bands do not say whether their ends hold for a fractional average.
- **Missing check:** a fixture with intervals of 28 and 33 days, and one with an average of 8,5 days.
- **Fix:** population deviation, with band ends inclusive on the average.

### V-24 (medium, other). Which version may skip the 7-day delay

- **Where:** NFR-6 (line 1018), `addendum.md` §4 (line 175). Consumer: dependency upgrades.
- **Gap:** "the version a known advisory names as its fix" is unclear when the advisory names a range of patched versions, or when only a new version of a direct dependency brings in the fixed package, which would still wait 7 days. Addendum §4 restates the exception without the owner's review and the record with the advisory ID.
- **Missing check:** none can decide whether such an upgrade may be adopted at once.
- **Fix:** the exception covers any version inside the advisory's patched range and the direct dependency version that brings it in, each after the owner's review and recorded with the advisory ID; addendum §4 repeats both conditions.

## 4. Low

### V-25 (low, missing-adoption gap). The official UVR replacement can be undone

- **Where:** FR-23 (line 491), R-2 (line 220), FR-55 (line 928). Only if FR-23 applies.
- **Gap:** R-2 makes an official TRM re-lock final, but the official UVR replacing a manual one is an ordinary audited write, which FR-55 lets the owner undo.
- **Fix:** make the official UVR replacement final, as R-2 does for the TRM.

### V-26 (low, other). Undoing a correction after an official re-lock

- **Where:** R-2 (line 220), FR-55 (line 928).
- **Gap:** undoing a date correction "restores the date and its rate together", but when the official TRM has since re-locked the corrected date's manual rate, that re-lock is final, and the result is undefined.
- **Fix:** refuse the undo, naming the official re-lock, or say the restored date takes its own TRM.

### V-27 (low, other). Release 1 loan splits: who, which date, and what Release 2 does

- **Where:** FR-37 (lines 707, 710), FR-32 (lines 629, 633).
- **Gap:** FR-37 says the owner can mark a payment all principal, while FR-32 lets Claude resolve the item. The date the entered interest posts on (the payment's or the lender statement's) is unstated, and so is whether Release 2's computed schedule resolves items still waiting.
- **Fix:** name who may mark it all principal, post the interest on the payment's date, and say whether waiting items keep waiting for the lender's split.

### V-28 (low, other). The goal plan with less than one whole month left

- **Where:** FR-35 (line 667).
- **Gap:** "divided by the whole months left" has no result when no whole month is left.
- **Fix:** with less than one whole month left, the contribution needed is the whole remainder.

### V-29 (low, other). A range undo over cleared transactions

- **Where:** FR-55 (line 931), FR-25 (line 517).
- **Gap:** undoing the creation of a cleared transaction asks in the app whether its row posts as new or stays skipped. A range undo does not say whether the owner answers per row or once, or whether refusals found at the preview are checked again when it applies.
- **Fix:** the preview lists each such row with the choice, keeping it skipped by default, and the apply step checks refusals again.

### V-30 (low, other). Missed statements on return: who keeps the date order

- **Where:** NFR-13 (line 1032), FR-29 (line 577).
- **Gap:** the owner imports missed statements in date order, but nothing says whether the app warns on a statement entered out of order, which would place its period wrongly.
- **Fix:** the app warns on a statement whose closing date precedes the account's latest reconciled one, naming that statement.

### V-31 (low, other). A planned contribution's direction and cross-currency fulfilment

- **Where:** §3 Recurring event (line 177), FR-41 (lines 758, 762), FR-35 (line 670).
- **Gap:** a recurring event is "a scheduled income or expense with a direction", but a planned contribution is a transfer, and when its two accounts differ in currency, the 10 percent tolerance does not say which side's amount it compares.
- **Fix:** a planned contribution carries no income or expense direction; its amount is in the source account's currency, and the source side is compared.

### V-32 (low, other). The FR-63 drill record and its yearly cadence

- **Where:** FR-63 (line 414), `addendum.md` §3.9 (line 171).
- **Gap:** "each run recorded with its date" names no place, and nothing flags a missed yearly run, unlike the restore check's alert.
- **Fix:** record each drill beside the restore check results and flag it 12 months after the last run.

### V-33 (low, other). FR-16's one unit and its reachability check

- **Where:** FR-16 (lines 394, 396), FR-6 (line 307), FR-17 (lines 405, 406).
- **Gap:** "deploy as one unit" lost the observable of the earlier wording. The required behavior that none of the deployment's services is reachable from outside the host except through the HTTPS front (FR-6, baseline, assessment §4) has no named check on the deployed host, since FR-17 runs on push.
- **Fix:** one command from a clean checkout builds and starts the app, the database, and the job runner; each deploy runs a recorded reachability check from outside the host.

### V-34 (low, missing-adoption gap). The es-CO output check does not cover the COP code

- **Where:** R-1 (line 219), NFR-10 (line 1027).
- **Gap:** R-1 now requires the code COP on every COP amount, but NFR-10's es-CO check names only the grouping and stray decimals.
- **Fix:** add the COP and USD codes, and no bare "$", to that check.

## 5. Changed consequences that are testable as written

FR-24's status filter; FR-43's buffer, set only by the owner; FR-60's navigation rule; NFR-3's manual pass, which names all six A and AA criteria new in WCAG 2.2; FR-48's Release 1 anchors for the payment due alert; FR-39's flag when no income event falls in the horizon; FR-41's Release 1 holiday rule; NFR-10's journey checks by release; FR-37's Release 1 full transfer and its review queue item; SM-C1's narrowed terms; and the §9.3 row assignments.
