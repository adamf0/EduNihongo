// Script wrapper to update Kanji 答 using 100% patent data
import { execSync } from "child_process";

console.log("Menjalankan update data paten untuk Kanji 答...");
execSync("npx ts-node src/scripts/applyMod1PatenData.ts", { stdio: "inherit" });
