const {

  SlashCommandBuilder,

  ActionRowBuilder,

  ButtonBuilder,

  ButtonStyle,

  EmbedBuilder,

} = require('discord.js');

module.exports = {

  data: new SlashCommandBuilder()

    .setName('verifysetup')

    .setDescription('📋 Kirim pesan verifikasi dengan tombol popup.'),

  async execute(interaction) {

    const embed = new EmbedBuilder()

      .setColor('#00b0f4')

      .setTitle('🔒 Verifikasi Anggota')

      .setDescription(

        'Selamat datang di **yahudeee Server**!\n\nKlik tombol **Verify** di bawah untuk memulai proses verifikasi.\nKamu akan diminta memasukkan kode acak di popup untuk memastikan kamu bukan bot 🤖.'

      )

      .setImage('https://cdn.discordapp.com/attachments/1274003029632221348/1428392261108105388/file_000000005f2c6230bea8d5a12ffdfb20.png?ex=68fae735&is=68f995b5&hm=73e27bf257c81c3a5b1ce7064c84f6603b9a997f821b8dced2940cab0cc5dfa5&') // ganti dengan URL gambar banner kamu

      .setFooter({ text: 'yahudeee Verification System • Aman & Cepat' })

      .setTimestamp();

    const button = new ButtonBuilder()

      .setCustomId('verify_button')

      .setLabel('✅ Verify Sekarang')

      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({

      embeds: [embed],

      components: [row],

    });

  },

};