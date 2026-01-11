const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const data = require('../../data/reportlog.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('🚨 Laporkan pelanggaran ke admin')
    .addUserOption(option =>
      option.setName('pelaku').setDescription('Pengguna yang ingin kamu laporkan').setRequired(true))
    .addStringOption(option =>
      option.setName('alasan').setDescription('Alasan pelaporan').setRequired(true))
    .addAttachmentOption(option =>
      option.setName('bukti').setDescription('Lampirkan bukti gambar').setRequired(true)),

  async execute(interaction) {
    const pelapor = interaction.user;
    const pelaku = interaction.options.getUser('pelaku');
    const alasan = interaction.options.getString('alasan');
    const bukti = interaction.options.getAttachment('bukti');

    let logChannel;
    try {
      logChannel = await interaction.client.channels.fetch(data.channelId);
    } catch (err) {
      console.error('[REPORT ERROR] Gagal fetch channel:', err);
      return interaction.reply({
        content: '❌ Gagal menemukan channel log. Cek konfigurasi dan izin bot.',
        ephemeral: true
      });
    }

    if (!logChannel) {
      return interaction.reply({
        content: '❌ Channel log tidak ditemukan.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('📨 Laporan Pengguna Masuk')
      .setDescription('Sebuah laporan baru telah diterima. Admin mohon segera ditindak.')
      .addFields(
        { name: '👤 Pelapor', value: `<@${pelapor.id}>`, inline: true },
        { name: '🚫 Pelaku', value: `<@${pelaku.id}>`, inline: true },
        { name: '📄 Alasan', value: `> ${alasan}`, inline: false }
      )
      .setColor(0xED4245) // merah modern
      .setTimestamp()
      .setFooter({ text: 'Matz Report System', iconURL: pelapor.displayAvatarURL() });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`jawab_${pelapor.id}`)
        .setLabel('📬 Jawab Laporan')
        .setStyle(1)
    );

    await interaction.deferReply({ ephemeral: true });

    if (bukti) {
      embed.setImage(`attachment://${bukti.name}`);
      await logChannel.send({
        embeds: [embed],
        components: [button],
        files: [bukti]
      });
    } else {
      await logChannel.send({ embeds: [embed], components: [button] });
    }

    await interaction.editReply({
      content: '✅ Laporan kamu telah dikirim ke tim admin. Terima kasih telah membantu menjaga komunitas tetap aman.',
    });
  }
};