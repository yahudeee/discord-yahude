const badLinks = ["free-nitro", "steamgift", "airdrop", "discord-nitro", "token-grabber"];

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;
    if (badLinks.some(link => message.content.toLowerCase().includes(link))) {
      await message.delete().catch(() => {});
      await message.channel.send(`🚫 ${message.author}, link mencurigakan terdeteksi!`);
      logViolation(message, "Anti-Phishing", message.content);
    }
  });

  function logViolation(message, type, content) {
    const logChannel = message.guild.channels.cache.find(c => c.name === "👻┃yahudeee-log");
    if (logChannel) {
      logChannel.send(`🚨 **${type}** | ${message.author.tag}\n> ${content}`);
    }
  }
};