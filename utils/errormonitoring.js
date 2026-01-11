const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = (client) => {
  global.client = client;

  process.on('uncaughtException', async (err) => {
    console.error('❌ [uncaughtException]', err);

    try {
      const channel = await client.channels.fetch(config.statusChannelId).catch(() => null);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle('💥 Uncaught Exception')
        .setDescription(`\`\`\`js\n${err.message}\n\`\`\``)
        .setColor('Red')
        .setTimestamp();

      channel.send({ embeds: [embed] }).catch(() => null);
    } catch (_) {
      
    }
  });


  process.on('unhandledRejection', async (reason) => {
    console.error('⚠️ [unhandledRejection]', reason);

    try {
      const channel = await client.channels.fetch(config.statusChannelId).catch(() => null);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle('⚠️ Unhandled Promise Rejection')
        .setDescription(`\`\`\`js\n${reason instanceof Error ? reason.message : reason}\n\`\`\``)
        .setColor('Orange')
        .setTimestamp();

      channel.send({ embeds: [embed] }).catch(() => null);
    } catch (_) {
    
    }
  });
};