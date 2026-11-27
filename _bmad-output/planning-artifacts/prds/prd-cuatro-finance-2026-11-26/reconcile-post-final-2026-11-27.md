# Reconcile: post-final review rulings

Checked on 2026-11-27 by the reconciliation reviewer of the `bmad-prd` Update run. Inputs: `review-post-final-2026-11-27.md` §3 (PF-1 to PF-20) and §6 (L-1 to L-28); the owner's rulings at `.memlog.md` lines 94 to 112, with lines 61, 62, 83, 86, and 88 where a ruling cites them; and the working copies of `prd.md` and `addendum.md`, compared with git HEAD. Line numbers below point at the working copies. Sections 4 and 5 of the review belong to later steps and were not checked.

Whole-document checks:

- The 65 FR headings match HEAD exactly, ids and brownfield tags included.
- NFR-13 is the only new requirement id. No R, A, UJ, SM, T, or U id was added. PF and L ids appear only in the addendum, keyed in its §1.
- Every section, FR, NFR, and A-n reference the update added resolves to the intended place.
- §9.3, §10, the glossary, the §13 index, and addendum §2 and §8 agree with the rulings, apart from the gaps listed below.
- The added text names no institution, personal amount, or exploit detail, and has no em dash, en dash, or double hyphen.

Verdict key: as ruled means the ruling is fully applied (a deferral or rejection counts when the memlog records an owner and revisit condition, or a reason), and a minor wording gap may still be listed; partial means part of the ruling is missing or applied differently; missing and conflicting were not needed. Sections are in `prd.md` unless marked add (`addendum.md`).

