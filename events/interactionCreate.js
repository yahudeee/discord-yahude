const {

  ModalBuilder,

  TextInputBuilder,

  TextInputStyle,

  ActionRowBuilder,

  EmbedBuilder,

} = require('discord.js');

const { VERIFIED_ROLE_ID, LOG_CHANNEL_ID } = require('../config.json');

const cooldowns = new Map();

module.exports = {

  name: 'interactionCreate',

  async execute(interaction) {

    // --- Ketika tombol "Verify" ditekan ---

    if (interaction.isButton() && interaction.customId === 'verify_button') {

      const userId = interaction.user.id;

      const now = Date.now();

      // Anti spam cooldown 60 detik

      if (cooldowns.has(userId) && now - cooldowns.get(userId) < 60000) {

        const remaining = Math.ceil((60000 - (now - cooldowns.get(userId))) / 1000);

        return interaction.reply({

          content: `⏳ Tunggu **${remaining} detik** sebelum mencoba lagi.`,

          ephemeral: true,

        });

      }

      cooldowns.set(userId, now);

      // Buat kode acak

      const code = Math.random().toString(36).substring(2, 7).toUpperCase();

      // Buat modal popup

      const modal = new ModalBuilder()

        .setCustomId(`verify_modal_${code}`)

        .setTitle('🔐 Kode Verifikasi');

      const input = new TextInputBuilder()

        .setCustomId('verify_input')

        .setLabel(`Masukkan kode berikut: ${code}`)

        .setStyle(TextInputStyle.Short)

        .setPlaceholder('Ketik kode di sini...')

        .setRequired(true);

      const row = new ActionRowBuilder().addComponents(input);

      modal.addComponents(row);

      await interaction.showModal(modal);

      // Simpan kode untuk user

      interaction.client.verifyCodes = interaction.client.verifyCodes || {};

      interaction.client.verifyCodes[userId] = code;

    }

    // --- Ketika user mengirim modal ---

    if (interaction.isModalSubmit() && interaction.customId.startsWith('verify_modal_')) {

      const userId = interaction.user.id;

      const inputCode = interaction.fields.getTextInputValue('verify_input').trim().toUpperCase();

      const expectedCode = interaction.client.verifyCodes?.[userId];

      if (!expectedCode) {

        return interaction.reply({

          content: '⚠️ Sesi verifikasi sudah kadaluarsa. Klik tombol lagi untuk memulai ulang.',

          ephemeral: true,

        });

      }

      if (inputCode !== expectedCode) {

        return interaction.reply({

          content: '❌ Kode yang kamu masukkan salah! Coba lagi.',

          ephemeral: true,

        });

      }

      // Hapus kode dari cache

      delete interaction.client.verifyCodes[userId];

      // Tambahkan role verified

      const member = interaction.guild.members.cache.get(userId);

      const verifiedRole = interaction.guild.roles.cache.get(VERIFIED_ROLE_ID);

      if (!verifiedRole) {

        return interaction.reply({

          content: '❌ Role verified tidak ditemukan. Cek config.json!',

          ephemeral: true,

        });

      }

      await member.roles.add(verifiedRole).catch(() => {});

      // Kirim log ke channel log

      const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL_ID);

      if (logChannel) {

        const logEmbed = new EmbedBuilder()

          .setColor('#00ff9d')

          .setTitle('✅ Member Berhasil Diverifikasi')

          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

          .addFields(

            { name: '👤 User', value: `<@${userId}>`, inline: true },

            { name: '🕒 Waktu', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }

          )

          .setFooter({ text: 'yahudeee Verification Logs' })

          .setTimestamp();

        await logChannel.send({ embeds: [logEmbed] });

      }

      // Balas user

      await interaction.reply({

        content: '✅ Verifikasi berhasil! Selamat datang di server 🎉',

        ephemeral: true,

      });

    }

  },

};