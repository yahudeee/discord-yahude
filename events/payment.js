const { EmbedBuilder } = require('discord.js');

client.on('interactionCreate', async interaction => {

  if (!interaction.isButton()) return;

  // Daftar ID tombol valid

  const validIds = ['dana', 'gopay', 'ovo', 'qris'];

  if (!validIds.includes(interaction.customId)) return;

  let embed;

  const baseColor = 0x00b0f4; // Biru modern

  const userTag = interaction.user.tag;

  switch (interaction.customId) {

    case 'dana':

      embed = new EmbedBuilder()

        .setTitle('📱 Pembayaran via DANA')

        .setDescription([

          '💠 **Silakan transfer ke nomor berikut:**',

          '```0831-1721-8961```',
          '**a/n Sartana Putra**',

          '',

          '📤 Setelah transfer, kirim **bukti pembayaran** ke admin atau ticket support.',

          '',

          '> ⚠️ Pastikan nominal sesuai sebelum mengirim.'

        ].join('\n'))

        .setColor(baseColor)

        .setThumbnail('https://i.imgur.com/iTsL55O.png')

        .setFooter({ text: `Permintaan oleh ${userTag} • Yahudeee Architect's 💳` })

        .setTimestamp();

      break;

    case 'gopay':

      embed = new EmbedBuilder()

        .setTitle('💰 Pembayaran via GoPay')

        .setDescription([

          '💠 **Silakan transfer ke nomor berikut:**',

          '```Maaf Pembayaran Via GoPay Sedang Dalam Perbaikan```',

          '📤 Kirim bukti transfer ke admin untuk verifikasi.',

          '',

          '> ⚠️ Harap gunakan nominal yang sesuai agar proses cepat.'

        ].join('\n'))

        .setColor(0x00ff99)

        .setThumbnail('https://i.imgur.com/e7dsdbH.png')

        .setFooter({ text: `Permintaan oleh ${userTag} • Yahudeee Architect's 💳` })

        .setTimestamp();

      break;

    case 'ovo':

      embed = new EmbedBuilder()

        .setTitle('🔮 Pembayaran via OVO')

        .setDescription('🚧 **Coming Soon!**\nMetode ini belum aktif, silakan gunakan DANA atau GoPay sementara waktu.')

        .setColor(0x9b59b6)

        .setThumbnail('https://cdn-icons-png.flaticon.com/512/5968/5968880.png')

        .setFooter({ text: 'Segera hadir di Yahudeee Architect\'s 💫' })

        .setTimestamp();

      break;

    case 'qris':

      embed = new EmbedBuilder()

        .setTitle('🌀 Pembayaran via QRIS')

        .setDescription('📷 Scan QR Code di bawah ini menggunakan aplikasi e-wallet kamu:')

        .setImage('https://i.imgur.com/LC1Oz8B.png')

        .setColor(0xf7ff00)

        .setFooter({ text: `Diproses otomatis oleh Yahudeee Architect's ⚡` })

        .setTimestamp();

      break;

  }

  try {

    await interaction.reply({

      embeds: [embed],

      ephemeral: true

    });

  } catch (err) {

    console.error('❌ Gagal kirim embed pembayaran:', err);

  }

});