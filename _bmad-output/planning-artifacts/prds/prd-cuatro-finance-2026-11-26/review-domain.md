# Review: Colombian domain accuracy

## Verdict

The Colombian rules are mostly right: the TRM model by validity range, the EA to monthly formula, the UVR conversion, the holiday, Bre-B, GMF, and UVT rules, and most tax facts in addendum §6 match what this review knows. The weak spot is credit card and loan mechanics: the minimum payment estimate, the repeated cuota rows on card statements, the amortization and rate assumptions, the USD sub-balance, and extra payments are stated too thinly, and a builder who fills them with generic defaults gets figures that Colombian statements contradict. Several dated facts (the holiday law challenge, the GMF ruling, the tax reform, the DTF end date, the open finance schedule) lie beyond what this review could confirm and need re-checking at their sources.

## Findings

Ordered by severity, which measures how badly a builder would be misled. Line numbers refer to `prd.md` unless marked addendum. This review used no web research. Every check named below is generic and needs no personal detail; where one of the owner's own statements is the best check, compare it privately.

### D-1 (high): the estimated minimum payment leaves out most of a Colombian minimum

- **Location:** R-6 (line 192) read with R-4 (line 190); FR-36 (line 573); FR-44 (line 652); FR-45 (line 669).
- **What may be wrong:** R-4 gives an installment schedule only to purchases in more than 1 cuota, and R-6 builds the estimate between statements "from the installment schedules". A Colombian card's minimum payment also holds every 1-cuota purchase of the cycle in full, interest on the balance, the card's fee (cuota de manejo) and insurance, and any amount left unpaid from earlier cycles. A literal build understates the next minimum, often by most of the cycle's spending. Made-up example: 900.000 of 1-cuota purchases plus one 600.000 purchase in 6 cuotas gives a next minimum of about 1.000.000 plus interest and fees; the schedules alone give about 100.000 plus interest. FR-44 then feeds the understated figure into the forecast at high confidence, which is the cash buffer check UJ-4 relies on. The estimate also needs the cut day to decide which purchases fall in the next statement.
- **Confidence:** high.
- **Verify:** an issuer's published credit card terms (reglamento) and the SFC's consumer guidance on how the minimum payment is formed; privately, one real statement's minimum against its rows.
- **Suggested rule:** estimate = the 1-cuota purchases dated up to the next cut day, in full, plus the next cuota (principal and interest) of each deferred purchase, plus the card's known recurring charges, plus any unpaid amount. Label it an estimate and give it medium confidence in FR-44.

### D-2 (high): card statements repeat running cuota purchases, and the import has no rule for those rows

- **Location:** glossary Duplicate, Near duplicate, and Match (lines 140 to 142); FR-27 (lines 467 to 471); FR-28 (lines 479 to 481); UJ-4 (line 72); FR-54 (line 761); SM-1 (line 936).
- **What may be wrong:** Colombian card statements list each running cuota purchase again on every statement until its last cuota, with its original date, a cuota counter (for example 02/06), and several amount columns (original value, amount billed this period, balance still deferred). The PRD gives a row one date, one description, and one amount. If the column mapping takes the billed amount, every repeat posts as new spending and the card stops reconciling (SM-1). If it takes the original value, the repeats come back every month as duplicates or, when the counter sits in the description, as near duplicates, and the "post a listed duplicate" path invites a double post. Either way the purchase's cuota progress is never updated, and a match with a purchase told to Claude (FR-28, FR-56) keeps the statement's description and date but not its cuota count, so a 6-cuota purchase captured in conversation never gets its schedule.
- **Confidence:** high that the repeats exist; medium on the column layout, which varies by issuer.
- **Verify:** an issuer's guide to reading its statement; privately, two consecutive statements of the same card.
- **Suggested rule:** a staged card row whose cuota counter is above 1 updates the matching cuota purchase instead of posting; a first-cuota row posts the original value once, with its cuota count; a match also takes the statement's cuota count and original value.

### D-3 (medium): the cuota schedule's method and rate are unstated, and the obvious defaults are not the usual Colombian ones

