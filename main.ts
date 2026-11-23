// One Word, First Thought — writes exactly one word to /output/entry.txt
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "petrichor";
// Petrichor is the smell of rain on dry earth: one word, one clear image, no filler.

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "output";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const chars = [...WORD].length;
if (chars < 1 || chars > 24) fail(`word must be 1-24 characters, got ${chars}`);
if (WORD.trim().length === 0) fail("word must not be only whitespace");
if (/\s/.test(WORD)) fail("entry must be exactly one word");

mkdirSync(outDir, { recursive: true });
// Clear the output dir's CONTENTS only — never rmSync the dir itself (it may be a mount point).
for (const f of readdirSync(outDir)) rmSync(join(outDir, f), { recursive: true, force: true });
writeFileSync(join(outDir, "entry.txt"), WORD, "utf8");
// Nine letters, no newline: the word is the whole entry, and smaller wins the tie-break.
// Read back and confirm the file is byte-exact before reporting success.
if (readFileSync(join(outDir, "entry.txt"), "utf8") !== WORD) {
  fail("entry.txt read-back mismatch");
}
