const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

const config = require('../../config.json');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('payment')

    .setDescription('🔰 Menampilkan metode pembayaran'),

  async execute(interaction) {

    // 🔒 Cek hak akses

    if (!config.developerIds.includes(interaction.user.id)) {

      return interaction.reply({

        content: '🚫 Kamu tidak punya akses untuk pakai perintah ini.',

        ephemeral: true

      });

    }

    // 🌟 Embed modern

    const embed = new EmbedBuilder()

      .setTitle('💳 | Pilih Metode Pembayaran')

      .setDescription([

        '🔰 **Metode pembayaran tersedia:**',

        '⠀',

        '📱 **DANA** – cepat & mudah',

        '💰 **GoPay** – aman dan instan',

        '🔮 **OVO** – cashback setiap transaksi',

        '🌀 **QRIS** – scan semua bisa!',

        '⠀',

        '> Klik salah satu tombol di bawah ini untuk menampilkan detail metode pembayaran.',

      ].join('\n'))

      .setColor(0x00b0f4)

      .setThumbnail('https://cdn-icons-png.flaticon.com/512/2331/2331947.png')

      .setImage('https://media1.tenor.com/images/b3b66ace65470cba241193b62366dfee/tenor.gif')

      .setFooter({ text: 'CC Performance | Sistem Pembayaran Otomatis 💸' })

      .setTimestamp();

    // 🎛️ Tombol interaktif

    const buttons = new ActionRowBuilder().addComponents(

      new ButtonBuilder()

        .setCustomId('dana')

        .setLabel('📱 DANA')

        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()

        .setCustomId('gopay')

        .setLabel('💰 GoPay')

        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()

        .setCustomId('ovo')

        .setLabel('🔮 OVO')

        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()

        .setCustomId('qris')

        .setLabel('🌀 QRIS')

        .setStyle(ButtonStyle.Danger)

    );

    // ⏳ Respons elegan

    await interaction.deferReply();

    await new Promise(resolve => setTimeout(resolve, 600)); // animasi delay ringan

    // 🚀 Kirim embed + tombol

    await interaction.editReply({

      embeds: [embed],

      components: [buttons]

    });

  }

};