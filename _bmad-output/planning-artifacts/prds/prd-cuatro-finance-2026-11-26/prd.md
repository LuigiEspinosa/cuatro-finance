---
title: Cuatro Finance
status: final
created: 2026-11-26
updated: 2026-11-26
---

# PRD: Cuatro Finance

## 0. Document Purpose

This PRD redefines the feature set of Cuatro Finance, a brownfield personal finance app, and captures its redesign on the Cuatro design contract as a requirement. It is written for the owner and for the BMAD steps that build from it: UX (`bmad-ux`), architecture (`bmad-architecture`), and epics and stories. Those steps use the terms in §3 exactly as defined there.

Features (§5) group the functional requirements, numbered FR-1 to FR-65 across the whole document. IDs are stable, so they sit out of numeric order where they were added later: FR-63 (added during reconciliation) and FR-64 (added at the reviewer gate) in §5.1, and FR-65 (added at the reviewer gate) in §5.11. Every FR carries one brownfield tag, drawn from sections 4 to 6 of the re-entry assessment:

- **built**: exists and works today.
- **built but broken**: exists, with defects this PRD requires fixed.
- **new**: not built, or present only as schema or scaffold.
- **baseline**: a security requirement, stated only as the required behavior with a pointer to the assessment section.

Cross-cutting NFRs (§6), constraints (§7), non-goals (§8), MVP scope (§9), sequencing (§10), success metrics (§11), open questions (§12), and an assumptions index (§13) follow. The MVP ships in two releases: Release 1, the working ledger, whose first deploy is launch; and Release 2, the planning features, after a go/no-go point. §9.3 assigns every FR to a release, and §10 sets the binding sequence. Assumptions carry an ID (A-n) where they appear, and §13 indexes them; the owner confirmed A-1 to A-10 on 2026-11-26, and confirmed A-11 to A-15, added at the reviewer gate, as defaults that the epic building each one revisits.

Inputs: the re-entry assessment of 2026-11-25 (local, git-excluded), `_bmad-output/implementation-artifacts/deferred-work.md`, and the original 12-phase plan (private). A pointer such as "assessment §5" names a section of the assessment. Positional IDs such as S8-25 (the 25th line of assessment §8) or F7.1-08 (the 8th finding of assessment §7.1), and numbered pointers such as decision 3 or deferred item 7, are keyed in `addendum.md` §1. The addendum also holds the technical choices, the upgrade plan, the deferred maintenance list, rejected alternatives, and notes for the UX step.

Journeys and examples use a fictional owner, Mariana, with made-up numbers. Amounts are written in the app's es-CO format: a period for thousands and a comma for decimals.

## 1. Vision

Cuatro Finance is a personal finance ledger for Colombian finances whose main interface is an AI assistant. The owner talks to Claude the way they would talk to a personal accountant: they report what they spent today and from which account, they ask how their debt looks once a new card statement arrives and whether they can afford more than the minimum payment, or they ask for a savings plan toward something they want to buy. Claude answers and acts through the app's AI connection. It reads the owner's data and also manages it, and the app stays the single source of truth: every change Claude makes is recorded and visible there.

The division of labor is deliberate. The app does the bookkeeping and the arithmetic: amounts are stored exactly, each exchange rate is locked to its date, and the figures that advice depends on (debt payoff schedules, cash flow, budget status, goal progress) come from the same money layer that stores them. Claude does the conversation and the reasoning on top of those figures: the app guarantees every figure its tools return, and asks Claude to cite those figures rather than compute its own (A-1).

Capture cannot rely on bank sync, which no provider serves to a personal app affordably for Colombian accounts today, so data comes in through the owner: told to Claude, imported from statement files, or entered in the app. When the owner asks for something the app cannot do yet, Claude says so and drafts a development prompt the owner can take to this repository, written generically because the repository is public (FR-57), so the product grows from real needs instead of a roadmap.

Why it matters: the owner needs a specific combination of features that no single existing app offers without stitching several apps together or paying for premium tiers. Building it means the feature set follows one person's needs and grows with them. The one paid service it relies on is the Claude plan the owner already uses (A-15). Desktop comes first; a phone surface may follow once the desktop version works. The interface is redesigned on the Cuatro design contract, so it reads as part of the Cuatro ecosystem.

## 2. Target User

There is one user: the owner. They manage Colombian personal finances across savings accounts in COP and USD, credit cards with cuotas, a mortgage, other loans, and crypto. They use Claude daily and work mostly at a desktop.

### 2.1 Jobs To Be Done

- When I spend money, I want to tell Claude in a sentence and have it recorded correctly, so the ledger stays current without data entry.
- When a card statement arrives, I want to know how my debt stands and whether I can pay more than the minimum, so I pay debt down without risking a short month.
- When I want to buy something, I want a savings plan that fits my real cash flow, so I get there without breaking my budget.
- At the end of a month, I want to see how my budget went and set a better split, so money goes where I intend.
- I want every number to be trustworthy: exact amounts, locked rates, and a record of every change Claude made that I can undo.
- I want one place that covers my Colombian accounts without stitching apps together or paying for premium tiers.
- When the app cannot do something I need, I want Claude to say so and draft the prompt to build it.

### 2.2 Non-Users (v1)

- Anyone besides the owner: no family members, advisors, or shared access, and no sign-up.
- Demo visitors and recruiters: the public demo is deferred (decision 1).
- Phone-first use of the app itself: the phone surface comes later. On the go, the owner reaches the data through Claude's own apps where they support custom connectors (Open Question 2).

### 2.3 Key User Journeys

Mariana is fictional, and so is every detail and number below. She is 34, a UX researcher in Bogotá, and stands in for the owner. Her accounts: a COP savings account, a savings pocket she keeps as a second COP savings account, a USD savings account, two credit cards with cuotas (one with a linked USD card account), a car loan, a mortgage, and a crypto account holding one crypto asset. The journeys show the whole MVP; §9.3 says which release ships each step.

- **UJ-1. Mariana sets up her accounts on a Sunday afternoon.**
  On her laptop she signs in with her password and TOTP code; the dashboard is empty and points her to accounts. She adds each account with its opening balance and date, and marks which ones receive statements. For each card she enters the statement cut day, payment due day, EA rate, the savings account that pays it, and the cuota purchases still running on her last statement, each with its original amount, cuota count, and cuotas already billed; these purchases leave the opening balance as it is. For the car loan and the mortgage she enters the EA rate, installment, payment due day, remaining term, extra payment rule, and paying account. Her crypto account holds 0,0125 units of a crypto asset bought for COP 4.100.000. She sets a cash buffer of COP 1.500.000 on her main COP savings account. The dashboard now shows her net worth with the dates of the TRM and the crypto price it used. **Edge case:** she types a card's rate as "24,0"; the app stores 24,0 percent EA and shows the monthly equivalent, 1,81 percent, beside it, so a monthly rate typed as EA would stand out at once.
  Capabilities: FR-1, FR-18, FR-21, FR-22, FR-36, FR-37, FR-43, FR-45.

- **UJ-2. Mariana connects Claude.**
  In claude.ai she adds a custom connector with her Cuatro Finance address. The app's sign-in opens; she enters her password and TOTP code, and the consent screen names the client, claude.ai web, before she grants read and write. Back in Claude she asks for her net worth, and Claude answers with the app's figure and its rate date. Minutes later an email names the new client; the connected-clients page lists claude.ai web with both scopes, today's date, and the date each scope's grant lapses. **Edge case:** that evening she connects Claude Code on her laptop; its sign-in returns through a local redirect on a random port, and it still connects.
  Capabilities: FR-1, FR-48, FR-50, FR-51, FR-52.

- **UJ-3. Mariana tells Claude about her day.**
  After dinner, in Claude Desktop, she writes: "Today I paid 48.000 for lunch from my savings account, and my music subscription charged USD 6,99 to my dollar account." Claude records both through the AI connection: the lunch on her COP savings account, dated today in Bogotá and filed under Restaurantes by her rules; the subscription on her USD savings account at its locked rate, where it fulfils this month's occurrence of the subscription's recurring expense event. Each record call finds no likely duplicate, so it stores the transaction and echoes it, and Claude shows her the echo. Claude adds that Restaurantes is at 82 percent of this month's budget, a figure from the app. Both transactions sit in the feed with source Claude, each undoable. **Edge case:** when she adds "and 35.000 for a taxi on my card", Claude asks which of her two cards before recording; a record call naming only "my card" would store nothing and return both cards.
  Capabilities: FR-20, FR-24, FR-31, FR-33, FR-41, FR-54, FR-55, FR-56.

- **UJ-4. Mariana's card statement arrives and she asks how far she can go.**
  The card offers no spreadsheet export, so she unlocks the statement PDF, drops it into Claude Desktop, and asks: "How bad is my debt, and should I pay just the minimum or can we afford more?" Claude reads the statement and stages its 23 rows: 9 match transactions she had told Claude about, 2 are later cuotas of purchases already in the ledger and link to them, 1 is a near duplicate, and 11 are new, including a laptop stand bought in 6 cuotas. She says go ahead; Claude confirms the import and enters the statement's closing balance, minimum payment, and payment due date. The closing balance equals the cleared balance, and the reconciliation waits in the review queue until she confirms that closing balance with one tap in the app. Claude then asks the app for her debts and this month's payment plan: COP 23.400.000 of debt across both cards, the car loan, and the mortgage, with COP 1.960.000 of minimum payments due. It compares avalanche and snowball, which both put the extra on the card first, and runs two payment scenarios for the card: the minimum, or the minimum plus COP 300.000 a month, which the scenario reports as paying the card off 7 months sooner with COP 640.000 less interest while the paying account's lowest balance stays above its cash buffer. Claude recommends the extra 300.000, quoting the figures and the provenance line the compute response returned. She agrees; Claude saves it as her monthly extra, paid from her main COP savings account, and the payment plan and forecast update. **Edge case:** if the extra would take the paying account below its cash buffer on any of the next 90 days, the scenario says so and Claude proposes a smaller amount.
  Capabilities: FR-27, FR-28, FR-29, FR-32, FR-36, FR-38, FR-39, FR-40, FR-43, FR-44, FR-53, FR-54, FR-65.

- **UJ-5. Mariana imports her bank's export in the app.**
  At her desk she downloads the month's XLS export of her COP savings account and opens import. The first time, she maps the date, description, and amount columns, the sign convention, the header lines to skip, and the number format; the app saves the column mapping for this account. The preview shows 41 rows: 6 duplicates listed and skipped, 2 near duplicates for review, 3 matches to transactions Claude had recorded, 1 row that links as the savings side of a payment already on her card, and 29 new rows. She confirms: 30 rows post with source import (the 29 new rows and the transfer side), the 3 matched transactions become cleared, and the 2 near duplicates wait in the review queue. **Edge case:** one row inside the mapped table holds an amount the format cannot read; the app rejects the file, names the row and the reason, and posts nothing.
  Capabilities: FR-26, FR-27, FR-28, FR-32.

- **UJ-6. Mariana reviews the week and undoes a mistake.**
  On Sunday the dashboard shows 4 items in the review queue. She files one uncategorized transaction and accepts the app's offer to save a rule, keeps one of a near duplicate pair, confirms a match, and links an unmatched transfer candidate to her USD account. Then she filters the feed to source Claude for this week and finds a taxi recorded on the wrong card. She undoes it from the audit log, after the app lists the record the undo will change, and records it herself on the right card. The queue is empty and both cards reconcile. **Edge case:** undoing a transaction that a later import matched warns that the matched statement row will post as a new transaction, and applies only after she confirms.
  Capabilities: FR-11, FR-24, FR-25, FR-26, FR-28, FR-29, FR-31, FR-32, FR-45, FR-55.

- **UJ-7. Mariana resets the month's budget split with Claude.**
  On the 1st, once last month has closed, she asks Claude how her budget went and how to split the new month. Claude reads six months of budget history: Domicilios over its limit in 4 of 6 months, Ropa under in 5. It proposes moving COP 120.000 from Ropa to Domicilios and holding Restaurantes. She agrees, and Claude writes this month's budgets. **Edge case:** she asks for a weekly budget for Mercado. Claude explains that budgets are monthly in this version and drafts a development prompt for weekly budgets, written generically with a fictional owner and no figures from her ledger, which she reviews before taking it to the repository.
  Capabilities: FR-33, FR-34, FR-53, FR-54, FR-57.

- **UJ-8. Mariana plans a laptop upgrade.**
  She tells Claude she wants a new laptop in about 8 months, around COP 6.000.000. Claude asks the app for her income events, recurring expense events, minimum payments, budgets, and forecast, then for a goal plan: COP 750.000 a month reaches the target on time. She asks whether to keep the money in her savings pocket or buy USD each month. Claude talks it through in qualitative terms, says the comparison is not from the app because no tool computes it, and names any figure she offers as hers, not the app's. She picks the pocket. Claude creates the goal "Portátil nuevo" with a monthly contribution from her main COP savings account into the pocket. The goal shows on track, and its contributions appear in the forecast. **Edge case:** in the month a yearly insurance payment lands, the contribution would break her cash buffer; the goal plan flags that month, and with her agreement Claude lowers that month's contribution and raises the two months around it, each a change to one occurrence.
  Capabilities: FR-35, FR-41, FR-43, FR-44, FR-52, FR-53, FR-54.

