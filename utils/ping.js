const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sinyal')
    .setDescription('🔧 Cek kecepatan respon bot.'),

  async execute(interaction) {
    const sent = await interaction.reply({ content: '🏓 Tes koneksi...', fetchReply: true });
    const pingMs = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = interaction.client.ws.ping;

    const embed = new EmbedBuilder()
      .setTitle('📡 Ping Status')
      .setColor(pingMs < 150 ? 0x57F287 : 0xED4245) // Hijau cepat, merah lambat
      .addFields(
        { name: '📶 Latensi Bot', value: `\`${pingMs}ms\``, inline: true },
        { name: '💻 Discord API', value: `\`${apiLatency}ms\``, inline: true }
      )
      .setFooter({ text: 'Matz tore Bot v2', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.editReply({ content: '✅ Ping berhasil dicek!', embeds: [embed] });
  }
};