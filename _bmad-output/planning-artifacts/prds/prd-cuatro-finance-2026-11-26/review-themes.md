# Reviewer gate themes

The reviewer gate of 2026-11-26 ran eight reviewers on `prd.md` and `addendum.md` and merged their critical and high findings into 31 themes. The owner ruled on each, as recorded in `.memlog.md`, and both documents carry the results. Finding IDs are each review file's own: rubric findings by line (for example rubric L45), product-lens F-n, adversarial C, H, M, and L, edge-cases EC-n, verification V-nn, domain D-n, and scope Fn. Line numbers inside the review and reconcile files refer to the drafts they reviewed, which later edits have shifted.

| Theme | Title | Disposition | Ruling | Sources |
|---|---|---|---|---|
| T-01 | Release 1, launch, and a go/no-go point | Decision | A binding Release 1 (the working ledger), launch at its first deploy, a go/no-go of one reconciled statement cycle per account, and a local capture-loop check before the VPS work | adversarial C1; product-lens F-2; scope F1 |
| T-02 | Owner check on Claude's high-impact writes | Decision | Provenance on terms, cuota purchases, rules, and closing balances; the owner confirms Claude-entered account terms and closing balances; category merge and archive stay owner-only | adversarial C2, H2 (part) |
| T-03 | Metrics the app can compute | Decision | Computable definitions, SM-2 by path, and SM-5 added | adversarial H9 |
| T-04 | Lifetime and identity of connection grants | Decision | 30 days for write scope, 90 for read; only the three acceptance apps connect | adversarial H4 |
| T-05 | What the AI provider receives | Decision | The exposure recorded in `prd.md` §7.1, narrow reads, spreadsheet imports preferred over PDFs | adversarial H6, H1 (part) |
| T-06 | A-1 and the savings and investment promise | Decision | A-1 as the app's guarantee, with provenance; a savings plan in the Vision | adversarial H3 |
| T-07 | One currency per account | Decision | Linked USD card accounts and one crypto account per asset | edge-cases EC-2; scope F3 |
| T-08 | Cash spending | Decision | Withdrawals post as spending under a cash category | adversarial H8 (part) |
| T-09 | When subscription detection starts | Decision | Gated on six months of history | scope F2 |
| T-10 | Forecast rules that make two builds agree | Autofix | Applied | verification V-01; rubric L45; edge-cases EC-11, EC-12 |
| T-11 | One classification for staged rows | Autofix | Applied | edge-cases EC-1; verification V-02; adversarial H8 (part) |
| T-12 | Transfer detection, across currencies too | Autofix | Applied | verification V-03; edge-cases EC-15 |
| T-13 | Planned items meet their transactions | Autofix | Applied | product-lens F-3; edge-cases EC-10, EC-14 |
| T-14 | The forecast in the first months | Autofix | Applied | product-lens F-1; edge-cases EC-13 |
| T-15 | Cuota purchases across statements | Autofix | Applied | domain D-2; edge-cases EC-3 (part), EC-4, EC-5; verification V-07 (part) |
| T-16 | Card minimum payment and due date | Autofix | Applied | domain D-1; edge-cases EC-8 |
| T-17 | Installment schedules and actual payments | Autofix | Applied | verification V-07; edge-cases EC-6, EC-7 |
| T-18 | Paying account and held-back extra | Autofix | Applied | edge-cases EC-9; verification V-09 |
| T-19 | Payoff comparison rules | Autofix | Applied | verification V-08 |
| T-20 | Reconciliation periods and clearing | Autofix | Applied | edge-cases EC-16, EC-3 (part) |
| T-21 | History after late-dated writes | Autofix | Applied | edge-cases EC-17; verification V-10; scope F4 |
| T-22 | Undo rules | Autofix | Applied | verification V-04 |
| T-23 | Amount and date text parsing | Autofix | Applied | verification V-06 |
| T-24 | Capture checks the app enforces | Autofix | Applied | verification V-05 |
| T-25 | One write list, balances only by transaction | Autofix | Applied | rubric L70; adversarial H2 (part) |
| T-26 | Untrusted text and visible Claude writes | Autofix | Applied | adversarial H1 (part) |
| T-27 | Attempt limits on sign-in and authorization | Autofix | Applied as FR-64, tagged baseline | adversarial H5 (part) |
| T-28 | A stale ledger is labeled | Autofix | Applied | adversarial H7 |
| T-29 | Development prompts stay generic | Autofix | Applied | adversarial H11 |
| T-30 | Verifying the AI connection | Autofix | Applied | verification V-11; adversarial H10 |
| T-31 | Which parts of the deployment are public | Deferred | To the architecture step (`addendum.md` §3.1, `prd.md` Open Question 7) | adversarial H5 (part) |

Medium and low findings: the cheap, safe fixes were applied with the themes; the rest were ruled one by one (small calls and scope trims) and recorded in `.memlog.md`.
