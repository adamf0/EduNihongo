// Script wrapper to update Kanji 試 using 100% patent data
import { execSync } from "child_process";

console.log("Menjalankan update data paten untuk Kanji 試...");
execSync("npx ts-node src/scripts/applyMod1PatenData.ts", { stdio: "inherit" });
