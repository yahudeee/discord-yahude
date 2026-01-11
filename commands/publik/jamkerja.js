const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('jamkerja')
    .setDescription('📅 Cek jadwal operasional Matz Store'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🛍️ Jam Operasional Yahudeee Architect\'s')
      .setDescription('Berikut adalah jadwal buka-tutup layanan kami setiap minggunya:')
      .addFields(
        { name: '📅 Senin', value: '⏰ 06:00 - 22:00 WIB', inline: true },
        { name: '📅 Selasa', value: '⏰ 06:00 - 18:00 WIB', inline: true },
        { name: '📅 Rabu', value: '⏰ 06:00 - 22:00 WIB', inline: true },
        { name: '📅 Kamis', value: '⏰ 06:00 - 22:00 WIB', inline: true },
        { name: '📅 Jumat', value: '⏰ 13:00 - 00:00 WIB', inline: true },
        { name: '📅 Sabtu', value: '⏰ 06:00 - 18:00 WIB', inline: true },
        { name: '📅 Minggu', value: '⏰ 06:00 - 00:00 WIB', inline: true },
      )
      .setColor(0x2F3136)
      .setFooter({ text: '📌 Harap melakukan order sesuai jam kerja untuk respon cepat yaa!, Diluar jam kerja juga gapapa asalkan store masih buka' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};