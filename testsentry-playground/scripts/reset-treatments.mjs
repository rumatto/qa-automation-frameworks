// Restorations the intentional TestSentry fixture errors after Apply tests.
//
// Apply tests mutate the live fixture files under tests/ to apply patch
// treatments. This script copies the known-good baseline snapshots from
// baselines/ back into tests/ so the playground returns to its
// intended broken-by-design state.
//
// Behavior:
//   - copies ONLY the known fixture files back into tests/
//   - fails with a clear message if a baseline file is missing
//   - prints each restored file

import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');

const baselinesDir = resolve(repoRoot, 'baselines');
const testsDir = resolve(repoRoot, 'tests');

// Known fixture files that may be mutated by Apply tests and must be restorable.
const fixtureFiles = ['intentional-bugs.spec.ts', 'locator-healing-fixture.spec.ts'];

let failed = false;

for (const file of fixtureFiles) {
  const baselinePath = resolve(baselinesDir, file);
  const targetPath = resolve(testsDir, file);

  if (!existsSync(baselinePath)) {
    console.error(`ERROR: baseline file is missing: ${baselinePath}`);
    failed = true;
    continue;
  }

  // Ensure the target reflects the baseline exactly.
  copyFileSync(baselinePath, targetPath);

  console.log(`Restored: tests/${file}`);
}

if (failed) {
  console.error('\nreset:treatments failed: one or more baseline files were missing.');
  process.exit(1);
}

console.log('\nAll treatment fixtures reset to baseline.');
