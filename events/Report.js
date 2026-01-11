const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require('discord.js');
const { ADMIN_ROLE_ID } = require('../config.json'); // pastikan file config kamu punya ini

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('jawab_')) {

        if (!interaction.member.roles.cache.has(ADMIN_ROLE_ID)) {
          return interaction.reply({ content: '❌ Kamu tidak punya izin untuk membalas report ini.', ephemeral: true });
        }

        const pelaporId = interaction.customId.split('_')[1];

        const modal = new ModalBuilder()
          .setCustomId(`jawabanreport_${pelaporId}_${interaction.message.id}`)
          .setTitle('Jawab Report');

        const input = new TextInputBuilder()
          .setCustomId('jawaban')
          .setLabel('Balasan kamu')
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true);

        const row = new ActionRowBuilder().addComponents(input);
        modal.addComponents(row);

        await interaction.showModal(modal);
      }
    }

    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('jawabanreport_')) {
        const [, pelaporId, messageId] = interaction.customId.split('_');
        const jawaban = interaction.fields.getTextInputValue('jawaban');

        const pelaporUser = await interaction.client.users.fetch(pelaporId).catch(() => null);
        if (pelaporUser) {
          const embed = new EmbedBuilder()
            .setTitle('📨 Jawaban Report')
            .addFields(
              { name: 'Admin', value: `<@${interaction.user.id}>`, inline: true },
              { name: 'Balasan', value: jawaban }
            )
            .setColor('Green')
            .setTimestamp();

          await pelaporUser.send({ embeds: [embed] }).catch(() => {});
        }

        const msg = await interaction.channel.messages.fetch(messageId).catch(() => null);
        if (msg) {
          const components = msg.components.map(row => {
            const newRow = ActionRowBuilder.from(row);
            newRow.components = row.components.map(component => {
              if (component.customId?.startsWith('jawab_')) {
                return ButtonBuilder.from(component).setDisabled(true);
              }
              return component;
            });
            return newRow;
          });

          await msg.edit({ components });
        }

        await interaction.reply({ content: '✅ Jawaban telah dikirim ke pelapor.', ephemeral: true });
      }
    }
  }
};