- **Location:** glossary Cuota purchase and Installment schedule (lines 122, 123); R-4 (line 190); R-5 (line 191); FR-36 (line 572); NFR-10 (line 845).
- **What may be wrong:** (a) "an installment schedule at the card's EA rate" names no amortization method. Colombian issuers commonly bill a deferred purchase as equal principal parts (the purchase divided by its cuotas) plus interest on the unpaid principal, so the monthly payment falls over time; a builder will default to a level payment. Made-up example: 1.200.000 in 12 cuotas at 2 percent a month is 124.000 in month 1 and 102.000 in month 12, with 156.000 of total interest, against a level payment of about 113.471 with about 161.660 of interest. The first cuota usually also carries interest for the days between the purchase and the cut. (b) "the card's EA rate" is one static value, but statements show a rate per purchase (the agreed rate and the rate billed that month), card rates usually change from month to month, and some purchases carry their own rate (promotional 0 percent cuotas, fixed-rate offers, balance transfers). (c) Interest terms differ by movement type, not only by card: a cash advance usually accrues interest from the day it is taken and carries a fee. (d) The cuota count can change after the purchase when the owner re-defers it.
- **Confidence:** medium (practice varies by issuer).
- **Verify:** an issuer's published terms and its purchase simulator; the SFC's consumer material on card interest.
- **Suggested rule:** per card, an amortization method (equal principal by default, level payment as the alternative) and a per-purchase rate that defaults to the card's rate and updates from each statement; NFR-10 fixtures for both methods.

### D-4 (medium): splitting loan payments by the app's own schedule will drift from the lender's figures

- **Location:** glossary Transfer (line 135); FR-26 (line 451); FR-37 (lines 581 to 583); addendum §3.6 (line 92); NFR-1 (line 836); SM-1 (line 936).
- **What may be wrong:** FR-26 and FR-37 post principal and interest from the app's computed schedule, which assumes the lender's method. In Colombia: (a) the installment a borrower is billed usually includes mandatory insurance (life insurance on consumer loans and mortgages, fire and earthquake insurance on mortgages), with premiums that change over time, so a billed total entered as "installment" and run through a level schedule books the insurance as principal and the debt falls too fast; (b) housing credit is regulated with several amortization systems, in pesos and in UVR (constant installment, constant principal, and in UVR a cyclical decreasing installment), so a level payment is not a safe default for the mortgage; (c) interest per period follows the lender's day count and the actual payment date, and a late payment adds default interest; (d) a mortgage under a government housing program can carry a rate coverage that lowers the interest the borrower pays; (e) lenders round to the peso by their own rule, not half-even. SM-1 will then show unexplained differences on loans and the mortgage.
- **Confidence:** medium.
- **Verify:** the lender's payment plan (plan de pagos) and statement; the SFC's rules on housing credit amortization systems; the housing finance law.
- **Suggested rule:** as R-6 does for cards, the lender's statement split is authoritative when entered or imported, and the computed schedule is the labeled estimate; FR-37 records the amortization system and keeps the insurance part apart from the installment.

### D-5 (medium): the USD sub-balance conflicts with the one-currency account, and its Colombian behavior is unstated

- **Location:** glossary Account (line 110); R-4 (line 190); FR-20 (line 390); FR-29 (line 489); FR-36 (line 571); FR-56 (line 780); A-3 (line 963).
- **What may be wrong:** the glossary gives each account one currency, and FR-20 and FR-56 take a transaction's currency from its account, yet R-4 lets a card book foreign purchases in a USD sub-balance next to its COP balance. A builder following FR-56 records a USD card charge as COP. On Colombian cards the USD part usually has its own balance and its own minimum on the statement; is paid in USD, or in COP at the issuer's exchange rate on the payment day (not the TRM, so that payment is a conversion under FR-26 with its implied rate); accrues interest in USD; draws on the card's single credit limit; and, depending on the issuer, may be converted to COP when left unpaid. Purchases in other currencies usually reach the USD balance already converted by the card network. Reconciliation (FR-29) then needs two closing balances for one card.
- **Confidence:** high on the inconsistency; medium on the issuer behaviors, which vary.
- **Verify:** the issuer's published terms for international purchases and the dollar balance.

### D-6 (medium): "latest TRM" and the staleness rule do not follow the TRM's validity

