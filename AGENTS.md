# cuatro-finance

Personal finance app for Colombia. One owner, public repository.

## Git workflow

- One branch, `main`. When a change is done and verified, commit it on `main` and push it to `origin main`. No feature branches and no pull requests (owner decision, 2026-11-26).
- There is no CI, so run `pnpm typecheck` and `pnpm test` before pushing a code change.

## Private material

- `docs/finance-guide.docx.md` is the original plan and BMAD's project knowledge folder. It is git-excluded on purpose: lines 45 to 57 and 408 to 413 are owner-private. Never commit the file, and never quote or paraphrase those lines in any file, commit, or web query. Pass the same rule to every subagent that reads it.
