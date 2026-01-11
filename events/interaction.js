const { EmbedBuilder, ComponentType } = require('discord.js');
const { MEMBER_ROLE_ID } = require('../config.json');

// Fungsi untuk membuat kode acak (CAPTCHA sederhana)
function generateCode(length = 5) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;
    if (interaction.customId !== 'startVerify') return;

    const user = interaction.user;
    const code = generateCode();

    try {
      // Kirim kode ke DM user
      await user.send({
        embeds: [
          new EmbedBuilder()
            .setColor('#FFD93D')
            .setTitle('🔐 Verifikasi Yahudeee Architect\'s')
            .setDescription(
              `Hai **${user.username}**!\n\nBerikut adalah kode verifikasi kamu:\n\n` +
              `> 🧩 **${code}**\n\nKirim kembali kode ini ke DM bot agar bisa diverifikasi.`
            )
            .setFooter({ text: 'Kode akan kedaluwarsa dalam 2 menit.' })
        ]
      });

      await interaction.reply({ content: '📩 Cek DM kamu untuk melanjutkan verifikasi!', ephemeral: true });
    } catch {
      return interaction.reply({
        content: '⚠️ Tidak bisa mengirim DM! Pastikan kamu mengaktifkan DM dari server ini.',
        ephemeral: true
      });
    }

    // Tunggu balasan user di DM
    const dm = await user.createDM();
    const filter = msg => msg.author.id === user.id;
    const collector = dm.createMessageCollector({ filter, time: 120000, max: 1 });

    collector.on('collect', async msg => {
      if (msg.content.trim().toUpperCase() === code) {
        const guild = interaction.guild;
        const member = await guild.members.fetch(user.id);
        await member.roles.add(MEMBER_ROLE_ID);

        await user.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#00C897')
              .setTitle('✅ Verifikasi Berhasil!')
              .setDescription('Selamat! Kamu sekarang telah diverifikasi dan mendapatkan akses penuh ke server.')
          ]
        });
      } else {
        await user.send({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF6B6B')
              .setTitle('❌ Verifikasi Gagal')
              .setDescription('Kode yang kamu masukkan salah. Coba lagi dengan menekan tombol **Verifikasi** di server.')
          ]
        });
      }
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        user.send('⏰ Waktu habis! Silakan tekan tombol **Verifikasi** di server untuk mencoba lagi.');
      }
    });
  }
};