| ID | Ruling | Disposition | Where it landed | Verdict | Note |
|---|---|---|---|---|---|
| PF-1 | 95 | applied | §3 Duplicate, Near duplicate, Cleared, Reconciliation; FR-28; FR-29 | as ruled | Cleared transactions keep the row's date and key; budgets and locked rate keep their own date. |
| PF-2 | 95 | applied | §3 Fix-first scope; §5.1 description; §9.1; §10 item 1; add §2.1 row 8 | as ruled | Five FRs and the redirect task named, marked against assessment §5 and §6. Minor: gap 7. |
| PF-3 | 95 | applied | §5.1 description; §10 item 1 | as ruled | Fix-first after the UX step with FR-58 pulled forward; patch or replace stays with epics. |
| PF-4 | 95, 99 | applied | FR-44 (793); NFR-10 | as ruled | R-6 estimate per cut day, medium at best, plus the card's share of the extra; fixture added. |
| PF-5 | 98 | applied | §3 Confidence level; FR-44 (790 to 792); FR-35; FR-40; FR-45; FR-53; add §2.4 | as ruled | Medium rule over covered months, else budget or unestimated; unestimated left out of the ranking. |
| PF-6 | 99 | applied | FR-39 (731); FR-44 (789); NFR-10; add §2.4 | as ruled | Later months hold every minimum and the full extra; breach day named; fixture added. |
| PF-7 | 96 | applied | FR-48 (847) | as ruled | Card cut day, previous due date for a loan or the mortgage, opening date before either. |
| PF-8 | 100 | applied | FR-37 (707, 711); FR-26; FR-32; FR-54; §3 Review queue; §9.3; §10; add §8, §2.4 | as ruled | Full transfer plus split item in Release 1; Release 2 shows both. Minor: gap 5. |
| PF-9 | 95 | applied | R-5; FR-36 (697) | as ruled | Reprice setting per card, purchase-date rate otherwise; three recompute triggers. |
| PF-10 | 95 | applied | §3 Goal plan, Planned contribution, Recurring event; FR-35 (670, 671); FR-41 (758, 762) | as ruled | Source and funding accounts; only a source transfer within A-11 fulfils. |
| PF-11 | 101 | applied | §3 Goal, Goal withdrawal; FR-35 (664, 668, 669, 672); A-7; add §2.4 | as ruled | Withdrawals logged and undoable; reached state; latest TRM with rate date. Minor: gap 3. |
| PF-12 | 102 | applied | FR-21 (471 to 473); add §3.6, §2.4 | as ruled | Realized result on the crypto account; fee into cost basis; limits left to architecture. |
| PF-13 | 103 | applied, part deferred | FR-42 (771, 775); FR-32; §3 Review queue; §9.3; add §2.4 | as ruled | Definitions set; robustness deferred to the FR-42 epic, revisit when detection starts. |
| PF-14 | 104 | applied | FR-55 (929, 934); SM-C1; §3 Void; add §2.4 | as ruled | Undone creation is a logged, undoable void; SM-C1 counts voids, amount, date; FR-25 unchanged. |
| PF-15 | 105 | applied | NFR-6; add §4, §2.4 | as ruled | Audit-based definition, fix version after review, open advisory response; line 83 exception kept. |
| PF-16 | 106 | applied | FR-54 (915); FR-55 (931, 934); FR-48; §5.11; §7.2; §9.3; §10; A-13; add §8, §2.4 | as ruled | 100 an hour, 500 a day; fifth always-on alert; range undo; no stale count of four. |
| PF-17 | 107 | applied | NFR-13; add §3.9, §2.4 | as ruled | Host updates, monthly rebuilds, away and return rule. Minor: gap 6. |
| PF-18 | 95 | applied | add §3.2; §3 Job runner; NFR-11 | as ruled | One list with cadences, the omitted jobs added; both pointers resolve. |
| PF-19 | 97 | applied | NFR-3 | as ruled | All six criteria named; reason now the contract's stated 2.1 AA. |
| PF-20 | 95 | applied | FR-60 | as ruled | Consent screen listed. |
| L-1 | 108 | applied | FR-63 (414); add §3.9 | as ruled | Before U2, before later auth table migrations, yearly, each run dated. |
| L-2 | 109 | deferred | add §2.4 | as ruled | Owner: the FR-48 epic; revisit if an alert email is found missing or in spam. |
| L-3 | 109 | deferred and rejected | add §2.4 | as ruled | Estimate to the epics step, revisit at sprint planning; stop rule rejected with its reason. |
| L-4 | 108 | applied | FR-29 (580, 581); FR-32 (626); FR-54 (914); FR-65 (964, 965); FR-18 (438); add T-02 | partial | FR-18 also makes a Claude-entered opening date wait; see gap 2. |
| L-5 | 109 | rejected | add §2.4 | as ruled | Reason recorded; SM-1 (1162) bears it out. |
| L-6 | 108 | applied | FR-43 (781); FR-54 (913) | as ruled | Owner only, in the app; no write tool sets it. |
| L-7 | 108 | applied | FR-41 (764) | as ruled | Release 1 shifts use the holiday data without overrides. |
| L-8 | 108 | applied | NFR-1 | as ruled | Stored COP keeps centavos, shown half-even to the peso. |
| L-9 | 108 | applied | FR-28 (560); FR-32 (623) | as ruled | Contending rows go to the review queue. Minor: gap 4. |
| L-10 | 108 | applied | §3 Void, Review queue; FR-28 (559); FR-25 (517); FR-55 (930); FR-32 (630) | partial | Only a void through Claude returns the statement row to the queue; see gap 1. |
| L-11 | 108 | applied | FR-23 (491) | as ruled | Official UVR replaces a manual one as an audited write. |
| L-12 | 108 | applied | FR-39 (733, 735) | as ruled | No income event in the horizon flags every payment, with its reason. |
| L-13 | 108 | applied | §9.3; add §8, T-01 | as ruled | FR-29 and FR-32 shown as split; splits in Release 1; T-01 wording. |
| L-14 | 108 | applied | §3 glossary | as ruled | All five entries present and aligned. |
| L-15 | 108 | applied | §0 (19) | as ruled | Assessment section, deferred item (FR-9), or reviewer gate (FR-64); both pointers hold. |
| L-16 | 108 | applied | NFR-1; FR-35 (667) | as ruled | Round-up exception named, to the peso or the cent. |
| L-17 | 108 | applied | NFR-10 (1029) | as ruled | Checks per release; UJ-7 and UJ-8 with Release 2. |
| L-18 | 108 | applied | A-1; FR-24; NFR-9; FR-32 | as ruled | Bound at 15.000; near amount is 15 percent (A-11); status filter. |
| L-19 | 108 | applied | R-2; FR-32 (628); FR-55 (928) | as ruled | Never undone on its own; the queue offers acknowledge only. |
| L-20 | 108 | applied | R-1 | as ruled | A COP amount carries the code COP. |
| L-21 | 109 | deferred | add §2.4 | as ruled | Owner: the architecture step; revisit at its add §3.3 re-check. |
| L-22 | 110 | applied | memlog 110 | as ruled | Owner acceptance of the open items triage recorded; §12 needs no change. |
| L-23 | 108 | applied | §9.1; add §4, §5 item 3 | as ruled | Stated as ruled and dropped from the epics list. |
| L-24 | 108 | applied | FR-60 (996) | as ruled | Navigation offers only shipped screens. |
| L-25 | 108 | applied | add §5 item 8 | as ruled | Existing entries stay as written. |
| L-26 | 108 | applied | §9.2 (1107) | as ruled | Deferred with the public demo. |
| L-27 | 108 | applied | FR-16 (394, 396); add §3.1 | as ruled | Behavior in FR-16; containers and proxy in add §3.1. |
| L-28 | 108 | applied | add decision 5 row, §3.5 | as ruled | "No amounts" in both. |

