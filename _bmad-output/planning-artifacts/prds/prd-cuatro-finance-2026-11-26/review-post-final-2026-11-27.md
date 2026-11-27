# Post-final review: Cuatro Finance PRD

Run by the orchestrating session after the PRD reached status final and before its first commit, on 2026-11-26 and 2026-11-27. It changes no requirement. The findings in sections 3 to 5 are the change signal for a `bmad-prd` Update run; line numbers point at `prd.md` as finalized.

## 1. What was checked

- **Leaks.** Five reviewers read every line of the fifteen files in this folder against the session's Privacy, Security, citation, and writing rules.
- **Guide access.** The session's own tool calls were audited from its transcript. Every read of the private guide stayed inside the allowed line ranges, no search ran over it, and the session made no web queries.
- **Coverage.** One reviewer checked the three inputs against `prd.md` and `addendum.md`. Passed: decisions 1 to 8, every assessment §8 line, the fix-first gaps from assessment §3 and §4, backups as baseline, the accessibility target, every FR tag, and the eight deferred items.
- **Readiness.** Two reviewers traced what became of the gate reviewers' findings and checked internal consistency and readiness for UX, architecture, and epics.
- **Refute pass.** A second set of reviewers, each told to refute, rechecked every high and medium readiness finding. None was refuted: 11 were confirmed as stated, and 13 hold in a narrower form, recorded below as what remains.

## 2. Wording edits made before the first commit

These follow the session's Security and Privacy rules. They are listed without repeating the replaced text.

- `reconcile-assessment.md`: the summary and contradiction 1 now cite the dependency advisory triage by assessment section and line only, and the fix matches the owner's ruling at memlog line 75.
- `addendum.md` §3.6: field encryption is named generically.
- `prd.md` FR-64 and `review-themes.md` T-27: FR-64 is a security requirement, so it takes the tag baseline, like FR-9, with its reviewer gate pointer.
- `review-edge-cases.md` (line 154): the time zone scenario uses Mariana and Bogotá time.
- `review-verification.md` V-45: the cell now speaks of the PRD's consequences.

