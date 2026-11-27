# Reconcile: re-entry assessment

## Summary

The PRD and addendum carry the assessment closely: every §4 pre-deploy item and every §6 issue and unfiled defect maps to an FR with the right brownfield tag, and every §8 line and §9 decision is covered or settled in the decision log, though two §8 lines lose a clause. The main gaps are a recurring-event frequency set that cannot express the Colombian pay pattern §7.2 counts as the differentiator, the dropped caution to re-check §7 facts before building on them, and S3-NN IDs that the decision log uses but the addendum never keys. The main contradiction is NFR-6, whose advisory bar, as written, does not fit the upgrade order that §10 sets after the backup work (contradiction 1). No Privacy or Security rule break was found in prd.md or addendum.md.

## Gaps

1. **§8 line 201 (S8-26) and §7.2 line 151 (F7.2-12).**
   - Missing: FR-41 offers every two weeks, which drifts off fixed calendar days, but no twice-a-month frequency on two fixed days (the common Colombian pay pattern that §7.2 line 151 counts as part of the differentiator) and no rule for an event or due day past a short month's end.
   - Belongs: FR-41 (PRD line 601), and the due days of FR-36 and FR-37 (PRD lines 553 and 562).
   - Fix: add a twice-a-month frequency on two chosen days and a last-day-of-month option to FR-41, plus one consequence that a day beyond a month's length falls on its last day; apply the same rule to card and loan due days. Memlog line 52 keeps income events generic, and this keeps them generic: it adds a frequency, not anyone's schedule.

