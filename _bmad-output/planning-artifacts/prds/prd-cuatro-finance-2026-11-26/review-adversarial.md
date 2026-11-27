# Review: adversarial

## Verdict

The money rules are sound, but the trust model is circular: Claude can enter the terms, stage and confirm the rows, enter the closing balance, resolve the review queue, and then narrate exact app figures computed from its own inputs, and SM-1 counts the result as success. The MVP then puts 63 FRs, a full redesign, and a deploy gate in front of the first real conversation with Claude, so the thesis that the owner will run their finances through Claude is tested last, after everything that depends on it is built. It is not ready to be chain-top until the owner decides which writes need an independent check, which smaller release starts the success clock, and how the app shows a ledger that nobody is keeping current.

## Findings

Counts: 2 critical, 11 high, 6 medium, 1 low. Line numbers are `prd.md` lines unless marked addendum or memlog. Every example uses the PRD's fictional owner, Mariana, with made-up numbers.

### C1. The MVP is too big to be the working version the owner asked for, and it tests the thesis last

- **Severity:** critical
- **Location:** §9.1 (lines 883 to 895); §10 items 1, 4, 6, 7 and the release order note (lines 920, 923, 925, 926, 929); SM-1 and SM-C3 (lines 936, 946); NFR-3, NFR-9, NFR-10 (lines 838, 844, 845); addendum §8 (lines 166 to 169) and line 24; memlog lines 21 and 23.
- **Failure scenario:** §5.1 alone holds 18 FRs (security, defects, backups with monthly restore checks, a container and proxy, CI, TOTP recovery), and all of it must pass before any new feature and before the first deploy, while the AI connection may go live only on the deployed app (line 923). The first slice the epics step is pointed at is only a suggestion (line 929), and even that slice carries the read and write tools, import, reconciliation, and its screens on the contract, which wait for the UX step and a registry change in another repository (line 926). The bar is professional grade: 100 percent money layer coverage, WCAG 2.2 AA with a recorded manual pass per release, Lighthouse accessibility 100, an end-to-end check per journey. Addendum §8 sizes data and hosting cost, never effort. The likely path is months of solo work before Claude touches a real ledger, on an app whose core never worked end to end (addendum line 24). If the capture habit then does not stick, the forecast, payment plan, scenarios, goals, and subscription detection were built on a ledger nobody keeps current. SM-C3 says breadth is not a goal while §9.1 is all breadth.
- **Fix:** Make the release order binding and name Release 1 as the working version, for example §5.1 plus FR-18 to FR-20, FR-22, FR-24 to FR-29, FR-50 to FR-52, and FR-54 to FR-57 on patched or minimal screens. Start the success clock at Release 1. Move §5.5 to §5.10, crypto, and the full redesign to Release 2. Before the deploy gate, run a short local check of the capture loop: the AI connection on a local instance with a fictional ledger, driven from Claude Code, so the riskiest assumption meets reality before the VPS work. Add an effort estimate per release to addendum §8 and a stop rule: if Release 1 sees little capture through Claude after a set number of weeks, re-plan before Release 2.
- **Owner question:** Which release starts the SM-1 clock, and is the redesign part of the working version or of the release after it?

### C2. Claude grades its own work, and A-1 turns its unchecked inputs into authoritative figures

