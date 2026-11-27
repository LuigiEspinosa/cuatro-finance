# Review: privacy and security compliance, post-final update

## Verdicts

| Rule | Verdict | Basis |
|---|---|---|
| 1. Privacy | pass | Accounts appear by type only. No line in scope names an institution, account number, balance, personal amount, income or its type, pay schedule, employer, tax position, or holding. The numbers in scope are system limits, tolerances, or test thresholds. No journey or example line changed. Two low findings guard records that later steps will write. |
| 2. Security | pass | No FR heading or brownfield tag changed. No changed line puts a security requirement under built but broken, says the shipped code lacks a control, or names a file path, code line, port, or credential. NFR-6 (PF-15) and NFR-13 (PF-17) state rules only. Two low findings harden the tag rule. |
| 3. Citation and institution names | pass | The reconcile file cites by section and line. The short phrases it quotes (gaps 2, 4, 5, 6, and 7) are neither personal details nor security gaps. No file in scope names an institution. |
| 4. Writing | pass | No em dash, en dash, other dash character, bare double hyphen, or emoji in scope, nor anywhere in the four files. The only double hyphens are the reconcile file's table rule (line 16). |

## Findings

Counts: critical 0, high 0, medium 0, low 4. None blocks the commit. Each fix is optional hardening.

1. **C-1 (low).** `prd.md` §5.1 description, line 254, with the same ruling at `.memlog.md` line 95. The epics step marks the defect consequences inside built but broken FRs against assessment §5 and §6, and §6 also holds security items (FR-2 at line 270 and FR-4 at line 288 cite it). The five FRs named carry functional consequences only, so nothing breaches the rule today. The risk is an epics file that later marks a §6 security item under a built but broken FR. Fix: add to line 254 that a §6 item which is a security requirement is marked only against its baseline FR.
2. **C-2 (low).** `prd.md` §5.1 FR-16, line 396 (L-27). The services clause restates FR-6's baseline behavior inside an FR tagged new, so the line carries the baseline tag only through its pointer. The new tag describes the unbuilt deployment, not shipped code, so no claim of a missing control follows. Fix: write the pointer as "(FR-6, baseline)".
3. **C-3 (low).** `prd.md` §6 NFR-9, line 1021. Runs measure on real data until the ledger reaches the stated bound, and the fixture is recorded with each run. Read as recording the fixture itself, a committed run record could carry real ledger content. Fix: say that a run record names its fixture by kind (real data or seed) and that real data never enters the repository.
4. **C-4 (low).** `.memlog.md` line 103 (PF-13). The FR-42 epic's first check inspects real statement descriptors. No committed file carries one yet, and memlog lines stay as written. Fix: carry into the FR-42 epic's brief, or add to `addendum.md` §2.4 line 70, that the check's findings use fictional descriptors only.

## Scope and method

Reviewed on 2026-11-27 at the reviewer gate of the `bmad-prd` Update run (`.memlog.md` line 116). In scope: every line the run added or changed in `prd.md` (120 lines in 44 hunks) and `addendum.md` (46 lines in 10 hunks), taken from `git diff` against HEAD; `.memlog.md` lines 94 to 117, plus its changed frontmatter line 4; and all 77 lines of `reconcile-post-final-2026-11-27.md`. Line numbers point at the working copies.

Each line was read in full. Mechanical scans then ran on the working copies, not on diff output: dash and emoji code points, double hyphens, institution, income, tax, and holding keywords, money-like numbers, account number patterns, file path, port, credential, and exploit keywords, and names, emails, and links.

Context came from `review-post-final-2026-11-27.md` §3 and §6 and from unchanged lines of `prd.md` and `addendum.md`. The re-entry assessment, `.private/`, the deferred work file, the original plan, and the other review and reconcile files were not read, so whether a pointer to assessment §5 or §6 covers a security item was judged from the FR texts that cite it.

## Checked and cleared

- `addendum.md` §3.1, line 84: the run changed only the FR-16 pointer at the start of the line. Its second sentence, unchanged since HEAD, describes a defect in shipped configuration and points at assessment §5, the defects section, not at a §4 or §6 gap. It names no file, port, or credential.
- Deferred item 1's shared sign-in redirect task (`prd.md` lines 212, 254, 1074, and 1146; `addendum.md` line 35; `.memlog.md` line 95; reconcile file line 18): `addendum.md` §5 item 1 (lines 193 to 195, unchanged) defines it as accepted lint warnings, not a security gap.
- NFR-6 (`prd.md` line 1018), `addendum.md` §2.4 line 72 and §4 line 175, and `.memlog.md` line 105: an audit-based definition, a fix-version exception after the owner's review, and the response while an advisory is open, all as rules. The sentence on the upgrade plan before the first deploy is unchanged since HEAD and is also a rule.
- NFR-13 (`prd.md` line 1032), `addendum.md` §2.4 line 74 and §3.9 line 171, and `.memlog.md` line 107: rules for host updates, rebuilds, and time away. None describes the current host, and none gives dates or places for the owner's absence.
- `prd.md` §9.1 line 1074: the deferred item 3 ruling names unused test packages, a hygiene fact already in `addendum.md` §4 and §5 at HEAD. It is neither NFR-6 text nor a security gap.
- `addendum.md` §5 item 8, line 203: the CHANGELOG ruling names no claim and no control.
- A-13 (`prd.md` §13 line 1201), FR-54 (line 915), and the alert lines (FR-48 lines 845, 846, 848, and 849; §9.3 lines 1128 and 1138; `addendum.md` §8 line 246): defensive bounds stated as required behavior.
- Accounts by type: the mortgage, loans, cards, and the crypto account appear by type only (`prd.md` lines 140, 471, 525, 707, and 847; `addendum.md` §3.6 lines 144 and 147; `.memlog.md` lines 100 and 102).
- The reconcile file's line 11 (no institution, personal amount, exploit detail, or dash in the added text) holds against these scans.

## Outside the checked lines

Not counted. `addendum.md` §4 line 178, unchanged since HEAD, states the shipped framework version, a claim about the shipped dependency set of the kind the PF-15 rule keeps out of NFR-6. At the next edit of §4 it could name the target version only.
