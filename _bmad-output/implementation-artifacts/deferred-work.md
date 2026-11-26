# Deferred work

- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Resolve the five lint warnings that `eslint-config-next` 16.4.5 raises on existing code.
  evidence: `react-hooks/incompatible-library` flags `form.watch()` in `app/(app)/accounts/AddAccountModal.tsx` and `app/(app)/accounts/[id]/AddTransactionModal.tsx`, and `@next/next/no-location-assign-relative-destination` flags the full-page redirects at two sites in `app/(auth)/verify-mfa/VerifyMFAForm.tsx` and one in `lib/auth-client.ts`. Fixing them changes form re-render and post-sign-in navigation behavior, which the maintenance spec rules out. The owner accepted them as warnings on 2026-11-26; `pnpm lint` still exits 0. The compiler warnings have no runtime effect while React Compiler stays off.
- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Make a clean-checkout `pnpm install --frozen-lockfile && pnpm build` one of the gates once CI or a deploy job exists.
  evidence: `pnpm build` now runs `prisma generate` first, but no gate builds a tree that lacks the git-ignored `generated/prisma`. AGENTS.md's pre-push checks and both verification-loop layers leave build out on purpose, and there is no CI.
- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Remove `@testing-library/react` and `@testing-library/jest-dom`, or bring back a DOM test environment when component tests are planned.
  evidence: No tracked file imports either package, Vitest runs with `environment: "node"`, and `jsdom` is gone. The maintenance spec kept every other dependency where it was.
- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Bring README.md in line with the repository.
  evidence: It names Next.js 15, a `test:e2e` script, a `docker compose exec pnpm` service and a `prisma/seed/demo.ts` script, none of which exist, plus a GitHub Actions deploy although there is no CI. It also never lists `pnpm lint`. All of this predates the maintenance spec.
- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Make the Prisma CLI, the seed and Next.js read the same env files with the same precedence.
  evidence: `prisma.config.ts` loads only `.env`, through `dotenv/config`. README's setup creates `.env.local`, which Next.js prefers and `prisma/seed/admin.ts` loads without override. So with only `.env.local`, `prisma migrate deploy` sees no `DATABASE_URL`, and with both files, `prisma db seed` takes the values from `.env`. The maintenance spec kept `dotenv/config` on purpose.
- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Extend the money-arithmetic lint rule to member expressions, compound assignment and division.
  evidence: Its selectors in `eslint.config.mjs` only match a bare identifier operand of `+`, `-` and `*`, so `account.balance_centavos + x`, `+=` and `/` pass unflagged. No such code exists today.
- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Clamp the `limit` query parameter of the account transactions list to a positive integer range.
  evidence: `app/api/accounts/[id]/transactions/route.ts` passes `Number(searchParams.get("limit") ?? "50")` to the query unchecked, so a negative, non-numeric or very large value reaches it.
- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Align the `package.json` version with the CHANGELOG's latest release.
  evidence: `package.json` says 0.2.0, while the CHANGELOG's latest section is [0.3.0], dated 2026-03-31.
- source_spec: `_bmad-output/implementation-artifacts/spec-secure-buildable-baseline.md`
  summary: Decide whether `.env.development` should be ignored like `.env` and `.env.production`.
  evidence: No `.gitignore` rule has matched `.env.development`, before or after the maintenance spec. `.env`, `.env.production`, `.env.test` and the `.local` variants are all ignored, and `.env.example` is the tracked template.