- **Location:** glossary Net worth (line 167); R-2 (line 188); FR-20 (line 392); FR-21 (line 402); FR-44 (line 651); FR-45 (line 668); NFR-8 (line 843).
- **What may be wrong:** (a) the SFC certifies the TRM for a date on the afternoon of the previous business day, so a source can already hold a rate whose validity starts tomorrow, and on the last business day before a weekend or holiday it holds the rate for the coming days. "Convert at the latest TRM", built as "the most recently published", converts today's balances at a rate not yet in force and shows a future rate date. (b) One TRM stays in force for four calendar days around each holiday Monday (Saturday to Tuesday) or holiday Friday (Friday to Monday), and for five in Holy Week (Thursday to Monday). NFR-8's "older than 2 days is stale", measured from the validity start or the publication date, labels the correct rate stale on more than ten days a year.
- **Confidence:** high on the validity mechanics; medium on the publication hour.
- **Verify:** the SFC's TRM methodology and the open dataset's validity fields; the central bank's TRM page.
- **Suggested rule:** "latest TRM" means the TRM in force on today's Bogotá date (R-2's own rule), and a TRM is stale only when no stored rate covers today. NFR-10 fixtures for a Saturday, a holiday Monday, the Tuesday after it, and Holy Week.

### D-7 (medium): extra payments: the borrower's choice at each payment and the card's allocation are unstated

- **Location:** glossary Extra payment rule and Payment scenario (lines 128, 164); UJ-4 (line 72); FR-37 (line 581); FR-40 (lines 607 to 611).
- **What may be wrong:** Colombian law lets a borrower prepay COP credit, in whole or in part, without penalty, and choose at each partial prepayment whether it shortens the term or lowers the installment (the 2012 prepayment law for credit below the size ceiling it sets, and the housing finance law for mortgages). A per-loan rule is a fair default, but a scenario for a one-off amount should let both choices be compared. For cards, the PRD never says how a payment above the minimum is applied across the revolving balance and the deferred purchases. UJ-4's figures (7 months sooner, COP 640.000 less interest) depend on it: if the excess lowers each purchase's cuota instead of shortening it, the payoff date barely moves.
- **Confidence:** medium on the law; low on issuers' default allocation.
- **Verify:** Ley 1555 de 2012 and Ley 546 de 1999 as in force; the SFC's consumer rules; the issuer's published terms on payments above the minimum.
- **Suggested rule:** make the card's extra payment allocation a per-card term like R-5, state the assumption in every scenario, and let FR-40 compare term reduction with installment reduction.

### D-8 (medium, only if FR-23 applies): a UVR mortgage's EA is a spread over inflation

- **Location:** glossary Payoff method (line 162); R-7 (line 193); R-8 (line 194); FR-22 (line 411); FR-23 (lines 413 to 420); FR-38 (line 591); FR-40.
- **What may be wrong:** a UVR loan is quoted as UVR plus an EA spread, and its cost in COP compounds that spread with the UVR's growth (inflation). Ranked by the stored EA (avalanche), a UVR mortgage at a made-up UVR plus 7 percent falls below a COP loan at a made-up 11 percent, although it costs more in pesos whenever inflation runs above about 3,7 percent. COP payoff dates, interest totals, and installments computed without UVR growth also come out too low. The schedule itself runs in UVR units and converts at the UVR of each payment date.
- **Confidence:** high.
- **Verify:** the central bank's UVR methodology; the lender's UVR credit terms and payment plan.
- **Suggested rule:** for a UVR mortgage, store the EA as the spread over UVR, run schedules in UVR units, and compare in COP with a stated UVR growth assumption, labeled as an assumption.

### D-9 (low): the statement's printed due date should override the computed one

- **Location:** R-6 (line 192); FR-36 (lines 571, 574); FR-41 (lines 624 to 626); FR-48 (line 700); SM-3 (line 940).
- **What may be wrong:** R-6 makes the statement authoritative only for the minimum. Issuers state their own rule for a due date that falls on a weekend or holiday (some move it later, some earlier), so a reminder or plan built from the day number plus a guessed shift can land after the real deadline, which is what SM-3 measures.
- **Confidence:** medium.
- **Verify:** the issuer's published terms on due dates that fall on non-business days.
- **Suggested rule:** an imported statement's due date and cut date replace the computed ones for that cycle; until then, card and loan due dates shift to the previous business day by default.

### D-10 (low): es-CO formatting details a builder will hit