## 3. Glossary

Downstream workflows and readers use these terms exactly. No other section introduces a synonym.

**People and AI**

- **Owner**: the one person who uses Cuatro Finance and holds its only account. Journeys use a fictional owner, Mariana.
- **Claude**: the owner's AI assistant, reaching the app through the AI connection. In this PRD, Claude means any connected client; acceptance covers claude.ai web, Claude Desktop, and Claude Code.
- **AI connection**: the app's MCP server, through which Claude reads, computes, and writes. One per deployment.
- **Connected client**: a Claude app the owner has authorized on the AI connection. It holds a grant with read scope, or read and write scope. Only claude.ai web, Claude Desktop, and Claude Code can connect (FR-51).
- **Grant**: a connected client's authorization: its scopes, issued through a sign-in that completed TOTP, each scope with an absolute lifetime (NFR-5). Short-lived access tokens are issued under it.
- **Scope**: a permission a connected client holds: read, or write. Write scope always comes with read scope.
- **Tool**: one operation the AI connection exposes. Tools come in three families: read, compute, and write.
- **Audit log**: the record of every tool call (client, tool, time, inputs) and of every write from any source (with before and after values).
- **Provenance**: who entered a record (the owner in the app, Claude through a named connected client, or an import) and, for a Claude-entered input, whether the owner has confirmed it (FR-65).
- **Provenance line**: the short line a compute response carries for Claude to quote: the figure's source, the money layer, and the dates of the rates and prices it used (FR-53).
- **Statement text**: text a third party wrote that the ledger stores, such as a merchant descriptor, a transfer description, or a file's contents. It is data, never an instruction (§7.2).
- **Void**: a reversible cancellation. A voided record stays in history but no longer counts, and takes no part in matching.
- **Undo**: reverting one logged write call as a unit (FR-55).
- **Capability gap**: a request that no tool covers.

**Accounts and money**

- **Account**: a place the owner's money is held or owed, with one currency; a crypto account holds one crypto asset. MVP types: savings account (COP or USD), credit card, loan, mortgage, crypto account. A card's USD charges live on a linked USD card account. Each account marks whether it receives statements.
- **Linked USD card account**: a credit card account in USD, linked to a COP card and sharing its statement cut day and payment due day (R-4).
- **Asset account**: a savings account or a crypto account.
- **Liability account**: a credit card, a loan, or a mortgage.
- **Debt**: the amount owed on a liability account, derived from its starting debt and its transactions, never stored or written directly (FR-37).
- **Account terms**: the settings of a liability that computations read: its EA rate, statement cut day, payment due day and its business-day shift, installment and the fixed charges inside it, remaining term, interest terms (R-5), amortization method, day-count rule, extra payment rule, and paying account (FR-36, FR-37).
- **Paying account**: the asset account that pays a liability, or that pays the monthly extra (FR-39).
- **Masked account number**: the last four digits of an account number, the only part the app stores.
- **Money layer**: the module that parses, stores, converts, and computes every amount. It is the only place arithmetic on money happens.
- **Minor units**: integer centavos for COP and cents for USD.
- **Crypto quantity**: an amount of a crypto asset at that asset's own precision.
- **TRM**: Colombia's official COP per USD rate. Each calendar date has exactly one TRM in force; the latest TRM is the one in force on today's Bogotá date (R-2).
- **Locked rate**: the TRM in force on a transaction's date, stored with the transaction and never recomputed except under R-2.
- **EA rate**: an effective annual interest rate, the basis of every interest rate in the app.
- **UVR**: the inflation-indexed unit some Colombian mortgages are denominated in. It applies only under FR-23.
- **Cuota purchase**: a credit card purchase repaid in a fixed number of monthly installments (cuotas) at its own EA rate, the card's by default. It counts once, in full, as spending in its purchase month; each later cuota's interest posts as interest spending (FR-36).
- **Reversal**: a credit marked as reversing an earlier purchase. It ends the purchase's remaining cuotas and lowers its category's spending in the purchase's month, never counting as income (FR-36).
- **Amortization method**: how a schedule divides principal: equal principal (the default) or level installment (FR-36, FR-37).
- **Installment schedule**: the principal and interest (and, for a loan, the fixed charges) of each cuota of a cuota purchase or each installment of a loan or mortgage, computed by the amortization method or entered from the lender's statement.
- **Statement**: an institution's periodic document for one account. A card statement shows the statement cut day, the payment due date, the minimum payment, and the cuota purchases.
- **Statement period**: the days a statement covers: from the day after the previous statement's closing date (for the first, the day after the opening date) through its own closing date.
- **Statement cut day**: the day a card's billing period closes (fecha de corte).
- **Payment due day**: the day of the month a card's or a loan's payment falls due. Each month's payment due date derives from it, unless a statement prints the date; a derived date on a weekend or holiday moves by the shift in the account terms, to the previous business day by default.
- **Payment due date**: the last day to pay a card or an installment without late charges (fecha límite de pago): the date a statement prints, or else the one derived from the payment due day.
- **Minimum payment**: the least the owner must pay by the payment due date: the statement's figure, or between statements an estimate (R-6).
- **Extra payment rule**: a setting on a liability saying whether a payment above what is due shortens the remaining term (or the cuotas) or lowers the installment (or the cuota).

**Transactions and capture**

- **Transaction**: a dated movement on one account, with an amount, a direction, a category, a source, and optional notes. A debit takes money out of an asset account or raises a liability account's debt; a credit does the opposite.
- **Source**: how a transaction entered the ledger: Claude, import, or manual.
- **Ledger**: all of the owner's accounts and transactions.
- **Adjustment**: a transaction, with a reason shown in the feed and in reconciliation, that changes what was set once at creation: an opening balance, an opening date, or a starting debt (FR-18).
- **Transfer**: a linked pair of transactions moving money between two of the owner's accounts, such as a card payment, a loan payment, or a COP to USD conversion. A transfer never counts as spending or income; the interest and charges inside a loan or mortgage payment post separately as spending, and across currencies the spread against the TRM shows only as an informational line (FR-26). A cash withdrawal is not a transfer: it posts as spending under the seeded cash category, Efectivo (FR-30).
- **Statement file**: a file the owner imports for one account: a statement or an account export in XLS, CSV, or OFX, or a PDF statement that Claude reads.
- **Import**: bringing a statement file's rows into the ledger through staging.
- **Staged row**: an imported row that is parsed and checked but not yet posted. Each gets one class: duplicate, match, near duplicate, or new, tested in that order (FR-28).
- **Column mapping**: the saved description of one account's statement file format: which columns hold the date, the description, and the amount (or separate debit and credit columns, and any cuota count and cuota number columns), the sign convention, the lines to skip above and below the table, and the number and date formats.
- **Description key**: a description lowercased, with accents removed and runs of spaces collapsed to one.
- **Duplicate**: a staged row with the same account, date, amount, and description key as a transaction a statement row has already confirmed. It is skipped and listed.
- **Match**: a staged row paired, one to one, with a transaction on the same account that no statement row has confirmed, whatever its source, with the same amount and a date inside the match window (A-5); a Claude capture close in amount is offered as a match for review (FR-28). Confirming it keeps one transaction, now cleared.
- **Near duplicate**: a staged row with the same account, date, and amount as a transaction a statement row has already confirmed, but a different description key. It is flagged for review.
- **Cleared**: said of a transaction a statement row has confirmed, by a match or by posting from that row. The cleared balance counts only cleared transactions.
- **Reconciliation**: comparing a statement's closing balance with the account's cleared balance at the statement's closing date; uncleared transactions in the statement period show as pending, not as a difference (FR-29).
- **Current through date**: the closing date of an account's last reconciled statement, shown beside the date of the newest transaction Claude or the owner captured on it (FR-45).
- **Review queue**: the items waiting for the owner's decision, listed with their resolutions in FR-32: uncategorized transactions, near duplicates, matches to confirm, unmatched Claude captures, unmatched transfer candidates, Claude-entered account terms and closing balances, expected statements, re-locked rates, and, from Release 2, occurrences to fulfil or to confirm as missed.
- **Category**: a label for spending or income.
- **Rule**: a stored pattern that assigns a category to matching transactions.

**Planning**

