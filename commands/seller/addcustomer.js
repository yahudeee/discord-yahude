const { SlashCommandBuilder } = require('discord.js');
const { SELLER_ROLE_ID, BUYER_ROLE_ID } = require('../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addcust')
    .setDescription('Menambahkan role Buyer ke user tertentu.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('User yang ingin diberi role Buyer')
        .setRequired(true)
    ),

  async execute(interaction) {

    if (!interaction.member.roles.cache.has(SELLER_ROLE_ID)) {
      return interaction.reply({
        content: '❌ Kamu tidak memiliki izin untuk menggunakan perintah ini.',
        ephemeral: true
      });
    }

    const user = interaction.options.getUser('user');
    const member = await interaction.guild.members.fetch(user.id).catch(() => null); // Lebih aman daripada cache langsung
    const buyerRole = interaction.guild.roles.cache.get(BUYER_ROLE_ID);

    if (!member) {
      return interaction.reply({
        content: '❌ User tidak ditemukan di server ini.',
        ephemeral: true
      });
    }

    if (!buyerRole) {
      return interaction.reply({
        content: '❌ Role Buyer tidak ditemukan.',
        ephemeral: true
      });
    }

    if (member.roles.cache.has(BUYER_ROLE_ID)) {
      return interaction.reply({
        content: '⚠️ User ini sudah memiliki role Buyer.',
        ephemeral: true
      });
    }

    await member.roles.add(buyerRole).catch(err => {
      console.error('Gagal menambahkan role:', err);
      return interaction.reply({
        content: '❌ Terjadi kesalahan saat menambahkan role.',
        ephemeral: true
      });
    });

    return interaction.reply({
      content: `✅ Berhasil menambahkan role Buyer ke <@${user.id}>.`,
      ephemeral: false
    });
  }
};
