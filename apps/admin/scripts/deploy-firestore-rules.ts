/**
 * Firestore rules — deploy
 * Run with: npx tsx scripts/deploy-firestore-rules.ts            (dry run: shows what would change)
 *           npx tsx scripts/deploy-firestore-rules.ts --deploy   (puts firestore.rules live)
 *
 * Run `npm run test:rules` from the monorepo root first: it checks the rules against
 * every read and write the apps make, in the emulator.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cert, initializeApp } from "firebase-admin/app";
import { getSecurityRules } from "firebase-admin/security-rules";

const SERVICE_ACCOUNT_PATH = "./scripts/serviceAccountKey.json";
const RULES_PATH = join("..", "..", "firestore.rules");
const deploy = process.argv.includes("--deploy");

initializeApp({ credential: cert(JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, "utf8"))) });
const rules = getSecurityRules();

async function main() {
  const source = readFileSync(RULES_PATH, "utf8");
  const live = await rules.getFirestoreRuleset();
  const liveSource = live.source.map((f) => f.content).join("\n");

  console.log(`Live ruleset: ${live.name}, created ${live.createTime}`);
  if (liveSource.trim() === source.trim()) {
    console.log("The live rules already match firestore.rules. Nothing to deploy.");
    return;
  }
  console.log("\n--- live rules ---\n" + liveSource);
  console.log("\n--- firestore.rules (would replace them) ---\n" + source);

  if (!deploy) {
    console.log("Dry run. Run again with --deploy to put firestore.rules live.");
    return;
  }
  const ruleset = await rules.releaseFirestoreRulesetFromSource(source);
  console.log(`Deployed ruleset ${ruleset.name} (${ruleset.createTime}).`);
  console.log(`To roll back, release the previous ruleset ${live.name} from the Firebase console.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
