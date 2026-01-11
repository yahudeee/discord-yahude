const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('teserror')
    .setDescription('Memunculkan error untuk testing error monitoring'),

  async execute(interaction) {
    throw new Error('Ini error test dari command /teserror!');
  }
};