Counts: 46 as ruled, 2 partial, 0 missing, 0 conflicting.

## Gaps

1. L-10. `prd.md` §5.3 FR-25, line 517 (with FR-32 line 630 and §3 Review queue line 162). A void in the app settles the statement row on the spot; only a void through Claude returns it to the review queue, where the ruling returns it in every case. Smallest fix: have an in-app void leave the row in the review queue too, or put the inline choice to the owner as a refinement of L-10 (it mirrors FR-55's undo of an import match, line 933).
2. L-4. `prd.md` §5.2 FR-18, line 438. "Any of them" makes a Claude-entered opening date wait for confirmation, but FR-32 (line 626), FR-54 (line 914), and FR-65 (lines 964 and 965) list only the opening balance, starting debt, and adjustment. Smallest fix: write "When Claude enters the opening balance or a starting debt, or an adjustment". Adding the opening date to the three lists instead widens L-4 and needs the owner.
3. PF-11. `prd.md` §3 Goal withdrawal, line 176, lets Claude mark a withdrawal, while §3 Contribution (line 174) lets only the owner mark a funding transfer, and FR-54's one list (line 910) names neither marking. Smallest fix: name the marking in FR-54's list, or write "that the owner marks as one" in line 176.
4. L-9. `prd.md` §5.4 FR-28, line 565. "Matching counts rows: two identical staged rows against one existing transaction leave one row to post" can be read as settling two rows that contend for one uncleared transaction, which line 560 now sends to the review queue. Smallest fix: "The duplicate test counts rows: two identical staged rows against one cleared transaction leave one row to post."
5. PF-8. `addendum.md` §3.6, line 147. "Split into principal and interest by their schedules" no longer holds in Release 1, where a payment lowers the debt in full until the lender's split is entered or it is marked all principal (`prd.md` FR-37, line 707). Smallest fix: "split from the lender's statement, or by the computed schedule from Release 2; until then a payment lowers the debt in full (FR-26, FR-37)."
6. PF-17. `addendum.md` §3.9, line 171. "After an advisory in that base" drops NFR-13's "at high or above" (`prd.md` line 1032). Smallest fix: insert "at high or above".
7. PF-2. `prd.md` §5.1 heading, line 252. "(fix-first scope)" still labels §5.1 as the whole scope, which the glossary (line 212), §9.1 (line 1074), and §10 item 1 (line 1146) now widen. Smallest fix: drop the parenthetical, or write "(core of the fix-first scope)".
8. Finalize. `prd.md` frontmatter, lines 3 and 5: status reads draft and `updated` reads 2026-11-26, as expected mid-run. Smallest fix: set both at Finalize.