- **Location:** §0 (line 25); R-1 (line 187); FR-11 (line 299); FR-54 (line 760); NFR-2 (line 837); A-8 (line 968).
- **What may be wrong:** R-1 is correct, but: (a) in Colombia "$" means pesos, so with USD in the same app a bare "$" is ambiguous; R-1 should fix the marker (ISO codes, as the journeys use, or "$" for COP and "US$" for USD). (b) Platform currency formatters follow ISO 4217, which gives COP two minor digits, so a default COP format prints ",00"; Spanish locale data can also drop the group separator in four-digit numbers, so check the es-CO output for amounts like 1.234. (c) Colombian writing often uses an apostrophe as the millions separator (1'500.000), which FR-11 should accept or reject on purpose. (d) No date display order is set; es-CO convention is day, month, year.
- **Confidence:** high on (a), (c), and (d); medium on (b).
- **Verify:** the runtime's number formatting output and the CLDR locale data; no regulator governs this.

### D-11 (low): holidays: name the rule set and test against it

- **Location:** R-9 (line 195); FR-41 (line 627); NFR-10 (line 845); addendum §3.4 (line 75) and §6 (line 138).
- **What may be wrong:** nothing in R-9 is wrong, but it gives the builder no oracle. Colombia has 18 public holidays. Eight never move: 1 January, 1 May, 20 July, 7 August, 8 December, 25 December, Holy Thursday, and Good Friday. Ten move to the following Monday when they do not fall on one, under Ley 51 de 1983: 6 January, 19 March, 29 June, 15 August, 12 October, 1 November, 11 November, and the Easter-based Ascension, Corpus Christi, and Sacred Heart. A library's data can lag or misclassify. This review could not confirm the 2026 holiday law or its legal challenge (F7.2-12).
- **Confidence:** high on the rule set; none on the 2026 law.
- **Verify:** Ley 51 de 1983; the official gazette (Diario Oficial) for any 2026 change; the Constitutional Court's docket.
- **Suggested rule:** NFR-10 checks the holiday data against the rule set for two years, Holy Week included.

### D-12 (low): the seeded categories miss rows that Colombian statements carry every month

- **Location:** FR-30 (line 504).
- **What may be wrong:** besides GMF, savings statements carry monthly interest credits and, above a small daily threshold, withholding tax on those returns; card statements carry the card fee (cuota de manejo) and insurance. Without seeded categories these land in the review queue every month.
- **Confidence:** high that the rows exist; medium on the withholding threshold.
- **Verify:** the tax authority's withholding rules for financial returns; any savings and card statement.

### D-13 (low): UJ-1's card rate may sit above the legal ceiling

- **Location:** UJ-1 (line 60); FR-22 (line 411).
- **What may be wrong:** the SFC certifies the bank current rate each month, and the usury ceiling (one and a half times that rate) caps card and consumer loan rates. The fictional 28,5 percent EA may exceed the 2026 ceiling, so fixtures built from UJ-1 would be implausible. The ceiling also bounds the rate entry check, if a monthly data source is acceptable: an EA above it is a typo, and one near 2 is probably a monthly rate typed as EA.
- **Confidence:** high on the mechanism; low on the 2026 level.
- **Verify:** the SFC's monthly certification of the bank current rate and the usury ceiling.

### D-14 (low): the DTF end date is unconfirmed, and IBR is not quoted as EA

- **Location:** R-3 (line 189); R-7 (line 193); §9.2 (line 913); addendum §6 (line 147).
- **What may be wrong:** this review cannot confirm that DTF stops being the credit reference rate on 2027-01-01. Separately, the central bank publishes IBR per tenor as a nominal rate (with an effective equivalent), and indexed loans usually add a nominal spread, so when DTF or IBR loans return, R-3's "every rate is EA" needs a conversion rule.
- **Confidence:** low on the date; medium on IBR quoting.
- **Verify:** the central bank's and the SFC's publications on the DTF to IBR transition; the central bank's IBR methodology.

### D-15 (low): the deferred tax notes need corrections before the tax features use them

- **Location:** R-12 (line 198); FR-46 (line 678); NFR-1 (line 836); addendum §6 (lines 143, 145, 151).
- **What may be wrong:** (a) the AFC and FPV limits (30 percent of income and 3.800 UVT a year) sit inside the general limit on exempt income and deductions in the general schedule, 40 percent and 1.340 UVT a year since Ley 2277 de 2022; a projection with only the article limits overstates the benefit. (b) The income tax return carries crypto at its tax cost, not its market value (the tax authority's doctrine treats crypto as intangible assets), so addendum line 145 should say which year-end COP value it means. (c) FR-46's year-end snapshots record COP values at the TRM of that day, but the tax statute measures foreign-currency assets at the TRM of their initial recognition; the locked rates already support either, so check before the tax features rely on snapshots. (d) Converting UVT amounts to pesos follows the statute's own rounding rule, not NFR-1's half-even.
- **Confidence:** high on (a) as of the 2022 reform; medium on (b) and (d); low on (c).
- **Verify:** the Estatuto Tributario as amended, and the tax authority's doctrine on crypto and on foreign-currency assets, against the law in force when the features return.

### D-16 (low): dated market and legal facts this review could not confirm

- **Location:** §1 (line 31); §8 (line 872); §9.2 (line 908); addendum §2 (lines 25, 29) and §6 (lines 142, 146, 148 to 150).
- **What may be wrong:** (a) "no provider offers bank sync for Colombian accounts" is stronger than the evidence can be: aggregators have served Colombian banks to businesses at times, and the defensible form is that none serves a personal app affordably. (b) This reviewer's recollection puts the decree that made open finance mandatory in 2025, not April 2026; that recollection is uncertain. (c) Not confirmable here: the Consejo de Estado ruling of 2026-04-06 on the GMF exemption, the tax reform bill filed 2026-10-29, recurring Bre-B debits, the two-month window of the SFC rate dataset, and the aggregator's 2026 coverage and price. None of them changes an MVP decision.
- **Confidence:** low.
- **Verify:** the Ministry of Finance decree and the SFC's open finance circular; the Consejo de Estado's ruling record; the Congress record of the bill; the central bank's Bre-B roadmap; the dataset's page; the vendor's coverage page.

## Confirmed as stated

- R-1: a period for thousands, a comma for decimals, and COP without decimals match Colombian usage; storing centavos (line 116) keeps statement amounts with decimals exact.
- R-2: one TRM in force per calendar date, resolved by validity range, is the right model: a weekend or holiday uses the rate certified on the last business day, which also governs the next business day, not the rate in force on the Friday before.
- R-2 and FR-26: locking the TRM per transaction is a sound valuation rule, and storing the implied rate of a COP to USD conversion rightly keeps the bank's rate apart from the TRM.
- FR-20: the TRM is published ahead of its dates, so a pending rate arises only from a failed fetch or a future date; the fallback is still right.
- R-3: (1 + EA) to the power 1/12, minus 1, is the effective monthly rate that Colombian disclosures print as MV beside the EA.
- R-4: fecha de corte, fecha límite de pago, a cuota count chosen per purchase, and a USD balance on a card are accurate.
- R-5: interest treatment, notably the grace on a 1-cuota purchase paid in full, varies by issuer, so per-card terms are right.
- R-6, first sentence: the statement's minimum is the authoritative figure.
- R-7: fixed-rate consumer, vehicle, and peso mortgage loans are common, and DTF or IBR loans exist; deferring them is coherent.
- R-8: the COP value is the units times the day's UVR; the central bank publishes a UVR for every calendar day, ahead of time and to four decimals, so six decimals for units is a safe superset.
- R-9: America/Bogota is UTC minus 5 all year with no daylight saving, and the Monday moves are law.
- R-10: Bre-B is the central bank's round-the-clock instant payment system for people and merchants; the own-accounts-only transfer rule is right and also covers PSE bill payments, which statements label much like transfers.
- R-11: GMF is 4 per 1.000 on debits, and its own category is right.
- R-12: tax thresholds use the UVT of the tax year, not of the filing year.
- FR-21: valuing crypto at its USD price times the TRM is a sound convention for a COP ledger.
- FR-36, FR-37, FR-41: a monthly day beyond the month's length falls on its last day, as the Commercial Code's rule for terms in months does.
- FR-41: a per-event business-day shift fits practice; the Commercial Code extends a term that ends on a holiday to the following day.
- FR-27: Colombian statement PDFs are commonly password protected, so unlocking them before Claude reads them is right.
- FR-62: cuota, fecha de corte, fecha límite de pago, TRM, and EA are the right Colombian terms.
- Addendum §3.4 (line 71): datos.gov.co dataset 32sa-8pi3 is the SFC's TRM history with validity ranges.
- Addendum §3.4 (line 72): the central bank's SDMX web service is an official UVR source.
- Addendum §6 (line 140): UVT 2025 at COP 49.799 and UVT 2026 at COP 52.374 match the published values as far as this review knows.
- Addendum §6 (line 141): gross assets on 31 December above 4.500 UVT, debts not subtracted, is one of the filing tests for individuals.
- Addendum §6 (line 142), base rule: the 350 UVT monthly GMF exemption on one account the holder marks is the long-standing rule.
- Addendum §6 (line 143): 3.800 UVT a year and a 10-year permanence per contribution are the AFC and FPV article limits (see D-15).
- Addendum §6 (line 144): the 1 percent e-invoice deduction, capped at 240 UVT, with its three conditions, the AttachedDocument wrapper, and the CUFE, is correct.
- Addendum §6 (line 149): both merchant name changes are correct.
