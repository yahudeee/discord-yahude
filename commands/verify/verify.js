const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { VERIFY_CHANNEL_ID } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription('🔐 Kirim pesan verifikasi ke channel yang ditentukan. (Hanya admin)'),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({ content: '🚫 Kamu tidak memiliki izin untuk menjalankan perintah ini.', ephemeral: true });
    }

    const verifyEmbed = new EmbedBuilder()
      .setColor('#00C897')
      .setTitle('✅ Verifikasi Anggota Server')
      .setDescription(
        'Selamat datang di server!\n\n' +
        'Untuk mengakses semua channel, silakan klik tombol **Verifikasi** di bawah ini.\n' +
        'Bot akan mengirimkan kode ke DM kamu. Ketik kembali kode itu dengan benar untuk menyelesaikan verifikasi.'
      )
      .setFooter({ text: 'Yahudeee Architect\'s • Sistem Verifikasi Aman' });

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('startVerify')
        .setLabel('Verifikasi Sekarang')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔐')
    );

    const channel = interaction.guild.channels.cache.get(VERIFY_CHANNEL_ID);
    if (!channel) {
      return interaction.reply({ content: '❌ Channel verifikasi tidak ditemukan! Cek config.json.', ephemeral: true });
    }

    await channel.send({ embeds: [verifyEmbed], components: [button] });
    await interaction.reply({ content: '✅ Pesan verifikasi telah dikirim ke channel!', ephemeral: true });
  }
};