Kept on purpose: memlog line 12 (accepted by the owner at memlog line 83, and the script never edits a memlog line), and the issue 36 cross-references in addendum §4 and `review-scope.md` (the owner's rule allows GitHub issue numbers, and the issue is public).

## 3. Findings for the PRD update

**Owner call** marks a finding where two reasonable fixes give different product behavior. Every other finding has one fix that follows from the text and the memlog.

### PF-1 (high). Duplicates and statement periods for matched transactions

FR-28, FR-29, §3 Duplicate and Near duplicate (lines 155, 157, 553, 557, 571). A confirmed match keeps the transaction's own date and description, with the statement's beside them, but the duplicate tests do not say which pair they compare. Read literally, re-importing an overlapping export posts every previously matched row again, against UJ-5. The cleared balance at a closing date has the same gap for a matched transaction whose two dates fall on opposite sides of it.

Fix: for a transaction a match confirmed, the duplicate and near-duplicate tests compare a staged row with the statement row's date and description key kept beside it. In FR-29, the cleared balance places each matched transaction by its statement date, while budgets and its locked rate keep its own date.

### PF-2. Fix-first scope is narrower than decision 8

Memlog line 37; `prd.md` lines 209, 251, 1050, 1121; addendum §2.1 row 8. Decision 8 puts every defect of what exists in fix-first, but the PRD limits fix-first to §5.1, so the defect consequences of FR-18, FR-20, FR-26, FR-45, and FR-23 (only if Open Question 1 resolves yes) may come after new features. Deferred item 1's shared sign-in redirect task is named nowhere.

Fix: name these defect consequences and that task as fix-first work in §5.1, §9.1, and §10 item 1, and align addendum §2.1.

### PF-3. A redesigned replacement of a §5.1 screen

§10 items 1 and 6, line 251, memlog line 38. The owner leans toward replacing defective screens with redesigned ones (an epics call), but §10 item 1 puts all of §5.1 before any new feature and the redesign is tagged new.

Fix: add to §10 item 1 that replacing a §5.1 defective screen with its redesigned version, after the UX step and with FR-58 adoption pulled forward for that screen, counts as fix-first work. The patch or replace choice stays with the epics step.

### PF-4. Later card cycles in the forecast

FR-44, R-6, NFR-10 (lines 221, 773, 775, 1003). The basis is settled (minimum payments), but nothing says how each later statement cycle inside the 90 days forms its projected payment, so projected card spending may never leave cash. NFR-10 has no forecast fixture.

Fix: for each statement cut day inside the horizon, the card's projected payment on the next due date is the R-6 estimate over posted and projected card spending up to that cut day (projected category spending counted as 1-cuota purchases), at medium confidence, plus the card's share of the monthly extra. Add a forecast fixture computed outside the code.

### PF-5 (owner call). The first months of the forecast, and unestimated inputs

FR-44, FR-40, FR-35, FR-45, FR-53, §3 Confidence level (lines 188, 727, 773, 774, 795). The six-month sentence can be read as dropping the medium rule for every category until month six. A lowest balance can report high or medium confidence while categories are left out.

Fix: before six months, a category with spending in the covered months uses the medium rule over them, and only a category with no spending yet projects its budget, or shows as unestimated without one. Every lowest balance (FR-40, FR-35's goal plan, FR-45, FR-53) returns the forecast's left-out list beside its confidence. Owner call: whether an unestimated input ranks below low in the day confidence rule.

### PF-6 (owner call). Evaluation order of the payment plan and the forecast

FR-39, FR-44 (lines 714, 715, 773). The plan fits this month's extra against a forecast that itself takes the plan's extra as input, and the extras assumed for later months are unstated.

Fix: fit this month's extra against a forecast that holds every minimum payment and assumes the committed monthly extra in each later month, then schedule the largest part that keeps the paying account at or above its buffer on all 90 days. Add a fixture where a later month's extra decides how much of this month's is held back. Owner call: the assumption for later months.

### PF-7. Release 1 payment due alert for loans and the mortgage

FR-48 (lines 137, 691, 829). The Release 1 skip rule anchors on a statement cut day, which only cards have.

Fix: skip once a payment to that liability has posted since its last statement cut day for a card, or since its previous payment due date for a loan or the mortgage; before the first such date, the anchor is the account's opening date. That any payment skips the alert is the owner's ruling at memlog line 86.

### PF-8 (owner call). Release 1 loan and mortgage payments before the lender's split

FR-37, FR-26, FR-54, FR-32, addendum §8 (lines 519, 692, 694, 892). Release 1 has no computed schedule, and nothing says what a payment does before its split is entered.

Fix: in Release 1 a loan or mortgage payment posts as a full transfer that lowers the derived debt by its whole amount, and a split pending item joins the review queue (FR-32, and the glossary's queue entry) until its interest and charges are entered from the lender's statement, a write FR-54 names. Add splits to addendum §8's Release 1 list. For Release 2: when the entered installment or remaining term differs from what the debt and EA rate compute, the app shows both and the owner picks. Owner call: full reduction with a pending item, or the liability side waits.

### PF-9. Cuotas when the card's rate changes or a payment exceeds the minimum

R-5, FR-36 (lines 220, 675, 681, 683, 696). A purchase stores its own rate only when it differs from the card's, so a card rate change leaves pending cuotas undefined, and only loans recompute after a payment.

Fix: R-5 records per card whether a rate change reprices pending cuotas; when it does not, each purchase keeps the card's rate of its purchase date. In FR-36 (Release 2), a purchase's schedule recomputes from its remaining principal after a payment above the minimum and after a change in its cuota count.

### PF-10. The source account of a planned contribution

FR-35, FR-41, §3 Recurring event (lines 90, 174, 653, 658, 742, 746). A contribution names only the funding account, so the forecast cannot lower the source, and any posted transaction on the account can fulfil it.

Fix: a planned contribution names its source account and the goal's funding account; the forecast lowers one and raises the other, the goal plan checks the source against its buffer, and only a transfer from the source into the funding account within the A-11 tolerances fulfils it.

### PF-11 (owner call). Goal withdrawals, a reached state, and the target's currency

FR-35 (lines 173, 657, 660). Progress counts inflows (A-7), but a withdrawal, a reached goal, and a target in another currency are undefined.

Fix: a transfer out of the funding account marked as a goal withdrawal lowers progress, logged and undoable; a goal whose progress reaches its target shows as reached; the target carries a currency, and a contribution in another currency counts at its locked rate (R-2). Owner call: the locked rate or the latest TRM.

### PF-12 (owner call). Crypto sells, fees, and precision

FR-21, addendum §3.6 (lines 466, 468; addendum lines 108 to 113). Average cost is settled, but a sell's realized result, a fee paid in the asset, the largest quantity, and USD price precision are not.

Fix: a sell records its realized gain or loss against average cost in COP, on the crypto account and never as spending or income. A fee paid in the asset lowers the quantity. The architecture step sets the largest quantity, the price scale, and a working precision that holds both exactly. Owner call: whether that fee posts as spending at its COP value or adds to the cost basis.

### PF-13 (owner call). Subscription detection definitions

FR-42 (lines 154, 612 to 621, 755, 759). The normalized merchant, the tolerance for near, the deviation test with two charges, where a price change goes, and how a confirmed subscription takes a new amount are undefined.

Fix: the normalized merchant is the description key; an average interval is near within 6 to 8, 13 to 15, or 28 to 31 days; two charges skip the deviation test; a price change on a confirmed subscription enters the review queue, and accepting it sets the amount. Owner call: these rules now, or a memlog deferral to the FR-42 epic, revisited when detection starts. Robustness changes (price steps, skipped months, currency drift) would alter the guide rule the owner chose, so they need a ruling.

### PF-14 (owner call). The correction counter-metric and undo

SM-C1, FR-25, FR-55 (lines 82, 507, 897, 909, 1146). Three of SM-C1's five change terms cannot happen under FR-25, and FR-55 does not say what undoing a create leaves.

Fix: undoing a create voids the record, logged and undoable, so it counts in SM-C1. Owner call: let FR-25 move a transaction to another account in the same currency and change its direction, or count in SM-C1 only voids and changes to amount and date.

### PF-15 (owner call). The dependency rule's adoption delay

NFR-6 (line 995), addendum §4. The 7-day adoption delay can hold back the release that fixes a known high or critical advisory, the source of "known advisory" is unnamed, and no response is stated for the running deployment while one is open.

Fix: a release that fixes a known high or critical advisory may be adopted before 7 days, after a review of its changes, recorded with the advisory ID; every other version waits 7 days. A known advisory is one the package manager's audit of production dependencies reports at high or above. While one is open, the owner chooses to accept, mitigate, or take the AI connection offline, recorded with the advisory ID. Owner call: this amends the ruling at memlog line 62.

### PF-16 (owner call). A runaway connected client

FR-54, FR-55 (lines 833, 892 to 900, 909 to 912). There is no per-client write cap and no undo of one client's writes over a time range, so recovery from a runaway session takes many single undos or a restore.

Fix: a per-client write cap per hour and per day, beyond which writes are refused with a limit error and an always-on alert fires; and an undo of one connected client's writes in a chosen time range, as one reviewed action that first lists every record it will change. Owner call: adopt, or record the rejection with its reason.

### PF-17 (owner call). Host upkeep and time away

NFR-6, addendum §3.9 (addendum line 139). No rule covers updates to the host operating system, the container images, the database, or the proxy, and nothing says what happens while the owner is away.

Fix: a new NFR, in which the host applies security updates automatically and the app, database, and proxy images are rebuilt on a fixed schedule and after an advisory in their base images; and an away rule, in which jobs, backups, restore checks, and alerts run unattended, and on return the owner reconnects clients under NFR-5 and imports missed statements per account in date order. Owner call: adopt, or record the rejection.

### PF-18. One job list

Addendum §3.2 (line 78), §3 glossary (line 198), NFR-11 (line 1007). Three lists disagree, and the one the runner choice rests on omits the hourly AI connection self-check, the daily statement expected check, the daily backup and restore age checks, and the weekly digest. A single scheduled runner can still run them.

Fix: addendum §3.2 holds the one job list with a cadence per job; the glossary and NFR-11 point to it.

### PF-19. NFR-3's manual accessibility pass

NFR-3 (line 992), memlog line 61. The target is WCAG 2.2 AA, but the recorded manual pass names four of the six A and AA criteria new in 2.2, as "the four that matter here".

Fix: the manual pass also checks 2.5.7 Dragging Movements (every action works without dragging, and any file drop area or slider has a button or text field alternative) and 3.2.6 Consistent Help (any help sits in the same relative place on every screen), and the sentence names all six criteria. The review wiring's accessibility lens was raised to WCAG 2.2 AA on 2026-11-27.

### PF-20. The authorization consent screen

FR-60 (line 972), FR-51, UJ-2. FR-60's screen list omits the consent screen, which is built on the contract too.

Fix: add it to FR-60's list.

## 4. For the UX step

- Place every surface an FR needs on a named screen, including those FR-60 does not list: reconciliation (FR-29), net worth history (FR-46), the payoff comparison and scenarios (FR-38, FR-40), job health and restore check results (NFR-11, FR-15), export (FR-15), TOTP recovery (FR-63), holiday overrides (FR-41), and alert and digest settings (FR-48, FR-49).
- Design to all six WCAG 2.2 A and AA criteria new in 2.2 (PF-19), whether or not the PRD update has landed.

## 5. For the architecture step

- **Backups.** Addendum §3 has no backups entry. Add one that points to FR-15 for the constraints and leaves open the off-server storage with retention it enforces, the encryption tool, and whether backups run in the app's job runner or on a host or database schedule. If no free tier meets FR-15, raise it to the owner as an NFR-12 exception rather than weaken FR-15.
- **Client identities.** Confirm the acceptance apps' client identities as part of the addendum §3.3 re-check (L-21).

## 6. Low findings, for the record

- L-1. Run the FR-63 recovery drill before U2 and then yearly, recorded like the restore check, or drop it from addendum §3.9's recurring work.
- L-2. A monthly test alert that the owner acknowledges, with the last delivered date shown, or a recorded rejection.
- L-3. Record the owner's call on the effort estimate and the capture stop rule.
- L-4. Rule whether the statement minimum and due date, opening balances, starting debts, and adjustments join FR-65's confirmation set, and whether FR-29 records writes made after a nonzero difference.
- L-5. Pair SM-C1 with the share of reconciliations whose closing balance the owner confirmed, or record the rejection.
- L-6. FR-54 names the cash buffer as allowed or excluded; if allowed, say whether it joins FR-65's confirmation set.
- L-7. Holiday overrides: move them into Release 1 with FR-36, or state that Release 1 uses the holiday data without overrides.
- L-8. NFR-1: showing a stored COP value rounds it half-even to the peso, or computed COP values are stored in whole pesos.
- L-9. FR-28: when two staged rows contend for one transaction, the nearer date wins and the earlier row breaks a tie, or both go to the review queue.
- L-10. Voided records take no part in duplicate checks; undoing a void after a later row posted for the same charge warns and offers the match; voiding a cleared transaction returns its statement row to the review queue.
- L-11. FR-23: the official UVR replaces a manual one for its date (only if Open Question 1 resolves yes).
- L-12. FR-39: with no income event into the paying account inside the horizon, each payment is flagged as not covered by income.
- L-13. Scope summaries: list FR-29 and FR-32 in §9.3's Release 2 column as split FRs, add splits to addendum §8's Release 1 list, and say "on every account that receives statements" in addendum §2.3.
- L-14. Glossary: fix-first scope as PF-2 settles it, entries for likely duplicate and planned contribution, a loan's minimum payment defined as its installment or the lender's figure, and the provenance entry aligned.
- L-15. §0: widen the baseline definition to a pointer to the assessment section, a deferred item, or the reviewer gate (FR-9, FR-64).
- L-16. NFR-1: record FR-35's round-up as an explicit exception and name its unit.
- L-17. NFR-10: each release runs the end-to-end checks for the journey steps it ships; the UJ-7 and UJ-8 checks come with Release 2.
- L-18. Add FR-53 to A-1's list, a status filter for voided transactions to FR-24, and numeric bounds for "nears" and "near".
- L-19. Undoing a rate re-lock: allow it in R-2, or remove it from FR-32.
- L-20. R-1 states how a COP amount is marked.
- L-21. If two acceptance apps share a client identity, word FR-50, FR-51, and FR-65 per identity rather than per app.
- L-22. A memlog line recording the owner's acceptance of the open items triage, if it was given.
- L-23. Deferred item 3: remove it from §9.1's list, or state that it is ruled (removed before U1, back only with component tests).
- L-24. FR-13 or FR-60: navigation offers only the screens the current release ships, and no link leads to a missing page.
- L-25. Bring the CHANGELOG's claims in line with the repository (addendum §5), or record that its history stays as written.
- L-26. The README architecture diagram from the original plan: defer it with the public demo in §9.2, or add it to addendum §5 item 4.
- L-27. FR-16 restated as behavior (one deployable unit built from a clean checkout, served only over HTTPS, its services unreachable from outside the host), with containers and the proxy kept in addendum §3.1.
- L-28. Decision 5 in the addendum: "no amounts" rather than "no figures".