- **Budget**: a monthly spending limit for one category. A limit carries forward to later months until changed.
- **Threshold**: the percentage of a budget's limit at which an alert fires, 80 percent by default.
- **Budget history**: each closed month's frozen limit and its actual spending per category, which always reflects the ledger (FR-34).
- **Goal**: a target amount by a target date, funded by contributions into a funding account.
- **Goal plan**: the compute result for a goal: the monthly contribution needed, whether planned contributions keep it on track, and any month where a contribution would take the account it comes from below its cash buffer (FR-35).
- **Sinking fund**: a goal that repeats over a set interval, carrying its remainder into the next cycle (FR-35).
- **Contribution**: a transfer into a goal's funding account that fulfils a planned contribution, or that the owner marks as funding the goal.
- **Recurring event**: a scheduled income or expense with a direction, an amount, an account, a start date, an optional end date, a frequency, and a business-day shift (FR-41).
- **Planned event**: a one-off scheduled income or expense with an amount, an account, and a date.
- **Occurrence**: one dated instance of a recurring event, or a planned event. It stays open until a posted transaction fulfils it, and is missed if its date passes unfulfilled (FR-41).
- **Income event**: a recurring event that is income.
- **Recurring expense event**: a recurring event that is an expense.
- **Business-day shift**: moving a recurring event that falls on a weekend or a Colombian public holiday to the previous or next business day, chosen per event.
- **Subscription**: a recurring expense event for a recurring charge, such as a service or a membership, with its merchant, amount, and currency. The owner or Claude adds one; detection (FR-42) is gated.
- **Cash buffer**: the minimum balance the owner sets for an asset account, zero when unset. The payment plan schedules the monthly extra only as far as the paying account stays at or above it (FR-39), and the forecast marks every day an account is below it and names the first (FR-44).
- **Shortfall**: a projected balance below zero on a payment date, flagged apart from a cash buffer breach (FR-39).
- **Payment plan**: the month's schedule of debt payments: every minimum payment first, then the monthly extra by the payoff method, with any part of the extra that the cash buffer holds back listed apart.
- **Payoff method**: avalanche (the monthly extra goes to the highest EA rate first) or snowball (to the smallest debt first).
- **Monthly extra**: the amount above the minimum payments that the owner commits to debt each month, paid from a named paying account.
- **Payment scenario**: a comparison of the minimum payment with paying more, as a monthly extra or a one-off amount.
- **Forecast**: the projected daily balance per account and in total for the next 90 days (FR-44). Card spending reaches cash only through the card's projected payments.
- **Confidence level**: how firm a forecast figure is: high for known fixed amounts (recurring events with fixed amounts, planned events, installments, statement minimum payments, the monthly extra), medium for variable spending (the higher of a category's budget and its 3-month average) and estimated minimum payments (R-6), low for irregular spending (12-month averages), and unestimated for a category the ledger is too new to project, a state apart from low (FR-44). A day's confidence is the lowest level of any input feeding that account's balance from today through that day.
- **Net worth**: assets minus debts in COP, with USD at the latest TRM and crypto at the latest price.
- **Balance snapshot**: an account's balance and COP value for one day, reflecting every write dated on or before it at that day's TRM and price (FR-46).

**Platform and design**

- **Dashboard**: the landing screen after sign-in.
- **Alert**: a time-sensitive notice sent by email and kept in the alert list.
- **Alert list**: the app's record of every alert, plus a daily count of Claude's writes by type (FR-48).
- **Weekly digest**: an optional weekly email that points the owner to the app.
- **Job runner**: the service that runs the scheduled jobs: rates, prices, balance snapshots, backups, restore checks, alert sends, and the AI connection self-check (NFR-11).
- **Release 1**: the working ledger, the first part of the MVP to ship (§9.3).
- **Launch**: Release 1's first deploy. It starts the success clock (§11).
- **Go/no-go point**: the check that opens Release 2: one statement cycle reconciled on every account that receives statements (§10).
- **Release 2**: the planning features, which ship after the go/no-go point (§9.3).
- **Gated**: in the MVP's scope, but started only when a stated trigger is met (§9.3).
- **Cuatro design contract**: the design tokens, fonts, and rules published by cuatro-portfolio.
- **Contract floor**: the minimum every screen meets under the Cuatro design contract, listed in NFR-3. The floor checks are the contract's automated checks of it.
- **Anchor**: cuatro-portfolio, the repository that publishes the Cuatro design contract.
- **Satellite**: an independent repository that consumes the Cuatro design contract. Cuatro Finance is one.
- **Token role**: a named contract value (`--token-*`) that the UI uses instead of a raw colour.
- **Fix-first scope**: the baseline and defect work in §5.1 that precedes any new feature (decision 8).
- **Brownfield tag**: one of built, built but broken, new, or baseline, as defined in §0.

## 4. Colombian Money Rules

Product rules the features rely on. FRs cite them as R-n.

- **R-1** COP is the primary currency. Amounts render in es-CO conventions; COP shows no decimals. A USD amount always carries the code USD, never a bare "$". Dates render day, month, year. Text input parses under R-13.
- **R-2** Each calendar date has exactly one TRM in force: the published rate whose validity covers that date. The latest TRM is the one in force on today's Bogotá date, and a balance snapshot uses the TRM in force on its own date. A USD transaction keeps the TRM of its date as its locked rate; current balances convert at the latest TRM. Correcting a USD transaction's date or amount re-locks it at the TRM of the corrected date, and the official TRM replacing a manual one re-locks every transaction that used the manual one (FR-20). Each re-lock is an audited write; nothing else changes a locked rate.
- **R-3** Every interest rate is an EA rate. The monthly rate is (1 + EA) raised to the power 1/12, minus 1.
- **R-4** A credit card has a statement cut day and a payment due day each month. Every purchase is a cuota purchase of 1 or more cuotas; one in more than 1 cuota carries an installment schedule at its own EA rate, the card's by default. A card's USD charges live on a linked USD card account that shares the card's statement cut day and payment due day (A-3); paying it from a COP account is a conversion transfer (FR-26).
- **R-5** How a card charges interest (for example, on a 1-cuota purchase paid in full by the payment due date), its amortization method, its day-count rule for a partial first period, and how a payment above the minimum spreads across its balances come from the card's statement terms, entered per card, never from a hard-coded rule (A-4).
- **R-6** A card's minimum payment is the figure its statement states, entered with the statement (FR-29), at high confidence. Between statements, the app shows an estimate, labeled as an estimate at medium confidence: the 1-cuota purchases dated up to the next statement cut day in full, plus the next cuota of each deferred purchase, plus the card's known recurring charges and any unpaid amount.
- **R-7** Loans and the mortgage carry a fixed EA rate the owner enters (A-2). Loans indexed to DTF or IBR plus a spread are out of the MVP; DTF stops being the credit reference rate on 2027-01-01 (F7.1-08).
- **R-8** A UVR mortgage (only under FR-23) holds its balance in UVR units with 6 decimal places. Its COP value is the units times the day's UVR.
- **R-9** Dates are Bogotá calendar dates (America/Bogota). Colombian public holidays include the Monday moves. Holiday data is updatable, and the owner can add or remove a holiday, because the 2026 holiday law is under legal challenge (F7.2-12).
- **R-10** Bre-B instant payments to people and shops look like transfers. A movement is a transfer only when both sides are the owner's accounts (F7.1-07).
- **R-11** GMF (4x1000) charges are filed under their own category. Exemption tracking waits for the tax features (decision 6).
- **R-12** The rules for the deferred tax features live in `addendum.md` §6.
- **R-13** Amount and date text parses one way, and the cases below are its test. Under es-CO, a comma marks decimals, and periods, which are optional, group thousands: when present, the first group has one to three digits and every later group exactly three. Text with more decimals than the currency's minor unit or the crypto asset's precision, or with a group that breaks that pattern, is rejected with the reason, never rounded. The apostrophe millions separator is rejected on purpose. A date is declared as yyyy-mm-dd or dd/mm/yyyy; an impossible date is rejected; "today", "yesterday", and a timestamp with a time zone resolve to the Bogotá date.

| Text | Declared as | Result |
|---|---|---|
| 48.000 | COP | 48.000 |
| 48000 | COP | 48.000 |
| 1.500.000,50 | COP | 1.500.000,50, stored in centavos |
| 1.500.000,555 | COP | rejected: more decimals than COP's centavos |
| 1.50.000 | COP | rejected: a group is not three digits |
| 1'500.000 | COP | rejected: the apostrophe separator is not accepted |
| 6,99 | USD | 6,99 |
| 6.99 | USD | rejected: a group is not three digits, and a period never marks decimals |
| 0,00012 | an asset held to 8 decimal places | 0,00012 |
| 0,000000001 | an asset held to 8 decimal places | rejected: more decimals than the asset allows |
| 31/12/2026 | dd/mm/yyyy | 2026-12-31 |
| 2026-02-30 | yyyy-mm-dd | rejected: no such date |
| yesterday | relative date | the Bogotá date before today |
| 2026-11-26 03:00 UTC | timestamp | 2026-11-25, the Bogotá date |

## 5. Features

### 5.1 Trustworthy baseline (fix-first scope)

**Description:** Before any new feature, the shipped core meets the security baseline, its defects are fixed, and it is ready for a first deploy (decision 8). This feature holds the security requirements (baseline), the defects in what exists (built but broken), and what a first deploy needs (new). Every defect fix ships with a regression test (NFR-10). Where a defect sits in a screen the redesign rebuilds (§5.12), the requirement is the behavior; whether the old screen is patched or replaced is an epics decision, leaning toward replacement. Realizes UJ-1, UJ-2, UJ-6.

**Functional Requirements:**

#### FR-1: Sign-in with password and TOTP [built]

The owner can sign in with email, password, and a TOTP code, set up TOTP from a QR code, and use a backup code when the authenticator is unavailable. (assessment §5)

**Consequences (testable):**
- TOTP setup shows a QR code and activates only after the owner enters one valid code.
- Backup codes are shown once at setup, and each works once.
- A wrong TOTP code, or a backup code already used, leaves TOTP incomplete, so no screen or API route opens (FR-2).
- The redesigned sign-in and TOTP screens (FR-60) keep this behavior.

#### FR-2: Single-owner access [baseline]

The app has exactly one account, the owner's, and every request needs the owner's session with TOTP completed or, for a tool call, a valid grant. (assessment §4, §6)

**Consequences (testable):**
- Self sign-up is unavailable in every environment; an attempt to create a second account fails.
- Every screen and every API route rejects a request whose session has not completed TOTP (NFR-4).
- Every tool call is rejected unless it carries an unrevoked grant with the scope it needs, issued through a sign-in that completed TOTP and still inside its lifetime (NFR-5), with short-lived access tokens under it (A-13).
- The owner account is created through a provisioning path that works while sign-up is unavailable, and the README documents that path.

#### FR-3: Sign-out [baseline]

The owner can sign out from any screen. (assessment §4)

**Consequences (testable):**
- Every screen offers sign-out.
- After sign-out, the ended session loads no screen and calls no API route.

#### FR-4: Owner-scoped records [baseline]

Every read and write is scoped to the owner's records. (assessment §6, issues 30 and 31)

**Consequences (testable):**
- A request for a record that does not exist, or is not the owner's, gets one and the same not-found response.
- Every update and delete confirms ownership and changes the record in one atomic step.

#### FR-5: Server-side field rules [baseline]

Updates change only what they are allowed to change. (assessment §5)

**Consequences (testable):**
- An update request changes only the fields its form or tool allows; a request carrying any other field is rejected.
- An account's balance changes only through transactions; its currency and type cannot change once it has transactions.

#### FR-6: Private services and secrets [baseline]

The services behind the app are reachable only by the app. (assessment §4)

**Consequences (testable):**
- In every environment, the database and the job runner accept connections only from the app, over a private network.
- Each credential is randomly generated with at least 32 characters (A-13) and comes from the environment or a secret store; the deployment refuses to start without one, and no credential is committed.
- Continuous checks (FR-17) run a secret scan, which finds none in the repository.

#### FR-7: Authenticated encryption [baseline]

Encrypted values are verified before use. (assessment §4)

**Consequences (testable):**
- Decrypting a stored encrypted value rejects any value whose authentication tag is not full length.

#### FR-8: Dependencies and sign-in methods [baseline]

The dependency set and the sign-in methods stay within known-safe bounds. (assessment §4, issue 36)

**Consequences (testable):**
- Every deploy meets the advisory rule of NFR-6.
- No sign-in method beyond password with TOTP is added before the auth library upgrade (step U2 in `addendum.md`).
- The AI connection's authorization uses the auth library's current MCP packages, never its legacy MCP plugin.

#### FR-9: Bounded page size [baseline]

List requests stay within fixed bounds. (deferred item 7)

**Consequences (testable):**
- A list request without a page size uses the default of 50, and the maximum is 200 (A-14).
- A page size below 1 or above the maximum is brought into the allowed range, and one that is not a whole number uses the default, so no list request returns more than the maximum.

#### FR-10: Malformed requests and stable paging [built but broken]

The API answers bad input clearly and pages reliably. (issues 32 and 34)

**Consequences (testable):**
- A request body that is not valid JSON gets a 400 response with a reason, never a server error.
- Paging through any transaction list returns each transaction at most once, and every transaction that existed for the whole pass exactly once, including transactions that share a timestamp, while others are added or voided between requests.

#### FR-11: Manual transaction entry [built but broken]

The owner can add a transaction to an account in the app. (assessment §5, §6) Realizes UJ-6.

**Consequences (testable):**
- The form submits; the date is required and defaults to today's Bogotá date.
- The transaction and its account's balance change are saved in one atomic step; on failure, neither is saved.
- A successful save returns the saved transaction and shows it in the list without a reload.
- A debit lowers an asset account's balance and raises a liability account's debt; a credit does the opposite.
- A transaction entered at 21:00 in Bogotá keeps that Bogotá date.
- Amount and date text parse under R-13, and text R-13 rejects is refused with its reason.
- Before saving, the app runs the likely-duplicate check of FR-56 (A-5) and shows any candidate; the owner then saves anyway or cancels.

#### FR-12: Account edits and closing [built but broken]

Editing and closing accounts keep the ledger whole. (assessment §5, §6)

**Consequences (testable):**
- Editing an account keeps every field the edit does not show, its UVR setting included.
- An account with transactions can be archived: it keeps its history and its balance in net worth, takes no new transactions, and leaves pickers, the forecast, and the payment plan. Only an account without transactions can be deleted.

#### FR-13: Root page [built but broken]

(assessment §3)

**Consequences (testable):**
- The root address sends the owner to the landing screen (FR-45), or to sign-in when signed out, and renders no starter content.

#### FR-14: Documentation matches behavior [baseline]

(assessment §4)

**Consequences (testable):**
- The README describes the sign-in and TOTP flow exactly as implemented: a recorded check follows the README's steps on a fresh deployment with no step added or skipped. The wider README alignment is deferred item 4 in `addendum.md`.

#### FR-15: Encrypted backups, restore, and export [new]

The database is the only irreplaceable data (assessment §8), so protecting it is part of the baseline. (S8-38)

**Consequences (testable):**
- An encrypted backup runs daily and is kept 30 days, with a copy stored off the server (RPO 24 hours). The server's own credential cannot delete or overwrite the off-server copy, and the storage enforces the retention.
- A written runbook restores a working app from the off-server copy within 4 hours (RTO), using only that copy and the keys and secrets a restore needs, which are held outside the server (for example, in a password manager kept apart from the TOTP seed and backup codes).
- An automated restore check runs monthly: it restores the latest off-server copy into a scratch database and passes when row counts and account balances equal those recorded at backup time. Its result shows in the app (NFR-11). A failed check, no passing check within 35 days, or no backup within 26 hours raises an alert (FR-48, A-12).
- A manual restore check passes before any migration that touches auth or money tables, the auth library upgrade included.
- At any time, the owner can export every existing record type as files, and each later feature extends the export to its own records. The export writes stored values exactly, with a currency code on every amount, never the display rounding.

#### FR-16: Deployable package [new]

The app ships as one deployment on the target host (decision 7). (assessment §3)

**Consequences (testable):**
- The app builds into a container image and runs with the database and the job runner as one composed deployment.
- A clean checkout installs from the frozen lockfile and builds (deferred item 2).
- A deployment refuses to start when its public address is not configured, and no part of sign-in falls back to a local address.
- The composed deployment serves the app through a reverse proxy over HTTPS.
- The owner's account has TOTP set up before the deployment is reachable from outside the host.
- The first deploy happens only after every FR in §5.1 passes.

#### FR-17: Continuous checks [new]

(assessment §3)

**Consequences (testable):**
- Every push to main runs typecheck, tests with the coverage thresholds of NFR-10, and lint, and reports any failure to the owner.
- Every push to main also runs FR-16's clean-checkout install and build, because the generated database client is not committed and only a clean tree shows a missing generate step.

#### FR-63: TOTP recovery [new]

The owner can recover TOTP access without losing the ledger. (reconcile of the original plan, gap G9)

**Consequences (testable):**
- Signed in with TOTP, the owner can regenerate backup codes, which invalidates the old ones, and can move TOTP to a new authenticator after entering a code from the current one; after a move, the old authenticator's codes fail.
- The README documents how someone with access to the server restores the owner's access when the authenticator and every backup code are lost, and that procedure runs once on a test deployment.

#### FR-64: Attempt limits [baseline]

Sign-in, TOTP, and authorization attempts are limited, and repeated failures reach the owner. (reviewer gate: `review-adversarial.md` H5)

**Consequences (testable):**
- Failed sign-in, TOTP, and authorization attempts are counted per source and for the account. After 5 failures within 15 minutes from one source, or 20 within an hour for the account, further attempts are refused for 15 minutes (A-13).
- Repeated failures, meaning any refusal under these limits, raise an alert (FR-48) that cannot be turned off.
- After the wait, a correct attempt succeeds.

### 5.2 Accounts and money

**Description:** The owner's accounts in the types decision 3 keeps: savings accounts in COP and USD, credit cards with cuotas, loans, a mortgage, and crypto accounts. The money layer is the only place amounts are parsed, converted, and computed. Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-18: Account register [built but broken]

The owner, or Claude with write scope, can create and edit accounts of the MVP types. (assessment §5)

**Consequences (testable):**
- Each account has a name, a type, a currency (for a crypto account, its one crypto asset), an institution label the owner types, an opening balance and date, whether it receives statements, and a masked account number (NFR-7); a crypto account needs no number.
- A full account number typed into the number field keeps only its last four digits.
- The opening balance is the balance at the end of its opening date. The opening balance, the opening date, and a liability's starting debt are set once at creation; any later change is an adjustment with a reason, shown in the feed and in reconciliation.
- The owner may set an opening date earlier than today and import the statements since then, so that history feeds averages, budget history, and the trigger of subscription detection (FR-42).
- Asset accounts show their balance; liability accounts show their debt.
- Card, loan, and mortgage terms, the paying account included, live on the account itself (FR-36, FR-37).

#### FR-19: Money layer boundary [built]

(assessment §5)

**Consequences (testable):**
- Every amount, conversion, and interest figure shown in the app or returned by a tool comes from the money layer; a contract test compares each money-returning tool's result with the money layer's result for the same input.
- COP and USD amounts are held in minor units (NFR-1).

#### FR-20: Multi-currency with locked rates [built but broken]

Every amount keeps its currency and, for USD, its locked rate. (assessment §5, S8-03)

**Consequences (testable):**
- Every transaction carries its account's currency, never a default COP label.
- A USD transaction stores its locked rate and its COP value at that rate, and neither is recomputed except by a re-lock under R-2.
- Totals across currencies show in COP: history at each transaction's locked rate, current balances at the latest TRM, with the rate date shown (NFR-8).
- A fetched TRM, UVR, or price is stored only if it parses, is positive, and covers the expected date; otherwise the job fails visibly (NFR-11) and the last good value stays in use with its date.
- Past TRMs are fetched on demand for any date a transaction needs. A transaction whose TRM is not yet available posts with its rate pending and locks when the rate arrives, never at a stale rate; until then it counts at the latest TRM, and totals that include it are marked provisional.
- When no TRM covers a date 3 days after it (A-12), the app offers manual entry of that date's TRM, recorded in the audit log. When the official TRM arrives, it replaces the manual one and re-locks the transactions that used it as an audited write (R-2), and the re-lock is flagged in the review queue (FR-32).

#### FR-21: Crypto accounts [new]

The owner can hold a crypto asset in a crypto account, one asset per account, as a crypto quantity. (decision 3; assessment §5)

**Consequences (testable):**
- A crypto quantity keeps its asset's precision: an asset held to 8 decimal places is stored and shown exactly, never rounded to zero.
- Each crypto account is valued at its asset's latest USD price, converted to COP at the latest TRM, with the price date shown.
- A buy or a sell records the quantity and its COP cost. Each crypto account shows its cost basis as the average cost per unit in COP, and its unrealized gain or loss.
- The owner can enter a dated manual price for an asset; it is labeled manual and used only while no newer fetched price exists (S8-05, F7.1-05).

#### FR-22: Interest rates as EA [new]

(decision 3; F7.1-08)

**Consequences (testable):**
- Every card, loan, and mortgage rate is entered and stored as an EA rate, and the app shows its monthly equivalent beside it, to 2 decimal places (R-3).
- A rate outside 0 to 100 percent EA is rejected with the reason (A-14).

#### FR-23: UVR mortgage, conditional [built but broken]

This FR applies only if the owner confirms the mortgage is UVR denominated (Open Question 1); otherwise the UVR fields are removed. (decision 3; issue 33)

**Consequences (testable):**
- The mortgage shows its balance in UVR units and its COP value at the day's UVR (R-8).
- UVR settings are validated together (issue 33): the UVR setting is accepted only on a mortgage; a UVR mortgage needs a balance in UVR units above zero with at most 6 decimal places; an account without the setting holds no UVR balance; each violation is rejected with its reason.
- When the day's UVR is unavailable, the last known value is used and labeled with its date; the owner can enter a missing UVR by hand, recorded in the audit log.

### 5.3 Transactions and transfers

**Description:** Every transaction, whatever its source, lands in one ledger the owner can search, correct, and audit. Transfers between the owner's own accounts are linked pairs, so card payments and currency conversions never inflate spending or income. Realizes UJ-3, UJ-5, UJ-6.

**Functional Requirements:**

#### FR-24: Transaction feed [new]

The owner can see every transaction across accounts in one feed. (assessment §5)

**Consequences (testable):**
- Filters combine: account, category, date range, amount range, source, and text in the description or notes.
- The amount range uses the account's currency when one account is selected, and COP values at locked rates across accounts.
- The text filter matches a substring, ignoring case and accents.
- Each row shows the date, description, account, category, signed amount with currency, and source.
- Voided transactions stay hidden unless a filter shows them.

#### FR-25: Edit, void, and notes [new]

The owner, or Claude with write scope, can edit a transaction's description, category, date, amount, and notes, or void it.

**Consequences (testable):**
- Every edit and void is recorded in the audit log with before and after values and can be undone (FR-55); the audit log records writes from every source (A-10).
- Changing the date of either side of a transfer changes both sides. In one currency, changing one side's amount changes the other's; across currencies, the other side stays and the implied rate is recomputed. Voiding either side voids both.

#### FR-26: Transfers between own accounts [built but broken]

(issue 35; S8-30)

**Consequences (testable):**
- A transfer is a linked pair: a debit on one of the owner's accounts and a credit on another. It never counts as spending or income.
- A card or loan payment from a savings account is a transfer. A loan or mortgage payment follows its installment schedule: the interest and any other charges in it post as spending on the liability account, under their own category, so the debt falls only by the principal part. Card interest and fees arrive as statement rows.
- A COP to USD conversion, paying a linked USD card account from a COP account included, is a transfer whose two sides keep their own currencies. The rate it implies is stored with it, and its spread against the TRM of its date shows as an informational line on the transfer, never as spending or income.
- A movement is a transfer only when both sides are the owner's accounts (R-10); otherwise it is spending or income.
- A row links as a transfer side to an unlinked transaction on another of the owner's accounts that is opposite in direction, inside the match window (A-5), and of the same amount in one currency or, across currencies, at an implied rate within 5 percent of the TRM (A-11).
- A row that a stored transfer rule marks and that has no counterpart is an unmatched transfer candidate in the review queue; a transfer word alone never marks one (F7.1-07).
- A transfer cannot be saved with only one side (issue 35). Linking a candidate generates the other side; across currencies, the generated side stays pending, outside balances, until its own row arrives or the owner gives its amount.

### 5.4 File import and reconciliation

**Description:** Capture never relies on bank sync (decision 2). The owner imports statement files in the app (XLS and CSV, plus OFX only if an account offers it), or hands a PDF statement to Claude, which stages its rows through the AI connection. Both paths share one staging step, so the same transaction never posts twice across Claude, manual entry, and import. Committed files describe formats generically; any real institution names live in a git-excluded note under `.private/` (§7.1). Realizes UJ-4, UJ-5, UJ-6.

**Functional Requirements:**

#### FR-27: Import flow [new]

The owner can import a statement file for one account. (assessment §5, S8-22)

**Consequences (testable):**
- Steps: upload, preview the parsed rows, map columns on first use, review duplicates, near duplicates, and matches, then confirm.
- The column mapping is saved per account and reused. It holds the date, description, and amount columns (or separate debit and credit columns), any cuota count and cuota number columns, the sign convention, the lines to skip above and below the table, and the number and date formats.
- The preview shows the category each row will get from the rules, and the owner can change it before confirming.
- Nothing posts until the owner, or Claude with write scope, confirms; posted rows get source import.
- A row inside the mapped table that fails to parse rejects the whole file with the row and the reason, and nothing posts.
- A file over 10 MB or 5.000 rows (A-14), a file of an unsupported type, or a file that no longer fits its column mapping is rejected with the reason, naming the limit or the missing column, and the owner can remap.
- The import builds parsers only for the formats the owner's git-excluded institution note names (Open Question 4).
- For an account that offers an XLS or CSV export, the in-app import is the preferred path, and a PDF through Claude is the fallback (§7.1).
- The owner unlocks a password-protected PDF before it reaches Claude; the app never asks for or stores a statement password.

#### FR-28: Duplicates and matches across sources [new]

(decision 2)

**Consequences (testable):**
- Each staged row gets one class, tested in this order: duplicate, match, near duplicate, new (§3).
- Match candidates are every transaction on the account that no statement row has confirmed, whatever its source, generated transfer sides included. Matching is one to one, nearest date first; a row with two or more candidates goes to the review queue; voided records never take part.
- The match window is 3 business days either side of the row's date, inclusive (A-5).
- A staged row within 15 percent of the amount of a Claude capture inside the match window (A-11) is offered as a match for review, never posted silently.
- At import, each Claude capture in the statement period with no row joins the review queue as an unmatched Claude capture.
- Confirming a match keeps one transaction, now cleared: it keeps its own date for budgets and its locked rate, and the statement's date and description are kept beside it.
- A duplicate is skipped and listed, and the owner can still post a listed duplicate (two genuine identical charges). Matching counts rows: two identical staged rows against one existing transaction leave one row to post.
- A near duplicate is flagged for review, never silently skipped or posted.
- A staged card row with a cuota counter above 1 links to its cuota purchase and never posts as a purchase (FR-36).
- Staged rows dated on or before the account's opening date are listed and skipped like duplicates; the owner can still post one.
- Every skipped, flagged, and matched row is shown before the owner confirms.

#### FR-29: Statement reconciliation [new]

The owner, or Claude with write scope, can reconcile an account against a statement. Reconciliation is in the MVP because SM-1 measures it (A-6).

**Consequences (testable):**
- For a statement, the owner or Claude enters its closing balance and closing date and, for a card, its minimum payment and printed payment due date, which override the computed ones for that cycle (R-6).
- A statement period runs from the day after the previous statement's closing date; the first runs from the day after the opening date.
- The app compares the closing balance with the account's cleared balance at the closing date, at the statement's precision, and lists the period's uncleared transactions as pending, not as a difference.
- A difference of zero marks the account reconciled for that statement; any other difference stays open, with the pending list and any unmatched Claude captures beside it.
- The reconciliation records who entered the closing balance and who confirmed it. A closing balance Claude enters takes effect only once the owner confirms it (FR-65).
- A write that changes a cleared transaction in a reconciled period warns first and removes the reconciled mark until that statement reconciles again.
- For an account that receives statements, when no reconciliation follows a card's statement cut day, or another account's last closing date plus one month, within the allowance the owner sets (A-12), a statement expected item joins the review queue.
- (Release 2) The statement expected item also raises an alert (FR-48).

### 5.5 Categorization

**Description:** Rules, stored as data, file the transactions of every source; what the rules cannot file goes to the review queue, which the owner or Claude works (decision 4). The app calls no LLM; Claude is the only model in the loop. Categories are told apart by label, never by hue (FR-59). Realizes UJ-3, UJ-4, UJ-5, UJ-6.

**Functional Requirements:**

#### FR-30: Categories [new]

The owner can add, rename, merge, and archive categories; Claude with write scope can add and rename them. (assessment §5)

**Consequences (testable):**
- Merging moves every transaction, rule, and budget of the merged category to the surviving one; for a month where both held a budget, the surviving limit is their sum. The merge records what it moved, so undo can split it back (FR-55).
- An archived category takes no new assignment, and its rules stop matching.
- The seed is a fixed list covering Colombian spending and income, checked after a fresh install. It includes GMF (R-11), interest earned, withholding on returns, the card fee (cuota de manejo), card insurance, and Efectivo for cash. Seeded rules use current merchant names (F7.1-06) and never treat a transfer word alone as a transfer (F7.1-07).
- A cash withdrawal posts as spending under Efectivo, never as a transfer; per-purchase cash tracking is deferred (§9.2).

#### FR-31: Rules as data [new]

(S8-21, S8-24)

**Consequences (testable):**
- A rule matches when its text is a substring of the description, ignoring case and accents, optionally narrowed by account and amount range, and assigns a category.
- Rules categorize every new transaction on entry, whatever its source, and fill only an empty category, never one already set.
- When the owner categorizes an uncategorized transaction, the app offers to save a rule from it.
- Rules are viewable and editable in the app and through the write tools (FR-54).
- When several rules match, a fixed order decides: more narrowing conditions first, then longer text, then the newest rule.
- A new or edited rule refiles existing transactions only when the owner applies it.
- Each transaction shows the rule that categorized it.

#### FR-32: Review queue [new]

(S8-24)

**Consequences (testable):**
- One review queue, in the app and through a read tool, holds these item types, each with its resolutions:
  - uncategorized transaction: set a category, optionally saving a rule (FR-31);
  - near duplicate: keep both, or keep one (FR-28);
  - match to confirm (two or more candidates, or a near amount): confirm one, or reject so the row posts as new (FR-28);
  - unmatched Claude capture: keep it, or void it (FR-28);
  - unmatched transfer candidate: link it to an account, or mark it not a transfer (FR-26);
  - Claude-entered account term or closing balance: confirm it, or reject it so it never takes effect (FR-65);
  - statement expected: clears when the statement reconciles, or the owner dismisses it (FR-29);
  - re-locked rate: acknowledge it, or undo the re-lock (FR-20);
  - (Release 2) an occurrence with two or more fulfilling transactions: pick one, or none; and a missed occurrence: link the transaction that fulfilled it, or confirm it missed (FR-41).
- Claude with write scope can resolve review queue items, except a Claude-entered account term or closing balance, which only the owner confirms, in the app (FR-65). Every resolution is logged and can be undone (FR-55).
- The dashboard shows the number of review queue items.

### 5.6 Budgets and goals

**Description:** Budgets are monthly limits per category; irregular costs go to goals instead of rollovers. Claude proposes a budget split from the app's figures and writes it once the owner agrees. Realizes UJ-3, UJ-7, UJ-8.

**Functional Requirements:**

#### FR-33: Monthly budgets [new]

The owner, or Claude with write scope, can set a monthly limit per category with a threshold. (assessment §5)

**Consequences (testable):**
- Progress is the month's spending in that category, transfers excluded, against the limit. A cuota purchase counts once, in full, in its purchase month, and a reversal lowers its purchase month's spending (FR-36).
- Crossing the threshold and crossing the limit each raise one alert per category and level, and only for the current month (FR-48).
- A limit carries forward to later months until changed. The owner, or Claude once the owner agrees, can confirm a month's carried limits as they stand, which counts as setting that month's budgets (SM-4).
- Budgets are monthly only: no weekly or custom periods, and no rollovers.

#### FR-34: Budget history [new]

(guide phase 7)

**Consequences (testable):**
- A month closes at 00:00 Bogotá on the 1st of the next month, and its limits freeze then. Its actual spending always reflects the ledger, late imports, voids, undos, and date corrections included.
- Budget history shows each closed month's frozen limit and actual spending per category, month over month.
- A read tool returns the budget history for any range of closed months.
- Whether history is stored and recomputed or computed on read is the architecture step's call (`addendum.md` §3.6); the behavior above holds either way.

#### FR-35: Goals and sinking funds [new]

The owner, or Claude with write scope, can create a goal with a name, target amount, target date, and funding account. (S8-37)

**Consequences (testable):**
- The goal plan shows progress, the monthly contribution needed (the target minus progress, divided by the whole months left, rounded up), and whether the planned contributions by the target date cover the rest (on track).
- Progress counts contributions into the funding account, not that account's whole balance (A-7). A transfer that fulfils a planned contribution is that goal's contribution, logged and undoable (FR-41).
- Planned contributions are recurring events, so the forecast includes them.
- The goal plan flags any month where a planned contribution would take the account it comes from below its cash buffer.
- A sinking fund holds an interval: when its target date passes, it starts its next cycle and carries its remainder into it.
- A goal whose target date passes short of its target shows as missed, with the amount still missing.

### 5.7 Debt, cards, and payment planning

**Description:** Account terms live on each liability account. The payment plan applies fixed, deterministic rules instead of a solver (S8-15), and payment scenarios answer "the minimum, or can I afford more" with exact figures. Realizes UJ-1, UJ-4.

**Functional Requirements:**

#### FR-36: Credit cards with cuotas [new]

(S8-25; F7.1-08)

**Consequences (testable):**
- A card has a statement cut day, a payment due day, an EA rate, a paying account, its interest terms (R-5, A-4), and an optional linked USD card account (R-4, A-3).
- Each purchase records its number of cuotas and, when it differs from the card's, its own EA rate. A running purchase entered at setup records its original amount, cuota count, and cuotas already billed, and leaves the opening balance unchanged.
- A first-cuota row posts the purchase's original value once, with its cuota count; a match also takes the statement's cuota count. A staged row with a cuota counter above 1 links to its purchase and records that cuota as billed, with its interest posted as interest spending.
- A credit can be marked as a reversal of a purchase: it ends the purchase's remaining cuotas and lowers its category's spending in the purchase's month, never counting as income.
- The card shows its debt, the cuotas pending per purchase, and the minimum payment and payment due date of its latest statement (FR-29).
- A derived payment due date takes the shift in the card's terms, the previous business day by default; the payment plan, the alerts, the forecast, and the income event flag all read the shifted date.
- A statement cut day or payment due day beyond a month's length falls on that month's last day (FR-41).
- (Release 2) A purchase in more than 1 cuota gets an installment schedule by the card's amortization method (equal principal by default, level installment the alternative) at its own EA rate, with a partial first period under the card's day-count rule (A-11).
- (Release 2) Between statements, the card shows the estimated minimum payment of R-6.
- (Release 2) The card's terms say how a payment above the minimum spreads across its balances, and whether it shortens or lowers cuotas.
- (Release 2) A liability with a credit balance has no minimum payment and leaves the payoff order (FR-38, FR-39).

#### FR-37: Loans and the mortgage [new]

(assessment §5)

**Consequences (testable):**
- A loan or mortgage has a starting debt, set once at creation (FR-18), an EA rate (A-2), an installment, a monthly payment due day, a remaining term, an extra payment rule, a paying account, and the fixed charges inside its installment, such as insurance. Its current debt is derived from the starting debt and its transactions, never stored or written.
- Each installment payment splits into principal, which lowers the debt, and interest and charges, which post as spending (FR-26). The split comes from the lender's statement, entered as an audited write.
- A payment due day beyond a month's length falls on that month's last day (FR-41), and a derived payment due date takes the shift in the loan's terms, the previous business day by default.
- (Release 2) The app shows the installment schedule, by the loan's amortization method (equal principal by default, level installment the alternative) with a partial first period under its day-count rule (A-11), and the payoff date. The computed schedule is a labeled estimate, and a lender's split replaces it for its installment.
- (Release 2) The computed schedule supplies the split until a lender's split replaces it.
- (Release 2) A payment covers the charges and interest due first, then principal, then any excess under the extra payment rule. A short or missed payment leaves the rest due and is flagged, and the schedule recomputes from the remaining principal after each payment.

#### FR-38: Payoff comparison [new]

(S8-02)

**Consequences (testable):**
- For a given monthly amount for debt, the app computes month by month schedules for all debts under avalanche and under snowball, with total interest and payoff date for each, side by side.
- A paid-off debt's payment rolls to the next debt in method order from the following month. Ties break by a fixed rule: avalanche by the smaller debt, snowball by the higher EA rate, then by account creation order.
- A monthly amount below the sum of the minimum payments is rejected, naming how much it falls short. On a card, the extra follows the card's terms for a payment above the minimum (FR-36). A schedule that never pays off shows "no payoff".
- Comparisons count only today's debt, with no new purchases, and say so.
- The comparison states in words what each payoff method optimizes (avalanche pays the least interest; snowball closes small debts first), the interest difference between them, and each method's saving against paying only the minimum payments. Neither method carries a recommended or a wrong label.

#### FR-39: Monthly payment plan [new]

(S8-15)

**Consequences (testable):**
- The payment plan lists every payment due this month with its payment due date: minimum payments first, then the monthly extra by the payoff method. Where a statement gives one combined minimum for a card and its linked USD card account, the plan links the two accounts in one line.
- Every minimum payment is always scheduled by its payment due date. The cash buffer limits only the monthly extra: the plan schedules the largest part of the extra that keeps its paying account at or above its cash buffer on each of the next 90 days, and lists the rest as held back. When a minimum payment would take the paying account below its cash buffer, the plan keeps the payment and flags the breach.
- A projected balance below zero on a payment date is flagged as a shortfall, apart from a buffer breach, in payment due date order.
- A payment whose payment due date falls before the next income event into its paying account is flagged.
- A payment that fulfils its line shows as paid (FR-41), even when it came from another account.
- Each line states in words the rule that placed it (minimum payment, monthly extra by the payoff method, due before the next income event, extra held back by the cash buffer), and the compute response returns the same reason.
- Payment due dates feed the payment due alerts (FR-48).

#### FR-40: Payment scenarios [new]

The owner or Claude can compare the minimum payment with paying more, as a monthly extra or a one-off amount, for one debt or for all debts. (assessment §5)

**Consequences (testable):**
- Each option shows its payoff date, how many months sooner than the minimum it pays off, total interest, interest saved against the minimum, and the paying account's lowest forecast balance with that day's confidence level, flagging the first day below its cash buffer. The compute response returns these ready to quote.
- For a loan or mortgage, an extra payment can be compared as a term reduction or as an installment reduction.
- The owner, or Claude with write scope, can save a chosen option as the monthly extra, or a one-off option as a planned event (FR-41).

### 5.8 Recurring calendar, subscriptions, and forecast

**Description:** One recurring calendar holds income events, recurring expense events (subscriptions among them), payment due dates, planned contributions, and planned events, shifted around weekends and Colombian holidays (R-9). The forecast reads it to show what the next 90 days hold. Realizes UJ-1, UJ-3, UJ-4, UJ-8.

**Functional Requirements:**

#### FR-41: Recurring events [new]

The owner, or Claude with write scope, can define recurring events and planned events. (S8-26)

**Consequences (testable):**
- Each recurring event has a direction, an amount, an account, a start date, an optional end date, a frequency, and a business-day shift. A frequency is one of three rules: every N days; every N months on a chosen day; or twice a month on two chosen days.
- Each occurrence is computed from the event's anchor (its start date), then clamped, then shifted: a chosen day beyond a month's length falls on that month's last day, which covers "the last day of the month", and the business-day shift applies after that. Two chosen days clamped to one date give two occurrences.
- A recurring event can change or skip one occurrence. A planned event (amount, account, date) enters the payment plan and the forecast like an occurrence.
- Payment due dates, subscriptions, and planned contributions appear as recurring events.
- A posted transaction on the event's account fulfils its open occurrence when its amount is within 10 percent of the occurrence's amount and its date within 5 business days of the occurrence's date (A-11): one such transaction fulfils it automatically, and two or more go to the review queue. Payments into a liability since its previous payment due date fulfil its payment due occurrence once they reach the minimum payment; less is a short payment (FR-37).
- A fulfilled occurrence stops projecting, shows as paid in the payment plan, and silences its payment due alerts. An occurrence whose date passes unfulfilled is flagged as missed, which is SM-3's data, and is never projected into the past.
- The owner can add or remove a public holiday, and the change applies to every business-day shift (R-9), re-shifting only future occurrences.

#### FR-42: Subscription detection [new]

Gated: detection starts when the ledger holds six months of card and account history (§9.2, §9.3). Until then a subscription is a recurring expense event that the owner or Claude adds (FR-41). Once detection starts, it proposes recurring expense events rather than a second kind of record. (assessment §5)

**Consequences (testable):**
- Weekly, the app scans the last 6 months of card charges and account debits and proposes subscriptions: 2 or more charges from the same normalized merchant, intervals whose standard deviation is under 3 days, amounts within 5 percent of their average, and an average interval near 7, 14, or 28 to 31 days.
- Each proposal shows the charges and intervals behind it.
- Each subscription shows its merchant, amount, currency, frequency, next expected charge, and yearly cost in COP.
- The owner, or Claude with write scope, confirms or dismisses each proposal; only the owner flags a subscription as unwanted, and the app never flags one unwanted on its own.
- A charge on a confirmed subscription that differs from its expected amount by more than 5 percent is flagged.
- The owner or Claude adds yearly subscriptions, which 6 months of history cannot reveal.

#### FR-43: Cash buffer [new]

**Consequences (testable):**
- The owner sets a cash buffer per asset account, zero when unset, and the payment plan and the forecast use it.

#### FR-44: Cash flow forecast [new]

(assessment §5; S8-02)

**Consequences (testable):**
- For the next 90 days, the app projects each account's daily balance and the total in COP, with USD at the latest TRM.
- Inputs and their confidence levels: high for recurring events with fixed amounts, planned events, planned contributions, installments, statement minimum payments, and the monthly extra (the payment plan is an input); medium for variable spending per category, at the higher of its budget and its 3-month average, and for estimated minimum payments (R-6); low for categories with irregular spending, meaning spending in fewer than 3 of the last 6 months, at their 12-month average spread across the year.
- Averages divide by the months the ledger covers, and exclude transactions that fulfilled a recurring event, a subscription, or an installment. A category is irregular only once the ledger covers 6 months; before that it projects its budget, or shows as unestimated, a state apart from low that the app and the compute response name. The forecast lists what it leaves out.
- Each category estimate lands on the accounts that paid it, by their split over the last 3 closed months; projected card spending reaches cash only through the card's projected payments.
- The current month projects only what remains above its posted spending, never below zero, spread evenly over its remaining days; later months spread evenly over their days.
- Fulfilled occurrences stop projecting, and no occurrence is projected into the past (FR-41).
- A day's confidence is the lowest level of any input feeding that account's balance from today through that day. Each day shows its confidence level and lists the recurring events and estimates that move it, in the app and in the compute response.
- Lowest balances are reported per asset account against its own cash buffer, with the total apart. Every day an account is below its cash buffer is marked, and the first is named.

### 5.9 Dashboard, net worth, and reports

**Description:** The dashboard answers "where do I stand" at a glance; balance snapshots turn net worth into a history, and one report shows where the money went. Realizes UJ-1, UJ-6.

**Functional Requirements:**

#### FR-45: Dashboard [built but broken]

(assessment §5, §6)

**Consequences (testable):**
- The dashboard is the landing screen after sign-in; with no accounts, it shows only a pointer to create one.
- Net worth converts every currency to COP before adding (USD at the latest TRM, crypto at the latest price), subtracts debts, and shows the conversion dates.
- The dashboard shows a debt summary (total debt, next payment due dates, the minimum payments of the latest statements), the review queue count, and each account's current through date.
- (Release 2) The dashboard also shows this month's budget status, listing each budgeted category with spent, limit, and percent, and the forecast's lowest balance in the next 90 days with that day's confidence level.

#### FR-46: Balance snapshots and net worth history [new]

(S8-27)

**Consequences (testable):**
- Each day's balance snapshot of every account reflects every write dated on or before that day, at that day's TRM and price, days the job missed included.
- Net worth over time shows from the balance snapshots, with assets and debts apart.
- Year-end balance snapshots are kept for the deferred tax features (decision 6), and each shows when it was last recomputed.
- Whether snapshots are stored and recomputed or computed on read is the architecture step's call (`addendum.md` §3.6); the behavior above holds either way.

#### FR-47: Spending report [new]

(S8-43)

**Consequences (testable):**
- For a chosen period, the report ranks spending by category against the previous period, with drill-down to transactions: a calendar month against the previous calendar month, and any other range against the same number of days just before it.
- The report also shows income against spending per month.
- Transfers never count as spending or income.

### 5.10 Alerts

**Description:** Claude cannot start a conversation, so time-sensitive notices need their own channel: email (decision 5). An alert carries no amounts: only its type, a count or the client's name where FR-48 says, and a link. Claude briefs the owner on demand through the read tools. Realizes UJ-2.

**Functional Requirements:**

#### FR-48: Email alerts and the alert list [new]

(decision 5)

**Consequences (testable):**
- Alert types: payment due, 3 days ahead and on the day (A-9); new connected client (FR-51); failed backup or restore check (FR-15); repeated failed attempts (FR-64); budget threshold or limit (FR-33); and statement expected (FR-29).
- Release 1 ships the email channel and the alert list together with FR-15, and four alert types, always on with no per-type setting: payment due, new connected client, failed backup or restore check, and repeated failed attempts (FR-64).
- In Release 1, before the recurring calendar exists, a payment due alert is skipped once a payment to that liability account has posted since its last statement cut day.
- (Release 2) The budget and statement expected types arrive with a per-type on or off setting, which never turns off the new connected client alert or FR-64's alert.
- An alert email holds the alert type, the client's name for a new connected client, a count for the types that carry one (how many categories crossed, for a budget alert; how many accounts, for statement expected), and a link to the app, and nothing NFR-7 excludes.
- A new connected client alert is sent within 5 minutes, and a scheduled alert within 1 hour of its job (A-13); a failed send shows in the app (NFR-11).
- Every alert also lands in the alert list, which the owner sees in the app and Claude reads through a read tool. On each day Claude writes anything, the alert list also records that day's count of Claude writes by type, never sent by email.

#### FR-49: Weekly digest [new]

(decision 5)

**Consequences (testable):**
- When the owner turns it on (it is off by default), a weekly email goes out on Monday at 07:00 Bogotá (A-12) with counts only (review queue items, alerts that week, and Claude writes by type) and a link, never amounts.

### 5.11 The AI connection

**Description:** The main feature. Claude acts as the owner's accountant through the AI connection: it reads the ledger, asks the app for exact figures, and manages records, while the app stays the single source of truth. The assessment recommended a read-only connection (S8-20, S8-35); the owner wants Claude to manage data, so write access ships with guardrails instead: bounded write tools, voids instead of deletions, an audit log, and undo. [NOTE FOR PM: if SM-C1 trips, revisit the write tools before adding new ones.] Realizes UJ-2, UJ-3, UJ-4, UJ-6, UJ-7, UJ-8.

**Risk:** the AI connection rests on Claude's custom connector support (A-15). When it breaks, each Claude-only path has an in-app alternative: manual entry (FR-11) for capture, the in-app import (FR-27) and in-app reconciliation (FR-29) for statements, with a PDF-only statement entered by hand, and the app's screens for every figure a compute tool returns.

**Functional Requirements:**

#### FR-50: AI connection [new]

(assessment §5; S8-06)

**Consequences (testable):**
- claude.ai web, Claude Desktop, and Claude Code each connect as a custom connector and complete a read and a write, recorded as a manual check per app for each release and after any Claude connector change. This check covers Claude's own steps in the journeys, and confirms A-15.
- The AI connection speaks the current MCP protocol version and keeps the previous one working; the legacy mode is removed only in a release whose recorded check shows all three apps connecting without it (F7.2-04).

#### FR-51: Connecting and scopes [new]

(S8-35)

**Consequences (testable):**
- Connecting a client needs the owner's sign-in with password and TOTP; the consent screen names the client, and the owner grants read scope, or read and write scope.
- Authorization accepts only the client identities of the three acceptance apps (claude.ai web, Claude Desktop, and Claude Code); any other client is refused.
- Claude Code completes sign-in through its loopback redirect, shown in the recorded FR-50 check (UJ-2).
- A connected-clients page lists each connected client with its scopes, connection date, last use, and the date each scope's grant lapses; the owner can revoke any of them, and revocation and lapse follow NFR-5.
- Every new connection raises an alert that names the client (FR-48).

#### FR-52: Read tools [new]

With read scope, Claude can read accounts and balances, transactions with the feed's filters, categories and rules, budgets and budget history, goals, debts with installment schedules, recurring events and subscriptions, net worth and its history, the review queue, the alert list, and the success metrics. Each read tool covers the records of the release that ships them (§9.3).

**Consequences (testable):**
- Tool responses follow NFR-7: no full account number, credential, or token.
- Read tools answer with the narrowest data by default: totals and the last 30 days (A-14), with rows on request, in pages (FR-9) and under the result-size caps of `addendum.md` §3.3.
- Statement text comes back in a delimited field marked as statement text, at most 500 characters long (A-14).
- A metrics tool reports SM-1 to SM-5 and SM-C1 from recorded data, as counts and percentages with no amounts (§11); each metric reports once the records it reads exist.

#### FR-53: Compute tools [new]

With read scope, Claude can ask the app for this month's payment plan, payoff comparisons, payment scenarios, the forecast, a goal plan, and spending by category for a period. Release 1 ships spending by category for a period, so Claude never totals transactions itself (A-1); the other compute tools arrive with Release 2.

**Consequences (testable):**
- Every figure in a compute response comes from the money layer, and a compute tool changes nothing; a contract test compares each response with the money layer's result for the same input (FR-19).
- Each response carries a short provenance line Claude can quote: its source, and the dates of the rates and prices it used.
- Each response names every Claude-entered input it used that the owner has not confirmed (FR-65).
- Each response states the oldest current through date among the accounts it used, and flags any older than the limit the owner sets (A-12).
- Every forecast figure in a compute response carries its confidence level, and a lowest balance carries the confidence of its day.

#### FR-54: Write tools [new]

With write scope, Claude can do only what this list names, and §7.2 and `addendum.md` §3.8 cite it as the one list: record and correct transactions and transfers; void them; categorize transactions; create and edit rules; add and rename categories; resolve review queue items (FR-32); stage and confirm import rows; enter statements (closing balance and date, and for a card the minimum payment and printed payment due date); create accounts and change their details; enter account terms and cuota purchases; create or change budgets, goals, recurring events (subscriptions included), planned events, and the monthly extra; and, once FR-42 starts, confirm or dismiss its proposals. Each write tool covers the records of the release that ships them (§9.3).

**Consequences (testable):**
- No write tool deletes or archives an account, merges or archives a category, sets a balance or a debt directly, changes an opening balance, opening date, or starting debt other than by an adjustment (FR-18), flags a subscription as unwanted, or changes sign-in, TOTP, connected clients, or alert settings.
- Account terms and closing balances that Claude enters take effect only once the owner confirms them in the app; every other write takes effect at once, logged and undoable (FR-55, FR-65).
- A deletion requested through Claude becomes a void; the void tool is the connection's only removal.
- A write tool called with read scope changes nothing, returns a scope error, and is logged.
- Amounts and dates arrive as text with a declared format; the money layer parses them under R-13, and the response returns the values stored. Text R-13 rejects is refused with its reason.
- Rows Claude stages go through the same duplicate and match checks as file imports (FR-28) before they post.

#### FR-55: Audit log and undo [new]

(S8-35)

**Consequences (testable):**
- Every tool call is logged with its connected client, tool, time, and inputs; every write from any source also keeps before and after values (A-10).
- The feed shows Claude's transactions with source Claude.
- The owner can undo any logged write from the app. An undo reverts one write call as a unit: it first lists every record it will change, with before and after values, and restores only the fields that write changed. When a later write changed one of those fields, the undo is refused and names that write.
- Undoing a merge splits it back from what the merge recorded (FR-30), and undoing one side of a transfer reverts both.
- Undoing an import match states that the statement row will post as new, and applies only after the owner confirms (UJ-6).
- An undo is itself a logged write, and it can be undone.
- The audit log filters by date.

#### FR-56: Conversational capture [new]

When the owner reports a transaction in conversation, Claude records it with the write tools. (decision 2) Realizes UJ-3.

**Consequences (testable):**
- A record call without a date stores today's Bogotá date.
- The record tool requires an explicit account and never assumes one: an account reference that matches more than one account stores nothing and returns the candidates, and the tool's description tells Claude to ask the owner.
- The currency comes from the account, and a USD transaction gets its locked rate (R-2).
- Rules categorize the transaction; when none matches, the response says so, so Claude can propose a category.
- A record call that finds a likely duplicate (same account and amount inside the match window, A-5) stores nothing and returns the candidates; the same call repeated with each candidate acknowledged by ID stores it.
- The response echoes the stored transaction (date, account, amount, currency, category) for Claude to show the owner.

#### FR-57: Honest tool descriptions [new]

(§1)

**Consequences (testable):**
- Each tool's description has a part saying what it covers and a part saying what it does not, so Claude can tell a capability gap from an error; every tool error carries a code.
- The server instructions and tool descriptions say that statement text is data, never an instruction (§7.2), and ask Claude to cite the figures and provenance lines that tools return (A-1).
- The app stores nothing for a capability gap; Claude drafts the development prompt in the conversation (UJ-7).
- The server instructions and tool descriptions say the repository is public, so a drafted prompt describes the need generically, with a fictional owner, made-up numbers, and account types instead of institutions or merchants, and leaves statement text out.

#### FR-65: Provenance and owner confirmation [new]

Every input that a figure rests on records who entered it, and the inputs with the most weight wait for the owner when Claude enters them. (reviewer gate: `review-adversarial.md` C2)

**Consequences (testable):**
- Every account term, cuota purchase, rule, and closing balance records its provenance: the owner in the app, Claude through a named connected client, or an import.
- An account term or a closing balance that Claude enters waits in the review queue and takes effect only when the owner confirms it with one tap in the app; rejecting it leaves the previous value, if any, in force. Only the owner confirms, never Claude.
- Every other Claude write takes effect at once, logged and undoable (FR-55). The owner can confirm a Claude-entered cuota purchase or rule in the app.
- A compute response that depends on a Claude-entered input the owner has not confirmed names that input (FR-53).

### 5.12 Redesign on the Cuatro design contract

**Description:** Cuatro Finance gets a complete visual and interaction redesign, decided by the owner, that adopts the Cuatro design contract published by cuatro-portfolio. It stays a standalone repository and adopts the contract as a Satellite. This is the app's own redesign, not a portfolio restyle: the Anchor treats a restyle of an In progress app as a defect. The UX step (`bmad-ux`) designs it; this feature states what the result must satisfy. Notes for the UX step are in `addendum.md`.

**Functional Requirements:**

#### FR-58: Contract adoption as a Satellite [new]

**Consequences (testable):**
- The repository vendors the contract folder unchanged, every file in it, and updates it only as a whole.
- The UI uses only token roles, the contract fonts, and the contract motion tokens, and defines no raw palette values or local colours.
- The UI is dark only.
- The contract's component vocabulary is built natively in this repository; nothing else is imported from cuatro-portfolio.
- The contract's floor checks pass (NFR-3), and a manual accessibility pass is recorded for each release, with pass or fail per screen for keyboard reach with visible focus, 360px wide, greyscale, and reduced motion forced.
- Adoption lands in a commit the owner reviews, and the release record names the adoption commit and the owner's review date.

#### FR-59: Meaning without hue [new]

**Consequences (testable):**
- Debits and credits, debt and balance, categories, and chart series are told apart by sign (a true minus sign), words, position, and structure, and every screen passes the contract's greyscale check.
- A need for a new colour is raised as a contract addition in cuatro-portfolio, never added locally.

#### FR-60: Every MVP screen on the contract [new]

**Consequences (testable):**
- Every screen the MVP needs (sign-in and TOTP, dashboard, accounts, feed, import, categories and rules, review queue, budgets, goals, debts and the payment plan, recurring events and subscriptions, forecast, spending report, alert list, connected clients and audit log, settings) is built on the contract. Release 1 builds the screens its FRs need, and Release 2 the rest (§9.3).
- No screen keeps the old palette or components.

#### FR-61: Desktop first, 360px floor [new]

**Consequences (testable):**
- Screens are designed and tested for desktop first; desktop acceptance runs at 1440 by 900 CSS px (A-14).
- At 360 CSS px wide, every screen shows no horizontal page scroll, no clipped or overlapping text, and every action the desktop layout offers, checked automatically per screen and in the FR-58 manual pass.

#### FR-62: Spanish UI and punctuation [new]

**Consequences (testable):**
- All UI text is Spanish and uses Colombian financial terms (cuota, fecha de corte, fecha límite de pago, TRM, EA).
- UI text uses no dash as punctuation (no em dash, en dash, or double hyphen). The owner's writing rule governs here, a recorded deviation from the contract's typography rule.
- Amounts follow R-1 and NFR-2.

## 6. Cross-Cutting NFRs

- **NFR-1 Money representation.** COP and USD are integer minor units; crypto quantities keep their asset's precision. Arithmetic on money happens only in the money layer, enforced by a lint rule that covers identifiers, member expressions, compound assignment, and division (deferred item 6). A computed value is rounded half-even, at one point only: when it is stored or shown. A shown total rounds the exact sum, never the shown rows. When an amount is divided (cuotas, installments, splits), the parts sum exactly to the whole, with the residue on the last part.
- **NFR-2 Time and locale.** Every date is a Bogotá calendar date; scheduled jobs run on the Bogotá date, and end-of-day jobs run after the Bogotá day ends. Amounts render in es-CO conventions: COP with no decimals, USD with two (A-8). Negative amounts use a true minus sign.
- **NFR-3 Accessibility.** WCAG 2.2 AA. On top of it, the contract floor: 44px targets on both axes, a visible focus ring that appears instantly and is never removed, reduced motion honored, no horizontal scroll at 360px, a skip link first, one h1 per page, and body text of 14px or more. Because the automated accessibility checks wired into the contract's review test against WCAG 2.1, the recorded manual pass (FR-58) also checks the four 2.2 criteria that matter here: 2.4.11 Focus Not Obscured (a sticky header never hides the focused element), 2.5.8 Target Size, 3.3.7 Redundant Entry (saved column mappings, nothing asked twice), and 3.3.8 Accessible Authentication (password and TOTP fields accept paste and password managers).
- **NFR-4 Sessions.** This governs the screens. Every session completes TOTP (FR-2). A session ends after 30 minutes idle, meaning no authenticated request for 30 minutes, and after 24 hours in any case.
- **NFR-5 Grants.** This governs tool calls, which run on grants, not sessions. A grant's write scope lapses 30 days after issue and its read scope 90 days after issue; the owner then reconnects with password and TOTP. Revoking a connected client takes effect on its next call. A connected client unused for 30 days is disconnected.
- **NFR-6 Dependencies.** No deploy goes out with a known high or critical advisory in production dependencies, except that a deploy which removes at least one known advisory and adds none may go out. Before the first deploy, the upgrade plan's order in `addendum.md` §4 governs. A new dependency version is adopted only after it has been public for 7 days.
- **NFR-7 Privacy.** No full account number is stored or returned, and no tool response carries a full account number, a credential, or a token. App logs carry no credentials, tokens, account numbers, or transaction contents; the audit log is the only record of transaction contents, and only the owner reads it. A canary test seeds secret-shaped values (a password, a token, a 16-digit number, a description) and fails if any appears in captured logs. Alert emails carry no amounts, balances, merchants, or account details. The app calls no LLM API, and what reaches the AI provider is the owner decision in §7.1. Fixtures, seeds, journeys, and examples are fictional.
- **NFR-8 Data freshness.** Every converted value shows the date of the rate or price it used. A TRM is stale only when no stored TRM covers the date it is used for (R-2); a price older than 2 days is labeled stale.
- **NFR-9 Performance.** Measured as server time to last byte at the 95th percentile, for screens and tool calls alike: any screen within 1 second and any tool call within 2 seconds on the target host, with the host size and the fixture recorded with each run. Until the ledger nears 20.000 transactions, the targets are measured on real data and a modest fictional seed; the 20.000-transaction run happens then. Lighthouse desktop scores on the dashboard and the feed: performance at least 90, accessibility 100.
- **NFR-10 Quality gates.**
  - Typecheck, tests, and lint pass before every push and in continuous checks (FR-17).
  - Lint allows no warning except the five the owner accepted on 2026-11-26 (deferred item 1), each of which goes away when the code carrying it is patched or replaced; no new warning is allowed.
  - Coverage: 100 percent of the money layer's code statements and branches, and 80 percent of lines in request validation, the API routes, and the domain modules (import parsing, duplicates and matches, transfers, categorization, budgets, goals, payoff comparison, payment plan, payment scenarios, forecast, subscriptions).
  - Installment schedules, payoff comparisons, payment scenarios, and the EA to monthly conversion are checked against fixtures computed outside the code, UVR conversion (if FR-23 applies) against published values, and the money layer against negative and zero amounts and at the largest amount it accepts, 99.999.999.999,99 in COP or USD (A-14), with one unit more rejected.
  - The es-CO output is checked for four-digit COP amounts such as 1.234 and for no stray ",00" on COP, and the holiday data is checked against Ley 51 de 1983 for two years, Holy Week included.
  - Every bug fix comes with a regression test.
  - Each journey UJ-1 to UJ-8 has one end-to-end check, with TOTP handled by a test authenticator: the check drives the screens and sends each Claude step as its tool calls through a scripted MCP client, asserting tool responses and stored state, never Claude's wording; Claude's own steps are FR-50's recorded manual check.
- **NFR-11 Operability.** An external monitor checks the health endpoint at least every 5 minutes and emails the owner after 2 failed checks in a row, so the owner learns within 10 minutes that the app is unreachable. A scheduled self-check runs a scripted MCP client against the deployed AI connection every hour (A-12), connecting and making one read, and a failed self-check marks the health endpoint as failing, so the monitor alerts. A failed scheduled job (rates, prices, balance snapshots, backups, restore checks, scans, alert sends, the self-check) shows in the app with its last success time, and a job with no success within twice its interval shows as failed.
- **NFR-12 Cost.** The app runs on one small VPS plus free tiers; no paid API is required. The AI connection relies on the owner's Claude plan (A-15).

## 7. Constraints and Guardrails

### 7.1 Privacy

- The repository is public. No committed file names the owner's institutions, account numbers, balances, personal amounts, income or its type, pay schedule, employer, tax position, or holdings. Journeys and examples use a fictional owner with made-up numbers.
- Statement file formats are described generically. When the build needs real institution names, they live in a git-excluded note under `.private/`. Test fixtures are fictional, never scrubbed real exports.
- Security gaps from the assessment appear in committed files only as required behavior, with the baseline tag and a section pointer.
- Data reaches Claude only through tools the owner authorized, and the app sends nothing to any LLM API (NFR-7).
- Owner decision on provider exposure: the owner accepts that the AI provider receives the ledger data that tool responses carry, and the full content of any statement PDF Claude reads, which carries identity details the tool rules exclude (such as a name, an address, or a full account number). This happens through claude.ai web, Claude Desktop, and Claude Code, under the data settings of the owner's Claude account. To keep the exposure small, read tools answer narrowly by default (FR-52), and capture prefers the in-app XLS or CSV import for any account that offers one, with a PDF through Claude as the fallback (FR-27).
- Operating rule: the finance connector is never combined in one conversation with connectors that can send data out.
- The owner treats a drafted development prompt as untrusted text and reviews it before it reaches a coding agent or a committed file (FR-57).

### 7.2 Safety

- The app never moves money and never contacts an institution: it records and computes.
- Claude's writes are bounded by the one list in FR-54, logged, and undoable (FR-55), and the inputs with the most weight wait for the owner's confirmation (FR-65).
- Threat statement: statement text is untrusted data that returns through read tools in later conversations; a disclosure cannot be undone; and undo protects integrity only when the owner sees the change. So read tools mark statement text and bound its length (FR-52), the server instructions say it is data, never an instruction (FR-57), the alert list and the weekly digest count Claude's writes by type (FR-48, FR-49), and §7.1's operating rule keeps the finance connector apart from connectors that send data out.
- Every figure a tool returns comes from the money layer with its source and the dates of its rates and prices, and compute responses carry a short provenance line (FR-53). The app guarantees its own figures, not Claude's wording; the tool descriptions ask Claude to cite those figures rather than compute its own (A-1).

### 7.3 Cost

- One small VPS and free tiers, plus the owner's Claude plan (NFR-12, A-15).

## 8. Non-Goals

- Not multi-user: one owner, no household or shared access, no sign-up.
- Never moves money, initiates a payment, or connects to an institution.
- No live bank sync and no open-finance connector (decision 2; F7.1-01, F7.1-02, F7.2-11).
- No AI chat inside the app and no LLM API calls from the app: Claude is the AI (decision 4).
- No trading, price alerts, or investment advice engine in the app: Claude reasons, the app computes.
- Not tax filing software in the MVP (decision 6).
- No public demo in the MVP (decision 1).
- No phone surface, PWA install, or push notifications in the MVP.
- No light theme: the contract is dark only.
- Not a restyle of the Anchor's `apps/finance` copy, and not a portfolio work item.

## 9. MVP Scope

### 9.1 In Scope

- Fix-first scope (§5.1: FR-1 to FR-17, FR-63, and FR-64, with upgrade steps U1 to U6 in `addendum.md` §4), before any new feature. Deferred items 3, 4, 5, and 8 in `addendum.md` §5 are the epics step's call.
- Accounts and money (§5.2): savings accounts in COP and USD, credit cards with cuotas, loans, a mortgage, and crypto accounts. The UVR part applies only if Open Question 1 resolves yes.
- Transactions, transfers, file import, and reconciliation (§5.3, §5.4).
- Categorization with rules and the review queue (§5.5).
- Monthly budgets, budget history, goals, and sinking funds (§5.6).
- Credit cards, loans, the payoff comparison, the payment plan, and payment scenarios (§5.7).
- The recurring calendar with planned events and subscriptions, the cash buffer, and the forecast (§5.8); subscription detection is gated (§9.3).
- The dashboard, net worth history, and the spending report (§5.9).
- Email alerts and the optional weekly digest (§5.10).
- The AI connection with read, compute, and write tools, provenance and owner confirmation, the audit log, and undo (§5.11).
- The redesign on the Cuatro design contract (§5.12).

§9.3 splits this scope into Release 1 and Release 2.

### 9.2 Out of Scope for MVP

Deferred, each with its reason and when to revisit, plus the one gated FR and its trigger:

- Public demo, demo seed, and a no-auth demo connector (S8-07, S8-36): personal tool first (decision 1). Revisit once SM-1 holds; the demo then runs as a separate deployment with its own database (decision 7).
- MCP Apps widgets (S8-36): they render only on claude.ai web and Claude Desktop (F7.2-07). Revisit when the tools are stable.
- Bank alert email ingestion (S8-23): a new inbound path. Revisit if conversation and statement files leave gaps.
- Tags and split transactions (S8-42): revisit on a real case.
- Weekly or custom budget periods, and rollovers (S8-02): goals cover irregular costs. Revisit when the owner takes a capability-gap prompt for one to the repository (UJ-7).
- Unusual-charge detection and a daily briefing (S8-34): there is no live feed to watch, and Claude briefs on demand. Revisit if bank alert email ingestion gives the app a live feed.
- Open-data benchmarks (S8-39) and the Sankey report (S8-43): the spending report (FR-47) answers where the money went. Revisit when it leaves a question unanswered.
- Subscription detection (FR-42), gated rather than deferred: its FR stays in §5.8, but a new ledger holds too little history to detect anything. It starts when the ledger holds six months of card and account history; until then subscriptions are recurring expense events (FR-41).
- Per-purchase cash tracking: a cash withdrawal posts as spending under Efectivo (FR-30). Revisit if the owner pays cash often enough to want each purchase categorized.
- The card credit limit, the loan original principal, and audit log filters by connected client and by tool: no FR reads them. Revisit when a feature needs one.
- Tax features: renta readiness, GMF exemption tracking, e-invoice import, and the AFC benefit projection (S8-28, S8-29, S8-31). Revisit once the tax reform filed 2026-10-29 settles (decision 6).
- The phone surface: PWA install, Web Push, passkeys, and app lock (S8-32, S8-33). Revisit once the desktop version works: Release 2 shipped and SM-1 holding. [NOTE FOR PM: until it ships, capture on the go depends on Claude's own phone apps reaching the AI connection (Open Question 2).]
- AFC or FPV, listed stocks and ETFs with their price feeds, and CDTs (S8-04, S8-05, S8-40): outside the list decision 3 keeps. Revisit when the ledger needs one.
- The original plan's other account types and currencies (checking accounts, lines of credit, investment funds, a generic investment account, EUR): outside the list decision 3 keeps. Revisit when the ledger needs one.
- Open Graph tags: they matter only for the public demo (decision 1). Revisit with the public demo.
- Loans indexed to DTF or IBR (R-7). Revisit if an indexed loan needs tracking.
- Optional major dependency upgrades (U7 in `addendum.md`). Revisit after Release 2, or sooner when NFR-6 needs a major version to clear an advisory.

Cut, not deferred: Belvo sync and its columns (S8-09), n8n (S8-10), ExchangeRate-API (S8-11), UVR scraping (S8-12), Alpha Vantage as the primary price source (S8-13), any open-finance connector (S8-14), the payment-timing solver (S8-15), Umami analytics (S8-17), and the Telegram bot (S8-41).

### 9.3 Releases

The release sequence in §10 is binding. Release 1 is the working ledger, and its first deploy is launch; Release 2 holds the planning features and starts after the go/no-go point. An FR split across the two marks its Release 2 consequences "(Release 2)" in its own text.

| Feature | Release 1 | Release 2 | Gated or deferred |
|---|---|---|---|
| §5.1 Trustworthy baseline | FR-1 to FR-17, FR-63, FR-64 | | |
| §5.2 Accounts and money | FR-18 to FR-22; FR-23 only if Open Question 1 resolves yes | | |
| §5.3 Transactions and transfers | FR-24 to FR-26 | | |
| §5.4 File import and reconciliation | FR-27 to FR-29 | | |
| §5.5 Categorization | FR-30 to FR-32 | | |
| §5.6 Budgets and goals | | FR-33 to FR-35 | |
| §5.7 Debt, cards, and payment planning | FR-36 and FR-37, record keeping: cuota counts, due days, statement minimums, and splits | FR-36 and FR-37, the rest: schedules, estimated minimums, and payment spread; FR-38 to FR-40 | |
| §5.8 Recurring calendar, subscriptions, and forecast | | FR-41, FR-43, FR-44 | FR-42, gated until the ledger holds six months of card and account history |
| §5.9 Dashboard, net worth, and reports | FR-45, minimal: landing, net worth, debt summary, review queue count, current through dates | FR-45, the rest: budget status and the lowest forecast balance; FR-46, FR-47 | |
| §5.10 Alerts | FR-48: the email channel and the alert list (with FR-15), and the payment due, new connected client, failed backup or restore check, and repeated failed attempts (FR-64) types, always on | FR-48: the budget and statement expected types and the per-type setting; FR-49 | |
| §5.11 The AI connection | FR-50 to FR-52, FR-54 to FR-57, FR-65, for Release 1 records; FR-53's spending by category for a period | FR-53, the other compute tools; FR-52 and FR-54 for Release 2 records | |
| §5.12 Redesign | FR-58, FR-59, FR-61, FR-62; FR-60 for Release 1 screens | FR-60 for Release 2 screens | |

Everything else in §9.2 is deferred past the MVP.

## 10. Dependencies and Sequencing

The release sequence is binding; §9.3 lists every FR by release.

- **Release 1, the working ledger:** all of §5.1 to §5.4; FR-30 to FR-32; the record-keeping half of FR-36 and FR-37 (cuota counts, due days, statement minimums and splits); a minimal FR-45; FR-48 with four alert types (payment due, new connected client, failed backup or restore check, and FR-64's repeated failed attempts), always on with no per-type setting; the read, write, and capture tools of §5.11, with FR-53's spending by category for a period; and those screens on the contract (§5.12). FR-48's email channel and alert list land with FR-15.
- **Local capture-loop check:** before the VPS work, a local check of the capture loop runs: the AI connection on a local instance with a fictional ledger, driven from Claude Code.
- **Launch:** Release 1's first deploy. It starts the success clock (§11).
- **Go/no-go point:** Release 2 starts only after one statement cycle is reconciled on every account that receives statements.
- **Release 2, the planning features:** FR-33 to FR-35; FR-38 to FR-44, with FR-42 gated; FR-46, FR-47, FR-49, and FR-53's other compute tools; the per-type alert setting and the remaining alert types; the rest of FR-36, FR-37, and FR-45; and their screens on the contract.

Order within and around the releases:

1. Fix-first scope (§5.1) before any new feature (decision 8).
2. Encrypted backups and a passing manual restore check (FR-15) before the auth library upgrade, whose migration can block TOTP for the owner if it goes wrong (U2 in `addendum.md`).
3. The auth library upgrade before the AI connection's authorization (FR-50, FR-51) and before any new sign-in method (FR-8).
4. Every FR in §5.1 passing before the first deploy (decision 7). Apart from the local capture-loop check on a fictional ledger, the AI connection goes live only on the deployed app, reachable over HTTPS.
5. Crypto quantity support in the money layer before crypto accounts (FR-21).
6. The UX step before any redesigned screen is built (§5.12).
7. Outside this repository, owned by the owner in cuatro-portfolio: the Anchor's registry entry for Cuatro Finance becomes a Satellite entry (today it records finance as absorbed into the Anchor, with no token contract), and the Anchor's old `apps/finance` copy is retired or kept on purpose.
8. The money arithmetic lint rule extension (NFR-1, deferred item 6) lands before the first story that adds money arithmetic, which may be FR-11's balance change inside §5.1.

## 11. Success Metrics

*Each SM cross-references the FRs it validates. Counter-metrics counterbalance specific metrics.*

Launch is Release 1's first deploy, and it starts the success clock. Baseline: the app has not been in use, so every metric starts from zero. SM-3 and SM-4 read records that only Release 2 creates, so they count from Release 2's first deploy; the other metrics count from launch. The metrics tool (FR-52) computes every counted metric from recorded data, as counts and percentages with no amounts.

**Primary**
- **SM-1: The ledger is current.** For three consecutive months after launch, every account that receives statements is reconciled for each statement within the allowance the owner sets (A-12), counted from the statement's closing date, with a zero difference and a closing balance the owner entered or confirmed (FR-65). Validates FR-20, FR-26, FR-27, FR-28, FR-29, FR-56, FR-65.
- **SM-2: Claude does the management.** In each of those months, at least 3 of every 4 non-voided transactions enter through Claude or a file import rather than manual entry, counting a transfer once. The metrics tool reports the share by path: Claude capture, rows Claude staged, the in-app import, and manual entry. Validates FR-27, FR-54, FR-56.

**Secondary**
- **SM-3: No missed payment due date** in the first three months after Release 2's first deploy, counted from the occurrences FR-41 flags as missed. Validates FR-39, FR-41, FR-48.
- **SM-4: Every month is budgeted.** From Release 2's first deploy, each month counts when its budgets were written or confirmed after the previous month closed; a limit carried forward with no change or confirmation does not count. Validates FR-33, FR-34.
- **SM-5: Capture ahead of the statement.** The share of each month's statement rows that matched an earlier Claude capture (FR-28), from launch. It has no target in the MVP: it shows whether conversational capture earns its matching cost. Validates FR-28, FR-56.

**Counter-metrics (do not optimize)**
- **SM-C1: Correction rate.** If more than 5 percent of a month's Claude transactions (captured, or staged through the AI connection) are voided, or have their account, amount, currency, date, or direction changed, within 30 days of entry, capture is failing. Match confirmations do not count as corrections. Never push SM-2 up at its expense. Counterbalances SM-2.
- **SM-C2: Time in the app.** An owner judgment, not measured: the thesis is that Claude does the work. Counterbalances any engagement reading of SM-1 and SM-2.
- **SM-C3: Features shipped.** An owner judgment, not measured: a reconciled ledger beats breadth. Counterbalances scope growth against SM-1.

## 12. Open Questions

1. Is the mortgage UVR denominated? The owner checks; the answer decides whether FR-23 applies. Not a blocker: the architecture keeps UVR optional until then.
2. Do Claude's phone apps reach custom connectors? The architecture step verifies before the capture epic, since capture at the moment of spending decides how much conversational capture repeats the statement. It affects capture on the go, not the MVP scope.
3. Are the match window of 3 business days (A-5) and the tolerances of A-11 right? Validate against real statements during the import epic.
4. Which statement file formats does the import build first? The owner writes the git-excluded institution note before the import epic, and FR-27 builds only the parsers it names.
5. How do debits, debt, categories, and chart series read without hue (FR-59)? The UX step decides, and raises a contract addition in cuatro-portfolio if hue proves necessary.
6. Resolved on 2026-11-26: the product name is Cuatro Finance.
7. Which parts of the deployment must be reachable from outside the host? The architecture step answers through `addendum.md` §3.1; until then decision 7's wording stands.

## 13. Assumptions Index

*Every assumption, with where it appears. The owner confirmed A-1 to A-10 on 2026-11-26, accepting A-2 and A-3 without correction after decision 3. The reviewer gate rulings restated A-1 and A-3 and set A-5's window in business days, and A-9 now uses the glossary's alert term. A-11 to A-15, new at the reviewer gate, were confirmed on 2026-11-26 as defaults that the epic building each one revisits (A-11 in the import epic, with Open Question 3).*

- **A-1** (§1, §7.2, FR-57): every figure a tool returns comes from the money layer with its source and the dates of its rates and prices, which the app guarantees; Claude, asked through the tool descriptions, cites those figures rather than computing its own, which the app cannot enforce.
- **A-2** (§4 R-7, FR-37): loans and the mortgage carry a fixed EA rate the owner enters.
- **A-3** (§4 R-4, FR-36): a credit card can carry USD charges beside its COP charges; the app holds them on a linked USD card account.
- **A-4** (§4 R-5, FR-36): a card's interest terms come from its statement terms, entered per card.
- **A-5** (§3, FR-11, FR-26, FR-28, FR-56, §12): the match window is the same account and amount within 3 business days either side, inclusive.
- **A-6** (FR-29): statement reconciliation is in the MVP, because SM-1 measures it.
- **A-7** (FR-35): goal progress counts contributions, not the funding account's balance.
- **A-8** (NFR-2): USD amounts follow es-CO conventions with two decimals.
- **A-9** (FR-48): payment due alerts fire 3 days before the payment due date and on the day.
- **A-10** (FR-25, FR-55): the audit log records writes from every source, so every write can be undone.
- **A-11** (FR-26, FR-28, FR-36, FR-37, FR-41, §12): matching and computation defaults. A staged row within 15 percent of a Claude capture's amount is offered as a match; a cross-currency transfer links at an implied rate within 5 percent of the TRM; a transaction fulfils an occurrence within 10 percent of its amount and 5 business days of its date; a partial first period accrues (1 + EA) raised to the power days/365, minus 1, on the principal, counting actual days.
- **A-12** (FR-15, FR-20, FR-29, FR-49, FR-53, NFR-11, §11): time windows. A statement is expected within 15 days of its closing date, which is also SM-1's default allowance; a current through date older than 35 days is flagged; manual TRM entry is offered when no TRM covers a date 3 days after it; a restore check alert fires with no passing check in 35 days or no backup in 26 hours; the AI connection self-check runs hourly; the weekly digest goes out on Monday at 07:00 Bogotá.
- **A-13** (FR-2, FR-6, FR-48, FR-64): access and alert bounds. Access tokens under a grant live at most 1 hour; after 5 failed attempts within 15 minutes from one source, or 20 within an hour for the account, attempts are refused for 15 minutes; each credential has at least 32 random characters; a new connected client alert is sent within 5 minutes, and a scheduled alert within 1 hour of its job.
- **A-14** (FR-9, FR-22, FR-27, FR-52, FR-61, NFR-10): size and input bounds. Page size 50 by default and 200 at most; import files up to 10 MB or 5.000 rows; statement text fields up to 500 characters; read tools default to totals and the last 30 days; EA rates from 0 to 100 percent, with the monthly equivalent to 2 decimal places; amounts up to 99.999.999.999,99 in COP or USD; desktop acceptance at 1440 by 900 CSS px.
- **A-15** (§1, §5.11, FR-50, NFR-12, §7.3): the owner's Claude plan includes custom connectors in claude.ai web, Claude Desktop, and Claude Code, with enough usage to read a month's statements; FR-50's recorded check confirms it each release.