- **Severity:** critical
- **Location:** FR-27 (line 470); FR-29 (lines 486 to 490); FR-32 (line 524); FR-54 (line 755); FR-56 (line 783); UJ-1 edge case (line 60); UJ-4 (line 72); §7.2 (line 862); A-1 and A-6 (lines 961, 966); SM-1 (line 936).
- **Failure scenario:** Two cases. First, Mariana's card statement prints the rate twice, as 28,5 percent EA and as 2,11 percent monthly, and Claude enters 2,11 as the EA rate. The money layer stores it exactly, and every payoff comparison and scenario is then computed exactly from a wrong input: avalanche ranks the card as her cheapest debt and sends the monthly extra elsewhere, and Claude quotes "the app's figures" with full confidence. UJ-1's safeguard (the monthly equivalent beside the rate) lives on a screen she never opens, because Claude made the change. Second, Claude stages 23 rows from a PDF, misreads 1.250.000 as 125.000, enters the closing balance from the same PDF, and the app shows a difference. Mariana says "fix it", and Claude edits a transaction until the difference is zero. The account is marked reconciled and SM-1 counts it. A-6 puts reconciliation in the MVP because SM-1 measures it, and FR-29 lets Claude produce the measurement alone. Every link in the chain (staging, confirming the import, resolving review items, entering the closing balance, correcting rows, creating rules) is a write Claude may make by itself, and the only check is Claude reading back its own echo (FR-56) or the owner opening the app, which SM-C2 treats as a cost.
- **Fix:** (1) Record the source of every account term, loan term, cuota purchase, rule, and closing balance, and have every compute response say when it depends on a Claude-entered input the owner has not confirmed. (2) Add one owner confirmation in the app for the high-impact class: terms, rules, closing balances, an import with flagged rows or above a row count, and any review resolution that discards a row. A single captured transaction stays immediate. (3) A reconciliation records who entered the closing balance and whether any write inside the period followed a nonzero difference, and SM-1 counts only reconciliations whose closing balance the owner confirmed. (4) Reconsider one MCP Apps confirmation view for writes on claude.ai web and Claude Desktop (deferred at line 902), so the owner sees the app's own rendering of a write instead of Claude's paraphrase.
- **Owner question:** Which writes take effect at once, and which wait for a one-tap confirmation in the app?

### H1. The prompt injection claim in §7.2 is false, and the architecture step is told to rely on it

- **Severity:** high
- **Location:** §7.2 (line 861); addendum §3.8 (line 104); FR-52 (lines 736 to 742); FR-57 (lines 785 to 791); §5.4 and FR-27 (lines 458, 472); FR-48 and FR-49 (lines 700, 710).
- **Failure scenario:** Third parties write part of the ledger: merchant descriptors, a sender's description on an incoming transfer where a statement shows one, and anything inside a file the owner hands Claude. That text is stored and comes back through read tools in every later conversation, so an instruction inside it outlives the import, and undoing a write does not remove it. Two failures sit outside the claim. Disclosure: in a conversation where Claude also holds tools that reach outside (web access, email, file connectors), the text can steer Claude into carrying ledger data out, and no undo reverses a disclosure. Unnoticed changes: a small write (the monthly extra, a loan term, a budget, a category) is reversible only once someone notices it, and nothing reports Claude's writes out of band, since alerts and the digest carry no write counts. Addendum §3.8 hands the architecture step "at worst reversible records", so the threat is designed out of scope.
- **Fix:** Replace line 861 with a threat statement: third-party text is untrusted data, disclosure cannot be undone, and undo bounds integrity only when the owner sees the change. Then require that read tools return third-party text in a delimited field marked as statement text, bounded in length; that the server instructions and tool descriptions tell Claude such text is data, never an instruction; that the alert list and the weekly digest carry counts of Claude writes by type (counts only, per NFR-7); and that C2's confirmation covers the high-impact class.
- **Owner question:** Will the finance connector share conversations with connectors that can send data outside, or is keeping them apart an operating rule the owner accepts?

### H2. The write guardrails reopen the balance overwrite the owner ruled out

- **Severity:** high
- **Location:** FR-54 (lines 755, 758); FR-5 (line 247); FR-18 (line 373); FR-37 (line 581); FR-42 (line 637); UJ-1 (line 60); memlog lines 52 and 55.
- **Failure scenario:** Mariana says "the bank says I owe 18.200.000 on the car loan, fix it". Claude cannot set a balance (line 758), but it can change loan terms, and FR-37 gives a loan a current debt. Claude edits it: debt and net worth move with no transaction behind them, and the loan can never show a reconciliation difference again because its balance was written to match. The same path runs through an account's opening balance and opening date (FR-18) and through the running cuota purchases entered at setup. The owner's ruling was "no balance overwrite" (memlog line 55), and FR-5 says balances change only through transactions; the write list reopens both under other names. A second drift: the walk made the unwanted subscription flag owner-only (memlog line 52), and FR-42 hands it to Claude. And one write scope covers both a 48.000 lunch and the mortgage rate, so the owner cannot grant capture without granting everything.
- **Fix:** Opening balance, opening date, and a liability's starting debt are set once at creation; any later change is an adjustment transaction with a reason, visible in the feed and in reconciliation. FR-37's current debt is derived, never stored or written. Decide whether Claude may create accounts at all. Align FR-42 with memlog line 52, or record that owner-only meant only "never automatic". Split write scope into capture (record, correct, and void transactions; stage rows) and manage (terms, accounts, rules, budgets, goals, confirmations, closing balances), or route the manage class through C2's confirmation.

