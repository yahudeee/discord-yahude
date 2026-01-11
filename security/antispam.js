const userMessages = new Map();

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (!message.guild || message.author.bot) return;

    const now = Date.now();
    const timestamps = userMessages.get(message.author.id) || [];
    const filtered = timestamps.filter(t => now - t < 5000); // 5 detik terakhir
    filtered.push(now);
    userMessages.set(message.author.id, filtered);

    if (filtered.length >= 5) { // lebih dari 5 pesan dalam 5 detik
      await message.member.timeout(30_000, "Spam terdeteksi"); // 30 detik timeout
      message.channel.send(`⚠️ ${message.author} dihentikan sementara karena spam!`);
      logViolation(message, "Anti-Spam", `${filtered.length} pesan/5s`);
    }
  });

  function logViolation(message, type, content) {
    const logChannel = message.guild.channels.cache.find(c => c.name === "👻┃yahudeee-log");
    if (logChannel) {
      logChannel.send(`⚠️ **${type}** | ${message.author.tag}\n> ${content}`);
    }
  }
};