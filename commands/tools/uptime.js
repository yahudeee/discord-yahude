const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('⏱️ Cek berapa lama bot aktif sejak online'),

  async execute(interaction) {
    const totalSeconds = Math.floor(process.uptime());
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const minutes = Math.floor(totalSeconds / 60) % 60;
    const seconds = totalSeconds % 60;

    const uptimeString = [
      days > 0 ? `${days} hari` : null,
      hours > 0 ? `${hours} jam` : null,
      minutes > 0 ? `${minutes} menit` : null,
      `${seconds} detik`
    ].filter(Boolean).join(', ');

    const embed = new EmbedBuilder()
      .setColor('#3498db') // biru soft modern
      .setTitle('🟢 Bot Uptime')
      .setDescription(`Bot aktif selama:\n\n⏳ **${uptimeString}**`)
      .setFooter({ text: 'Yahudeee System Monitor' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};