### H3. A-1 cannot hold, starting with the PRD's own vision

- **Severity:** high
- **Location:** §1 (lines 29, 31); UJ-4 (line 72); UJ-8 (line 88); FR-18 (line 373); FR-53 (line 746); §7.2 (line 862); A-1 (line 961).
- **Failure scenario:** The Vision promises "a savings and investment plan toward something they want to buy". In UJ-8, Claude "compares keeping the money in her savings pocket with buying USD each month". No compute tool returns a savings yield or a USD purchase path (FR-53 lists none), and a savings account carries no interest rate (FR-18), so the comparison is Claude's own arithmetic or opinion, delivered beside exact app figures and borrowing their authority. More broadly, the app cannot enforce A-1: Claude can page raw transactions through read tools and compute with its own tools, and the app sees tool calls, never the answer. UJ-4's "quoting only the app's figures" describes a third party's behavior that no test in this repository can check.
- **Fix:** Either add the compute the Vision needs (an EA rate on savings accounts and a goal plan that compares funding accounts), or narrow §1 and UJ-8 so investment comparisons are qualitative and labeled as not from the app. Restate A-1 as what the app guarantees: every figure a tool returns comes from the money layer and carries its source and dates, and the tool descriptions ask Claude to cite them. Give compute responses a short provenance line Claude can quote, so a figure without one reads as Claude's own.

### H4. The AI connection outlives every session control the app enforces

- **Severity:** high
- **Location:** NFR-4 (line 839); NFR-5 (line 840); FR-2 (line 223); FR-51 (lines 731 to 734); FR-48 (line 700); addendum §3.3 (line 66) and §3.8 (line 106).
- **Failure scenario:** The screens demand TOTP every session, end after 30 idle minutes, and stop at 24 hours. A connected client with read and write scope has none of that: it lives as long as it is used once every 30 days. Anyone who gets into the owner's Claude account, or sits at an unlocked laptop with a Claude app signed in, reads and changes the whole ledger with no password and no TOTP, and no alert fires, because FR-48 alerts only on new connections. The friction gap also pushes daily use toward the weaker door. FR-2's "every tool rejects a request whose session has not completed TOTP" is not testable as written, since tool calls carry a grant, not a session. And no FR limits which clients may ask for consent: the addendum turns dynamic registration off and accepts client identity documents, but nothing restricts which identities are accepted.
- **Fix:** NFR-5 gains a maximum grant lifetime after which the owner reconnects with TOTP, shorter for write scope than for read. FR-2 is restated for tools: every call carries a grant issued after a sign-in that completed TOTP and still inside its lifetime. Authorization accepts only the client identities of the three acceptance apps, and the consent screen and the new-client alert name the client and where it returns.
- **Owner question:** How long may a write grant live before Claude must reconnect with TOTP?

### H5. The whole app is public so that one connector can be, and the requirements set no attempt limits

- **Severity:** high
- **Location:** FR-16 (line 342); §10 item 4 (line 923); addendum decision 7 (line 30) and §3.1 (lines 51 to 54).
- **Failure scenario:** Claude's connector service must reach the AI connection, so the PRD publishes everything: every screen, the API, and the authorization pages, on one host that holds the owner's complete financial record behind one password and a TOTP code. For this private deployment the requirements set no limit on sign-in, TOTP, or authorization attempts and no alert on repeated failures; the only rate limits in either document belong to the deferred demo.
- **Fix:** Add a required behavior: sign-in, TOTP, and authorization attempts are limited per account and per source, and repeated failures raise an alert that cannot be turned off (tag new, or baseline with its pointer if assessment §4 or §6 already lists it). Then decide the public surface. The architecture step verifies which endpoints the connector service calls and whether its source addresses are published, which would allow an allowlist on the connector path.
- **Owner question:** Does anything besides the connector path need to be public? The owner works at a desktop, so the screens could be reachable only from the owner's own devices, for example over a private network on a free tier.

