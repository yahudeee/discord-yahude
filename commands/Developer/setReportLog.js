const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setreportlog')
    .setDescription('Atur channel log untuk laporan report')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Channel tujuan log laporan')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;

    if (!config.developerIds.includes(userId)) {
      return interaction.reply({
        content: '❌ Kamu tidak memiliki izin untuk menggunakan command ini.',
        ephemeral: true
      });
    }

    const channel = interaction.options.getChannel('channel');
    const filePath = path.join(__dirname, '../../data/reportlog.json');

    const data = {
      channelId: channel.id
    };

    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(err);
        return interaction.reply({
          content: '❌ Gagal menyimpan konfigurasi channel.',
          ephemeral: true
        });
      }

      interaction.reply({
        content: `✅ Channel log berhasil diatur ke <#${channel.id}>`,
        ephemeral: true
      });
    });
  }
};
