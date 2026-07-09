import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import JavaScriptObfuscator from "javascript-obfuscator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distAssetsDir = path.resolve(__dirname, "../dist/assets");

if (!fs.existsSync(distAssetsDir)) {
  console.error("Direktori dist/assets tidak ditemukan. Harap jalankan 'npm run build' terlebih dahulu.");
  process.exit(1);
}

const files = fs.readdirSync(distAssetsDir);
const jsFiles = files.filter(f => f.endsWith(".js"));

console.log(`Memulai proses obfuskasi untuk ${jsFiles.length} file JavaScript produksi...`);

jsFiles.forEach(file => {
  const filePath = path.join(distAssetsDir, file);
  console.log(`Mengobfuskasi file: ${file}`);
  const code = fs.readFileSync(filePath, "utf8");
  
  const obfuscationResult = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: false, // Dinonaktifkan agar tidak merusak stack React
    deadCodeInjection: false, // Dinonaktifkan untuk stabilitas performa runtime
    identifierNamesGenerator: "hexadecimal",
    renameGlobals: false, // Wajib false untuk kompatibilitas ES Modules/Vite
    stringArray: true,
    stringArrayEncoding: ["base64"], // Enkripsi string
    stringArrayThreshold: 0.75,
    transformObjectKeys: false, // Wajib false agar property React props/children tidak terganggu
    splitStrings: false, // Wajib false agar dynamic import Vite tidak pecah
    unicodeEscapeSequence: false
  });
  
  fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode(), "utf8");
  console.log(`Berhasil mengobfuskasi file: ${file}`);
});

console.log("Proses obfuskasi seluruh kode produksi JavaScript selesai dengan sukses!");
process.exit(0);