### H6. The largest privacy flow has no bound: the provider receives the ledger and whole statements

- **Severity:** high
- **Location:** §7.1 (lines 853 to 856); NFR-7 (line 842); FR-52 (line 741); §5.4 and FR-27 (lines 458, 472); addendum decision 4 (line 27).
- **Failure scenario:** §7.1 protects the public repository; nothing bounds what the AI provider receives. A statement PDF handed to Claude carries what statements carry: the holder's name and identity details, an address, the full account number, and every row. FR-52 keeps the full account number out of tool responses, but the PDF path delivers it anyway, with more. Read tools can page the whole history into a conversation, where it stays in the provider's history under the owner's account settings (retention, the training choice, memory, sharing) and, for Claude Code, in local session files on the owner's machine. "The app calls no LLM API" reads as a privacy property while the design routes the whole ledger to the same provider by another path.
- **Fix:** §7.1 records the accepted provider exposure as an owner decision: which data, which apps, which account settings, and the fact that the PDF path carries identity details the tool rules exclude. Capture prefers the app's own XLS and CSV import for any account that offers one, with PDFs through Claude as the fallback; deterministic per-format PDF parsing in the app is a third option the decision record did not weigh. Read tools answer with the narrowest data by default (totals and a recent window, rows on request) under the addendum's result-size caps.
- **Owner question:** Is sending whole statements to the provider acceptable, or should accounts without a spreadsheet export be parsed in the app?

### H7. A stale ledger looks exactly like a current one

- **Severity:** high
- **Location:** NFR-8 (line 843); FR-44 (lines 650 to 654); FR-45 (lines 667 to 669); FR-53 (lines 749 to 751); FR-48 (line 700); FR-36 (line 571).
- **Failure scenario:** NFR-8 labels a rate stale after 2 days; nothing labels a ledger nobody has imported into or captured for weeks. Mariana stops importing for five weeks, then asks whether she can add COP 300.000 to the card this month. The scenario starts from a savings balance missing five weeks of spending, the forecast low point sits above her buffer, and Claude says yes, quoting the app. Every response carried fresh rate dates and high confidence for fixed events, and nothing said the ledger itself was five weeks old. This is the import discipline single point of failure, and the PRD gives it no signal.
- **Fix:** Each account carries a "current through" date (its last reconciled statement and its last capture), shown on the dashboard. Every compute response states the oldest such date among the accounts it used and flags any older than a limit the owner sets. The app knows each card's statement cut day (FR-36), so it raises a "statement expected" review item and alert when no import follows within a set number of days. The same records make SM-1's 7-day window measurable.

### H8. Conversational capture mostly duplicates the statement, and cash, the one thing only conversation can capture, has no home

- **Severity:** high
- **Location:** FR-56 (lines 779, 782); FR-28 (line 481); A-5 (line 965); glossary account types (line 110); §9.2 (line 911); UJ-3 (line 68); §2.2 (line 53); Open Question 2 (line 951).
- **Failure scenario:** Nearly every MVP account produces a statement, so every transaction Mariana tells Claude arrives a second time and must match. The match rule is the same account and the same amount within 3 days. She tells Claude "48.000 for lunch", and the card charges 52.800 with the tip. No match, and no near duplicate either (that needs the same amount too), so the statement row posts beside her entry and the lunch counts twice until a reconciliation difference surfaces it. A USD charge whose COP figure differs, a typo, or a pre-authorization does the same. Meanwhile the one kind of spending no statement will ever show, cash, has no account type: the record tool requires an explicit account (line 779) and none fits, so cash leaves through a withdrawal as one uncategorized lump. And UJ-3's capture happens after dinner at the desktop, from memory. Whether capture can happen at the moment of spending is Open Question 2, filed as not affecting the MVP, though it decides whether conversational capture is worth its matching cost.
- **Fix:** Decide cash: an account type with no statement (outside SM-1), or withdrawals filed to a cash category. A staged row close to a Claude entry in amount (within a tolerance, or tip-shaped) is offered as a match for review, never posted silently. At import, Claude entries in the statement period with no matching row join the review queue. Answer Open Question 2 before the capture epic.

