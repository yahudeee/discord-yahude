// commands/utility/aimode.js
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

const modeFile = path.join(__dirname, "../../data/ai_mode.json");
if (!fs.existsSync(path.dirname(modeFile))) fs.mkdirSync(path.dirname(modeFile), { recursive: true });

let userMode = fs.existsSync(modeFile)
  ? JSON.parse(fs.readFileSync(modeFile, "utf8"))
  : {};

function saveMode() {
  fs.writeFileSync(modeFile, JSON.stringify(userMode, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("aimode")
    .setDescription("🧠 Ubah gaya bicara AI")
    .addStringOption(opt =>
      opt
        .setName("gaya")
        .setDescription("Pilih gaya bicara AI")
        .setRequired(true)
        .addChoices(
          { name: "Default (Normal)", value: "default" },
          { name: "Lucu", value: "lucu" },
          { name: "Formal", value: "formal" },
          { name: "Galak", value: "galak" },
          { name: "Bucin", value: "bucin" }
        )
    ),

  async execute(interaction) {
    const gaya = interaction.options.getString("gaya");
    userMode[interaction.user.id] = gaya;
    saveMode();

    const embed = new EmbedBuilder()
      .setColor("#00ff80")
      .setTitle("🎭 Mode AI Berubah")
      .setDescription(`Gaya bicara AI kamu sekarang: **${gaya.toUpperCase()}**`)
      .setFooter({ text: "Yahudeee AI - Personality System" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};