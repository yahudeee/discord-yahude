const { Events, EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    // Abaikan pesan bot
    if (message.author.bot) return;

    // Hanya untuk channel verifikasi
    if (message.channel.id !== config.VERIFY_SUBSCRIBE_ID) return;

    // Ambil attachment
    const attachment = message.attachments.first();

    if (!attachment) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('⚠️ Bukti Subscribe Tidak Ditemukan')
            .setDescription('Kirim **screenshot bukti subscribe** YouTube Yahudeee Architect\'s untuk mendapatkan role **Subscriber** 💫')
            .setFooter({ text: 'Pastikan tangkapan layar jelas dan tidak buram.' })
        ]
      });
    }

    // Validasi hanya file gambar
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(attachment.contentType)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Yellow')
            .setTitle('📁 File Tidak Didukung')
            .setDescription('Kamu hanya boleh mengirim **gambar (.png, .jpg, .jpeg)** sebagai bukti subscribe.')
        ]
      });
    }

    // Ambil role Subscriber
    const subscriberRole = message.guild.roles.cache.get(config.SUBSCRIBER_ROLE_ID);
    if (!subscriberRole) {
      console.log("❌ Role Subscriber tidak ditemukan!");
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('❌ Role Tidak Ditemukan')
            .setDescription('Role **Subscriber** tidak ditemukan di server ini. Hubungi admin.')
        ]
      });
    }

    // Cek apakah user sudah punya role
    if (message.member.roles.cache.has(config.SUBSCRIBER_ROLE_ID)) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Blue')
            .setTitle('✅ Kamu Sudah Terverifikasi')
            .setDescription('Kamu sudah memiliki role **Subscriber** 💚')
        ]
      });
    }

    try {
      // Tambahkan role
      await message.member.roles.add(subscriberRole);

      // Embed sukses untuk user
      const successEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('🎉 Terima Kasih Telah Subscribe!')
        .setDescription(`Hai <@${message.author.id}>! Kamu berhasil mendapatkan role **Subscriber** 💫`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: 'Selamat datang di komunitas yahudeee' });

      await message.reply({ embeds: [successEmbed] });

      // Kirim log ke channel admin
      const logChannel = message.guild.channels.cache.get(config.LOG_CHANNEL_ID);
      if (logChannel) {
        const logEmbed = new EmbedBuilder()
          .setColor('Purple')
          .setTitle('🧾 Log Verifikasi Subscriber')
          .setDescription([
            `👤 **User:** ${message.author.tag} (<@${message.author.id}>)`,
            `🆔 **User ID:** ${message.author.id}`,
            `📷 **Bukti:** [Klik Lihat Gambar](${attachment.url})`,
            `📅 **Tanggal:** <t:${Math.floor(Date.now() / 1000)}:F>`
          ].join('\n'))
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: 'yahudeee | Sistem Verifikasi Otomatis' });

        await logChannel.send({ embeds: [logEmbed] });
      } else {
        console.log("⚠️ Channel log tidak ditemukan!");
      }

      console.log(`✅ ${message.author.tag} berhasil diverifikasi sebagai Subscriber.`);

    } catch (err) {
      console.error("❌ Gagal menambahkan role Subscriber:", err);
      message.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('⚠️ Gagal Menambahkan Role')
            .setDescription('Terjadi kesalahan saat menambahkan role **Subscriber**. Coba lagi nanti.')
        ]
      });
    }
  },
};