### H9. The success metrics cannot be measured from what the PRD builds, and the ones that can do not test the thesis

- **Severity:** high
- **Location:** §11 (lines 936 to 946); FR-29 (line 490); FR-33 (lines 535 to 540); §5.11 note (line 714); memlog line 65.
- **Failure scenario:**
  - SM-1: no record holds when a statement "arrives"; FR-29 knows a zero difference and a nonzero one, never an "unexplained" one; "every account" includes accounts that may get no monthly statement; "after launch" is undefined; and a reconciliation Claude closed alone counts (C2).
  - SM-2: file import alone satisfies it. If Mariana never talks to Claude and imports every statement in the app, SM-2 is green, so the metric named "Claude does the management" cannot tell whether the main feature works.
  - SM-3: a payment made but never recorded reads as missed, an automatic debit passes with or without the app, and there is no baseline from before the app.
  - SM-4: FR-33 does not say whether budgets carry from month to month; if they do, SM-4 is always true.
  - SM-C1: it counts corrections the owner makes, so an owner who stops checking produces a zero rate, green exactly when trust is most misplaced. It is also undefined whether an import match that rewrites a Claude entry's date and description counts as a correction. The PM note at line 714 hangs the write tools' future on this number.
  - SM-C2: nothing measures time in the app, and analytics were cut.
  - No FR computes any metric, and asking Claude to compute them from raw rows breaks A-1.
- **Fix:** One read tool and one settings line report SM-1 to SM-C1 from recorded data. Define the missing records: statement expected and received dates (H7), who entered and who confirmed a closing balance (C2), the budget carry rule, and what counts as a correction. Add a metric only the AI connection can move, for example the share of statement rows that matched a transaction Claude captured before the statement arrived. Base SM-C1 on owner-confirmed reconciliations, not on corrections alone.

### H10. The main interface rests on a third-party feature, with an open-ended promise and nothing that detects a break

- **Severity:** high
- **Location:** FR-50 (lines 723 to 724); addendum §3 and §3.3 (lines 47, 64 to 66); NFR-11 (line 846); NFR-12 (line 847); §1 (line 33); addendum §6 (line 152).
- **Failure scenario:** The AI connection depends on Claude's custom connector support, its authorization behavior, and protocol revisions on Anthropic's schedule; the addendum itself says the landscape moves monthly. FR-50 keeps the previous protocol working "until Claude supports the current one in every app", a promise with no end date, owned by someone else. When a client change breaks the connection, the app stays reachable, so the uptime monitor stays quiet and no job fails; the owner finds out at month end, statement in hand, when Claude reports a tool error. The cost line says no paid API, yet the interface needs a Claude plan with custom connectors and enough usage to read statements (30k to 46k input tokens per 10-page PDF, addendum line 152), while §1's reason to build is not paying for premium tiers.
- **Fix:** State the Claude plan and usage as an assumption with a check. Add a scheduled self-check that runs a scripted MCP client against the deployed endpoint (authorization metadata, connect, one read) and reports through NFR-11. Record a manual connect, read, and write in each acceptance app per release and after any Claude connector change. Bound FR-50 to the protocol versions the three apps use at release, re-verified monthly. State that every MVP journey has a path in the app's own screens when the connector is down.

### H11. Capability-gap prompts carry real figures and third-party text into a public repository's workflow