2. **§10 line 260.**
   - Missing: the caution that the §7 landscape moves monthly, so anything a decision depends on is re-checked before use; addendum §3 carries versions, peer floors, Claude's protocol rollout status, authorization behavior, and data-source endpoints with no verified-on date, and addendum §6 dates its facts (line 131) but never asks for a re-check.
   - Belongs: under the addendum §3 heading (line 44) and in the addendum §6 intro (line 131).
   - Fix: one line in each: the facts were verified on 2026-11-25, and the architecture step re-checks any it builds on (package versions and peer floors, Claude's 2026-07-28 rollout and authorization behavior, data-source endpoints, the tax reform, and the holiday-law challenge). Memlog line 18 limits new research inside this PRD session only, so it does not settle this for the downstream steps.

3. **§3 lines 33 to 46.**
   - Missing: memlog lines 36 and 37 cite S3-05, S3-06, S3-08, S3-09, and S3-11 to S3-14, but the addendum §1 reference key defines no S3-NN, and memlog lines cannot be edited.
   - Belongs: addendum §1 (lines 9 to 15).
   - Fix: add an S3-NN entry. One numbering fits every memlog use and the four owner-reported closures: the seven table rows in order, with the coverage row and the build row each split in two (01 to 09), then the four bullets, with the CI, container image, and compose service clause split in three (10 to 15). Under it, the open items map to NFR-10 and FR-17 (05), NFR-10 (06, see gap 4), U6 (08), FR-16 (09, 12, 13), FR-17 (11), and FR-13 (14). Confirm the numbering before adding it.

4. **§3 line 37 (S3-06 under the numbering above).**
   - Missing: the assessment found the record access layer, request validation, and API routes at zero coverage, yet NFR-10's 80 percent list names only domain modules, and addendum §3.7 plans integration tests for auth, import, alerts, and write tools but not the app's own routes, where FR-4, FR-5, FR-9, and FR-10 apply.
   - Belongs: NFR-10 (PRD line 819) or addendum §3.7 (line 92).
   - Fix: add request validation and the API routes to the NFR-10 coverage list, or add every API route to the integration tests in addendum §3.7.

5. **§5 line 106.**
   - Missing: the finding that the existing reverse proxy configuration does not route to the app is not carried, while addendum §3.1 (line 49) points the architecture step at the plan's proxy.
   - Belongs: FR-16 (PRD line 338) and addendum §3.1.
   - Fix: add an FR-16 consequence that the composed deployment serves the app through the reverse proxy over HTTPS, and note in addendum §3.1 that the current proxy configuration is replaced, not reused.

6. **§4 line 52.**
   - Missing: FR-2's testable consequence covers API routes and tools but not screens.
   - Belongs: FR-2 (PRD line 223).
   - Fix: make the consequence read that every screen, API route, and tool rejects a session that has not completed TOTP (baseline, assessment §4).

7. **§8 line 169 (S8-05) and §7.1 line 132 (F7.1-05).**
   - Missing: the manual pricing fallback; FR-21 values a position only from the fetched price, so an asset the price source lacks, or an outage past the stale window, leaves no way to value it.
   - Belongs: FR-21 (PRD line 388).
   - Fix: let the owner enter a dated manual price per asset, labeled manual and used only while no newer fetched price exists.

8. **§7.1 line 131 (F7.1-04).**
   - Missing: the weekly bank interest rate dataset and its short retention (store it locally) are not kept for the deferred open-data benchmarks (S8-39).
   - Belongs: addendum §6 (line 129 onward).
   - Fix: one line in addendum §6 for when S8-39 returns.

## Contradictions or misstatements

1. **§4 lines 52 to 53 and §6 line 120.**
   - Issue: NFR-6 (PRD line 815) and FR-8 (PRD line 269) apply one advisory bar to every push and drop the triage cited at §4 lines 52 to 53 and §6 line 120, so their timing does not fit the order of PRD §10 item 2 (line 893), which schedules the FR-15 backup and restore work before U2.
   - Where: NFR-6, FR-8, and PRD §10.
   - Fix: say that NFR-6 binds from the first deploy, and that until then the §10 upgrade order governs which pushes go out.

2. **§7.2 line 145 (F7.2-06).**
   - Issue: addendum line 51 gives a future no-auth demo connector per-client rate limits; the source says per-IP, and a no-auth connector has no client identity to limit by.
   - Where: addendum §3.1.
   - Fix: per-IP and global rate limits and result-size caps.

3. **§4 line 62 (U2).**
   - Issue: addendum line 108 states the two-factor schema change and the setup-form type break as settled; the source read them from the published packages and leaves them to be confirmed by typecheck.
   - Where: addendum §4, U2.
   - Fix: add that both are confirmed by typecheck during U2.

4. **§7.1 line 132 (F7.1-05).**
   - Issue: addendum line 72 files the unofficial stock price endpoint under S8-13, which cuts only Alpha Vantage as the primary stock source.
   - Where: addendum §3.4.
   - Fix: cite F7.1-05 and decision 3 (listed stocks out of the MVP) for both drops.

## Rule compliance

None found. prd.md and addendum.md name no institution, account number, balance, personal amount, salary type, pay schedule, employer, tax position, or threshold status. Every security item from assessment §4 to §6 appears only as required behavior with the baseline tag and a section pointer (FR-2 to FR-8, FR-14), with no file path, line number, port, or credential.

Note, not a break: PRD line 884 implies which instrument types the owner does not hold. That stays at type level, so it is within the rule; neutral wording such as "revisit when needed" would say less.

## Deliberate, not gaps

- §3 lines 34, 38, 43, and 46 (client generation without a database, the lint script, the seed path, the runtime pins): closed (memlog line 12; addendum line 111).
- §4 lines 52 and 54 (the next, jsdom, and undici advisories): closed (memlog line 12; addendum lines 107 and 109).
- §4 line 60 (U0, unarchive): done 2026-11-26 (addendum line 106).
- §4 line 67 (U7 optional majors): deferred (memlog line 37; PRD line 886); its jsdom clause lapsed when jsdom was removed (addendum line 109).
- §5 line 87 (S5-03): only a masked account suffix is stored, so encryption covers stored secrets only (memlog line 38; addendum line 86).
- §5 line 92 (S5-08): AFC deferred (memlog line 40); the UVR part is conditional on Open Question 1 (FR-23; memlog line 42).
- §5 line 93 (S5-09, bank sync scaffold): cut with its columns (S8-09; memlog line 32; addendum line 85).
- §5 line 98 (S5-14, payment timing optimizer): cut for the rule-based payment plan of FR-39 (memlog line 51).
- §5 line 99 (S5-15, investments): crypto positions only (memlog line 40).
- §5 line 100 (S5-16, the precomputed forecast table): dropped, the forecast is computed on request (S8-16; addendum line 84).
- §5 line 103 (S5-19, n8n): cut (memlog lines 32 and 34).
- §5 line 104 (S5-20, demo mode): deferred (memlog line 30).
- §5 line 108 (README and changelog drift, the version mismatch, layout and class defects): deferred items 4 and 8 (addendum lines 122 and 126); the layout and class defects go with the redesign (FR-60, FR-61).
- §7.2 line 140 (pitch the AI connection on its design): moot under personal tool first; the portfolio value column no longer counts (memlog line 30).
- §7.1 line 136 (payroll legal dates): income events kept generic (memlog line 52).
- §7.1 lines 132 and 133 (listed stock prices, the stale ticker, the demo seed merchant): listed stocks out of the MVP and the demo deferred (memlog lines 30 and 40).
- §7.1 line 130 (alert email capture): deferred as S8-23 (memlog line 32).
- §7.2 lines 145 and 146 (no-auth demo connector, MCP Apps widgets): deferred (memlog lines 30 and 56; PRD lines 875 and 876).
- §7.2 line 147 (n8n licence and CVEs): n8n cut (memlog line 32).
- §7.2 line 149 (Web Push facts): deferred with the phone surface (memlog line 34; PRD line 883).
- §8 line 166 (S8-02 custom periods and rollovers): rejected, budgets are monthly (memlog line 50; PRD line 879).
- §8 line 168 (S8-04): AFC deferred, UVR conditional (memlog lines 40 and 42).
- §8 line 171 (S8-07): demo deferred (memlog line 30; PRD line 875).
- §8 line 172 (S8-08): field encryption narrowed to stored secrets (memlog line 38).
- §8 lines 176 to 182 and 184 (S8-09 to S8-15, S8-17): cut (PRD line 888; memlog lines 30, 32, 40, and 51).
- §8 line 183 (S8-16): dropped (addendum line 84; memlog line 46).
- §8 line 188 (S8-18): replaced by a Postgres-backed queue or a single runner, chosen at architecture (addendum §3.2; memlog line 46).
- §8 line 189 (S8-19): Web Push deferred with the phone surface, email is the MVP channel (memlog line 34; addendum line 27).
- §8 lines 190 and 210 (the read-only stance of S8-20 and S8-35): replaced by guarded write tools (memlog line 55; PRD line 689).
- §8 lines 191 and 199 (the LLM fallback of S8-21 and S8-24): replaced by Claude through the AI connection; the app calls no LLM (memlog line 33).
- §8 line 197 (the LLM extraction in S8-22): Claude reads PDFs and stages raw rows (memlog line 33).
- §8 line 198 (S8-23): deferred (memlog line 32; PRD line 877).
- §8 lines 203, 204, and 206 (S8-28, S8-29, S8-31): deferred until the tax reform settles (memlog line 35; PRD line 882).
- §8 line 207 (S8-32): deferred with the phone surface (memlog line 34; PRD line 883).
- §8 line 208 (S8-33): deferred to the phone surface (memlog line 57).
- §8 line 209 (S8-34): deferred (memlog line 52; PRD line 880).
- §8 line 211 (S8-36): deferred (memlog lines 30 and 56).
- §8 lines 214 and 218 (S8-39, the Sankey half of S8-43): deferred (memlog line 53; PRD line 881).
- §8 line 215 (S8-40): deferred (memlog line 40; PRD line 884).
- §8 line 216 (S8-41): cut (memlog line 34).
- §8 line 217 (S8-42): deferred (memlog line 48; PRD line 878).
- §9 line 234 (decision 9): settled before the session (memlog line 9; addendum line 19).
