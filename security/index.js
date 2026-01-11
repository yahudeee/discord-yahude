const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const folder = path.join(__dirname);
  const files = fs.readdirSync(folder).filter(f => f.endsWith(".js") && f !== "index.js");

  for (const file of files) {
    const mod = require(path.join(folder, file));
    if (typeof mod === "function") mod(client);
  }

  console.log("🛡️ [Security] Semua modul keamanan aktif!");
};