- **Severity:** high
- **Location:** §1 (line 31); FR-57 (lines 790 to 791); UJ-7 edge case (line 84); §7.1 (line 853).
- **Failure scenario:** Claude drafts a development prompt inside a conversation full of the owner's real balances, merchants, and statements, and the owner takes it to this public repository, where prompts become specs, stories, issues, and commits. Nothing tells Claude to write the prompt in the repository's privacy form, so real amounts and institution names ride along. The same conversation may hold third-party text from statements (H1), so the drafted prompt is untrusted input to a coding agent working in this repository.
- **Fix:** FR-57 gains a consequence: the server instructions tell Claude to draft development prompts with a fictional owner, made-up numbers, and account types instead of institutions or merchants, and to leave statement text out. The owner treats a drafted prompt as untrusted text and reviews it before it reaches a coding agent or a committed file.

### M1. Undo is per write, and nothing caps write volume

- **Severity:** medium
- **Location:** FR-55 (line 770); FR-54 (lines 753 to 761); FR-15 (lines 328 to 329); FR-49 (line 710).
- **Failure scenario:** An agentic client can call a write tool hundreds of times in one turn. A confused or steered session voids or recategorizes a month of transactions, and recovery is hundreds of single undos, or a restore that discards up to 24 hours of good writes and takes up to 4 hours. Nothing out of band reports the burst.
- **Fix:** Undo by connected client and time range as one reviewed action. A per-client write cap per hour and per day, beyond which writes are refused and an alert fires. Claude write counts in the alert list and the weekly digest (H1).

### M2. The fix-first order contradicts the replace leaning and FR-15's own scope

- **Severity:** medium
- **Location:** §5.1 description (line 204); §10 items 1, 6, and 7 (lines 920, 925, 926); FR-15 (line 332); FR-16 (line 344); FR-58 and FR-60 (lines 799 to 819).
- **Failure scenario:** §5.1 leans toward replacing broken screens with redesigned ones, but §10 puts fix-first before any new feature and the UX step before any redesigned screen, and both the redesigned screens (FR-60) and contract adoption (FR-58, which depends on a change in cuatro-portfolio) are new features. Leaning replace makes the fix-first gate, and so the first deploy, wait on the UX step, the contract, and another repository; patching means building those screens twice. FR-15, inside the same gate, exports budgets, goals, recurring events, subscriptions, and the audit log, records that later features create, yet every §5.1 FR must pass before the first deploy (line 344).
- **Fix:** Choose patch for the fix-first screens (the short path to Release 1), or move FR-58 and the named screens into the fix-first scope on purpose. Restate FR-15's export as every record type that exists, with each later feature extending it.

### M3. NFR-6 can block every deploy while the public app runs a known advisory

- **Severity:** medium
- **Location:** NFR-6 (line 841); FR-8 (line 269); memlog line 62.
- **Failure scenario:** A high or critical advisory lands in a production dependency, and the fixed release is a day old. The first clause blocks every deploy and the second blocks the fix for 7 days. For that week the internet-facing app runs the vulnerable version, and an unrelated urgent fix cannot ship either. The memlog wording ("no push") is stricter than the PRD's ("no deploy"), and on a single branch with direct pushes the difference matters.
- **Fix:** A release that fixes a listed advisory may be adopted before 7 days, after a review of its changes; the delay binds everything else. Say what happens to the running deployment while an advisory is open (accept, mitigate, or take the connector offline), and settle "push" against "deploy".

### M4. The operating burden falls on one person, and part of the stack has no owner in the requirements

- **Severity:** medium
- **Location:** SM-C2 (line 945); NFR-5, NFR-6, NFR-11, NFR-12 (lines 840, 841, 846, 847); UJ-1 (line 57); addendum §3 (line 47).
- **Failure scenario:** The thesis says Claude does the work; the recurring work is the owner's: a statement per account per month (eight accounts in the fictional set), the weekly review queue, the monthly budget reset, restore results and failed jobs, advisory triage under NFR-6, connector and protocol changes, and the host. The host operating system, the container images, the database, and the proxy fall under no requirement, since NFR-6 names only the app's production dependencies. Nothing says what happens when the owner is away for a month: the 30-day rule (NFR-5) drops every client, and statements pile up.
- **Fix:** State an operating budget (minutes per week and per month) and treat exceeding it as a counter-metric beside SM-C2. Require automatic security updates for the host and a regular image rebuild. Add an away rule: nothing breaks while the owner pauses, and import catches up a backlog of statements.

