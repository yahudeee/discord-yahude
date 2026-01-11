const { EmbedBuilder } = require("discord.js");

const fs = require("fs");

const path = require("path");

let promoTimer = null;

let currentIndex = 0;

const stateFile = path.join(__dirname, "../data/autopromo_state.json");

// =======================================================

// 🔹 Simpan / muat status

function saveState(isRunning) {

  fs.writeFileSync(stateFile, JSON.stringify({ running: isRunning }));

}

function loadState() {

  try {

    const data = fs.readFileSync(stateFile, "utf8");

    return JSON.parse(data).running;

  } catch {

    return false;

  }

}

// =======================================================

// 🔹 Jalankan auto promo (ambil dari channel produk)

async function startPromo(client) {

  try {

    if (promoTimer) {

      console.log("⚠️ [AutoPromo] Sudah berjalan.");

      return;

    }

    console.log("✅ [AutoPromo] Sistem promo otomatis dimulai...");

    saveState(true);

    // 🟢 Ganti dengan ID channel kamu

    const sourceChannelId = "1428715626737832047"; // Channel sumber produk

    const targetChannelId = "1428256886347530341"; // Channel tujuan promo

    const intervalMinutes = 30; // Interval kirim promo (menit)

    // ✅ Ambil channel dari cache (lebih cepat & aman)

    const sourceChannel =

      client.channels.cache.get(sourceChannelId) ||

      (await client.channels.fetch(sourceChannelId).catch(() => null));

    const targetChannel =

      client.channels.cache.get(targetChannelId) ||

      (await client.channels.fetch(targetChannelId).catch(() => null));

    if (!sourceChannel || !targetChannel) {

      console.log("❌ [AutoPromo] Channel sumber atau tujuan tidak ditemukan!");

      return;

    }

    console.log(`📦 [AutoPromo] Sumber: #${sourceChannel.name}`);

    console.log(`📢 [AutoPromo] Tujuan: #${targetChannel.name}`);

    // 🔹 Ambil pesan dari channel sumber

    const messages = await sourceChannel.messages.fetch({ limit: 20 });

    const productMessages = Array.from(messages.values()).reverse();

    if (productMessages.length === 0) {

      console.log("❌ [AutoPromo] Tidak ada pesan produk di channel sumber.");

      return;

    }

    promoTimer = setInterval(async () => {

      try {

        const msg = productMessages[currentIndex];

        if (!msg) return;

        let embed;

        if (msg.embeds.length > 0) {

          // Jika pesan sumber ada embed, duplikasi embed

          const srcEmbed = msg.embeds[0];

          embed = EmbedBuilder.from(srcEmbed);

        } else {

          // Kalau teks biasa, bungkus jadi embed baru

          embed = new EmbedBuilder()

            .setColor("#00ffa6")

            .setTitle("🛍️ Promo Produk Baru!")

            .setDescription(msg.content || "Tanpa deskripsi.")

            .setFooter({ text: "🔥 AutoPromo by  Yahudeee Architect's" })

            .setTimestamp();

        }

        await targetChannel.send({ embeds: [embed] });

        console.log(`📢 [AutoPromo] Mengirim promo ke #${targetChannel.name}`);

        // Geser ke produk berikutnya

        currentIndex = (currentIndex + 1) % productMessages.length;

      } catch (err) {

        console.error("❌ [AutoPromo] Gagal mengirim promo:", err);

      }

    }, intervalMinutes * 60 * 1000);

  } catch (err) {

    console.error("❌ [AutoPromo] Terjadi error fatal:", err);

  }

}

// =======================================================

// 🔹 Hentikan auto promo

function stopPromo() {

  if (promoTimer) {

    clearInterval(promoTimer);

    promoTimer = null;

    saveState(false);

    console.log("🛑 [AutoPromo] Promo otomatis dihentikan.");

  } else {

    console.log("⚠️ [AutoPromo] Tidak ada promo yang sedang berjalan.");

  }

}

module.exports = { startPromo, stopPromo, loadState };