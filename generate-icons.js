import sharp from "sharp";
import fs from "fs";
import path from "path";

const input = path.resolve("icons/icon.svg");
const sizes = [16, 48, 128];

(async () => {
  try {
    if (!fs.existsSync("icons")) fs.mkdirSync("icons");
    for (const size of sizes) {
      await sharp(input)
        .resize(size, size)
        .png()
        .toFile(`icons/icon${size}.png`);
    }
    console.log("✅ icons generated");
  } catch (e) {
    console.error("❌ icon generation failed:", e);
  }
})();

