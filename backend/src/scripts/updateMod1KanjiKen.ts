// Script wrapper to update Kanji 験 using 100% patent data
import { execSync } from "child_process";

console.log("Menjalankan update data paten untuk Kanji 験...");
execSync("npx ts-node src/scripts/applyMod1PatenData.ts", { stdio: "inherit" });
