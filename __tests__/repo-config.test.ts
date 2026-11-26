import { existsSync, readFileSync } from "node:fs";
import { describe, it, expect, vi } from "vitest";

// Resolved from this file, not the cwd, so the checks hold wherever vitest starts.
const fromRoot = (path: string) => new URL(`../${path}`, import.meta.url);

describe("repository config", () => {
  it("loads prisma.config.ts without DATABASE_URL and names a seed script that exists", async () => {
    vi.stubEnv("DATABASE_URL", undefined);
    // A local .env must not refill the variable, or an env() regression would pass.
    vi.doMock("dotenv/config", () => ({}));
    const { default: config } = await import("../prisma.config");
    vi.unstubAllEnvs();
    const script = config.migrations?.seed?.split(" ").at(-1);
    if (!script) throw new Error("prisma.config.ts names no seed script");
    expect(existsSync(fromRoot(script))).toBe(true);
  });

  it("keeps the .private/ and env file rules in the committed .gitignore", () => {
    const lines = readFileSync(fromRoot(".gitignore"), "utf8").split(/\r?\n/);
    expect(lines).toContain(".private/");
    expect(lines).toContain(".env*");
    expect(lines).toContain("!.env.example");
  });
});
