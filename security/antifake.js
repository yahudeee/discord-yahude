module.exports = (client) => {
  client.on("guildMemberAdd", (member) => {
    const accountAge = Date.now() - member.user.createdTimestamp;
    const minAge = 1000 * 60 * 60 * 24 * 3; // 3 hari

    if (accountAge < minAge) {
      member.kick("Akun terlalu baru (kemungkinan fake/bot)");
      const logChannel = member.guild.channels.cache.find(c => c.name === "👻┃yahudeee-log");
      if (logChannel) {
        logChannel.send(`👋 ${member.user.tag} di-kick karena akun baru (<3 hari).`);
      }
    }
  });
};