### M5. Recovery has single points the PRD never drills

- **Severity:** medium
- **Location:** FR-15 (lines 328 to 331); FR-63 (lines 359 to 360); §10 item 2 (line 921).
- **Failure scenario:** Data recovery is drilled monthly; access recovery is a README procedure that nothing ever runs, though §10 names a TOTP lockout during the auth upgrade as a known risk. The off-server copy is written by the server, and nothing requires that the server's credential cannot delete or overwrite it, so a broken or compromised server can take its own backups with it. FR-15 suggests holding restore keys in a password manager; if one store also held the app password and the TOTP seed, it would hold the data, the access, and the second factor.
- **Fix:** Drill FR-63's server-side path before U2 and yearly, recorded like the restore check. The server's backup credential can write but not delete, with retention enforced by the storage. The TOTP seed and backup codes stay out of the store that holds the password and the restore keys.

### M6. The alert channel can fail silently, and SM-3 rests on it

- **Severity:** medium
- **Location:** FR-48 (lines 700 to 703); NFR-11 (line 846); SM-3 (line 940); addendum §3.5 (line 80).
- **Failure scenario:** Payment reminders travel through a free-tier sender. A suspended account, a DNS change, or a spam filter ends them without a trace, because NFR-11's failed jobs list rates, prices, snapshots, backups, and scans, not sends. The owner learns from a late charge.
- **Fix:** Alert sending is a job whose failures show in the app with the provider's delivery status. A monthly test alert the owner acknowledges in the app. The dashboard shows when the last alert was delivered.

### L1. The Claude half of each journey has no acceptance method

- **Severity:** low
- **Location:** NFR-10 (line 845); FR-50 (line 723); UJ-3 and UJ-4 (lines 68, 72); addendum §3.7 (line 99).
- **Failure scenario:** NFR-10 wants one end-to-end check per journey, and addendum §3.7 plans Playwright with a test authenticator, which drives the app but cannot drive Claude. Sentences such as "Claude shows her" and "quoting only the app's figures" end up either silently untested or unfulfillable, and FR-50's three-app acceptance has no stated method.
- **Fix:** The end-to-end check drives the AI connection with a scripted MCP client for the tool half. The Claude half gets a recorded manual acceptance per app per release, like the accessibility pass. The journeys mark which sentences describe Claude behavior the app cannot guarantee.

## What holds up

- The money layer is the only place arithmetic happens: minor units, one rounding point, half-even, and a lint rule to enforce it (FR-19, NFR-1).
- Rate handling is careful: one TRM per date, a locked rate that changes only through an audited correction, a pending rate instead of a stale one, and fetched values checked before they are stored (R-2, FR-20).
- Amounts and dates reach the write tools as text with a declared format and come back as stored values; ambiguous text is rejected (FR-54, FR-11).
- Voids instead of deletions, before and after values for writes from every source, and undo that warns about dependent records (FR-25, FR-55, A-10).
- One staging path for Claude rows and file imports, with every skipped, flagged, and matched row shown before anything posts (FR-28, FR-54).
- Hard limits on Claude: no account deletion or archive, no sign-in, TOTP, client, or alert changes, and a new-client alert that cannot be turned off (FR-54, FR-48).
- Minimum payments are always scheduled, and the cash buffer limits only the extra (FR-39).
- Backups and a passing restore before the auth migration, a stated RPO and RTO, restore keys off the server, and a full export (FR-15, §10 item 2).
- No LLM call from the app, so no stored model key and no second data path (decision 4).
- The cuts are disciplined: bank sync, the solver, n8n, Telegram, analytics, the demo, and tax features each wait for a stated reason with a revisit trigger (§9.2).
- Capability gaps build nothing: honest tool descriptions and a drafted prompt (FR-57).
- Alert emails carry no figures (FR-48, NFR-7).
- The app's own screens cover capture, import, reconciliation, and planning, so a connector outage degrades the product instead of stopping it (FR-60).
- The release order note already names the right first slice (line 929); it needs to become binding, not new thinking.
- The document keeps its own privacy rules: a fictional owner, generic formats, and institution names held in a git-excluded note (§7.1).
