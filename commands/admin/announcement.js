const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

const ANNOUNCE_CHANNEL_ID = '1454952479656644661'; // Ganti sesuai channel kamu

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ann')
    .setDescription('📢 Kirim pengumuman ke channel utama')
    .addStringOption(o =>
      o.setName('judul')
        .setDescription('Judul pengumuman')
        .setRequired(true))
    .addStringOption(o =>
      o.setName('deskripsi')
        .setDescription('Isi pengumuman')
        .setRequired(true))
    .addAttachmentOption(o =>
      o.setName('gambar')
        .setDescription('Gambar opsional')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const judul = interaction.options.getString('judul');
    const deskripsi = interaction.options.getString('deskripsi');
    const gambar = interaction.options.getAttachment('gambar');

    const channel = interaction.client.channels.cache.get(ANNOUNCE_CHANNEL_ID);
    if (!channel) {
      return interaction.reply({ content: '❌ Channel announcement tidak ditemukan.', ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setTitle(`📢 ${judul}`)
      .setDescription(deskripsi)
      .setColor('Yellow')
      .setTimestamp();

    if (gambar) embed.setImage(gambar.url);

    await channel.send({
      content: `@everyone`,
      embeds: [embed]
    });

    await interaction.reply({
      content: `✅ Pengumuman berhasil dikirim ke <#${ANNOUNCE_CHANNEL_ID}>`,
      ephemeral: true
    });
  }
};