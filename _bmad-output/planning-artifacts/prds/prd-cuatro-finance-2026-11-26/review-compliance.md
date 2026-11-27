# Review: privacy and security compliance

## Verdict

Pass. There is no critical, high, or medium finding, and there are five low ones, all wording changes. Only F1 breaks the letter of a rule (the citation rule, in a reconcile file). F2 to F5 are wording risks or hardening that the owner may accept.

Across the six files: no owner institution, account number, balance, or personal amount appears; no income or its type, pay schedule, employer, tax position, holding name or figure, or threshold status is stated or strongly implied. The owner's accounts appear by type only, and every figure sits in the fictional journeys, in generic examples, or in vendor and public data. Every security item from assessment §4 and §6 appears as required behavior with the baseline tag and a section pointer, with no code path, code line number, port, route, credential, or exploit detail. The guide reconcile cites no line inside either private range and quotes no guide text. No file contains a dash used as punctuation or an emoji.

## Findings

### F1. A security entry restated instead of cited

- Severity: low.
- File and line: `reconcile-assessment.md` line 35 (gap 6).
- Rule: citation rule (a reconcile or review file cites a security gap by input section and line number, never by its text).
- What to change: the Missing line restates part of the reasoning attached to the cited assessment entry (§4 line 52). Drop the clause after its comma and keep the pointer; the Fix line already states the required behavior. The exposure is small, since `.memlog.md` line 12 and this file's line 80 record that entry's advisories as closed.

### F2. Status wording in the fix-first description

- Severity: low.
- File and line: `prd.md` line 204.
- Rule: security rule (a gap appears only as required behavior, the baseline tag, and a section pointer, so no file says the shipped code lacks a protection).
- What to change: the first sentence of the §5.1 description states a status of the shipped code rather than the required result. It names no gap, but next to the baseline FRs and their §4 pointers it undercuts what the baseline tag is for. Reword it as required behavior, for example: "Before any new feature, the core meets the security baseline, its defects are fixed, and it is ready for a first deploy (decision 8)."

### F3. Status wording in the memlog

- Severity: low.
- File and line: `.memlog.md` lines 12 and 14.
- Rule: security rule, as in F2.
- What to change: both lines record a status for the section 4 items instead of only pointing at them. Neither names, locates, or explains a gap. The script cannot edit memlog lines, so the owner either accepts these two as they stand or edits them by hand before commit. Later memlog lines cite security items by section and line, without a status.

### F4. The shipped state of a protection in a parenthetical

- Severity: low (hardening: the entry sits in assessment §5, outside the §4 and §6 lists that the security rule names).
- File and line: `reconcile-assessment.md` line 83.
- Rule: citation rule and security rule.
- What to change: the parenthetical after the pointer to §5 line 87 describes the cited entry's shipped state instead of naming it. Cite it as "§5 line 87 (S5-03)" and keep the disposition, which already states the required behavior.

### F5. The persona disclaimer covers the persona and the numbers, not each detail

- Severity: low (hardening, not a break).
- File and line: `prd.md` line 57, with line 60.
- Rule: privacy rule (journeys use a fictional protagonist with made-up numbers; no holding names).
- What to change: the paragraph declares Mariana and every number fictional, then links her to the owner's role. Her non-numeric specifics, such as the account mix and the crypto asset named at line 60, are not called out as invented, so a reader could take one of them for the owner's. Extend the disclaimer, for example: "Mariana is fictional, and so is every detail and number below; she plays the owner's role in the journeys."

## Files checked

- `prd.md`, 970 lines: read in full. Pass, with F2 and F5. It names no financial institution; the only names are vendors, products, and public rates and payment schemes. The owner's accounts appear by type (lines 37, 364, and 886), and the out-of-scope instrument types stay at type level (lines 910 and 911). Figures appear only in the fictional journeys (lines 57 to 89) and in generic test examples (for example line 401). FR-2 to FR-9 and FR-14 carry the baseline tag, state required behavior, and point to assessment §4, §5, or §6 (FR-9 points to deferred item 7). §7.1 restates the privacy and security rules.
- `addendum.md`, 169 lines: read in full. Pass. It names only vendors, public bodies and data sources, and seed-rule merchants; its figures are vendor prices and public tax values, and §6 states that none of its facts describes the owner's position. The technical and security notes (§3.3, §3.8) describe the planned design, and the upgrade plan cites issue 36 by number only.
- `.memlog.md`, 78 lines: read in full. Pass, with F3. Owner details stay at account type level (for example lines 25 and 40), and decisions cite assessment lines by number.
- `reconcile-assessment.md`, 120 lines: read in full. Pass, with F1 and F4. Its rule compliance section (line 73) found no break in `prd.md` or `addendum.md`; this check also finds none there, only the hardening items F2 and F5.
- `reconcile-deferred-work.md`, 32 lines: read in full. Pass. Configuration, lint, and paging items only, with no personal detail and no security gap.
- `reconcile-finance-guide.md`, 204 lines: read in full. Pass. Every cited guide line and range was checked: none falls inside either private range, no guide text is quoted, and no institution or personal figure appears.

Method and scope:

- Each file was read in chunks of 40 lines or fewer, alongside pattern searches over these files for institution names, crypto asset names, income and employment terms, amounts, account number shapes, and security terms (paths, ports, credentials, advisory IDs).
- Punctuation: a search for the Unicode dash characters and the emoji ranges found none. The only non-ASCII characters are the section sign and Spanish accented letters. The only double hyphens are frontmatter delimiters, one table separator row, and a CSS custom property name.
- The guide was not opened, as instructed, so the check on private guide lines covers the guide reconcile's citations and the absence of quoted guide text; it cannot confirm that uncited wording elsewhere does not paraphrase a private line.
- Assessment §4 and §6 were read only to judge the security items; nothing from them is copied here.
- Out of scope: the review files that other reviewers were writing in this folder at the same time (`review-product-lens.md` and `review-rubric.md` existed at the end of this check). They will be committed too, so each needs the same checks before commit.
