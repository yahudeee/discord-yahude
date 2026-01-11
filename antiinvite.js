module.exports = (client) => {

  client.on("messageCreate", async (message) => {

    if (!message.guild || message.author.bot) return;

    // Regex untuk deteksi link Discord

    const inviteRegex = /(discord\.gg|discord\.me|discord\.io|discord\.com\/invite)/i;

    // Ganti dengan nama role yang boleh kirim link

    const allowedRoleName = "Partnership";

    // Jika user punya role partnership, abaikan

    const member = message.member;

    if (member.roles.cache.some(role => role.name.toLowerCase() === allowedRoleName.toLowerCase())) return;

    // Jika pesan mengandung link dan bukan dari role Partnership

    if (inviteRegex.test(message.content)) {

      await message.delete().catch(() => {});

      await message.channel.send(`🚫 ${message.author}, tautan invite **tidak diizinkan** di sini kecuali kamu memiliki role **${allowedRoleName}**.`);

      logViolation(message, "Anti-Invite", message.content);

    }

  });

  function logViolation(message, type, content) {

    // Ganti nama channel log sesuai server kamu

    const logChannel = message.guild.channels.cache.find(c => c.name === "👻┃yahudeee-log");

    if (logChannel) {

      logChannel.send({

        content: `⚠️ **${type}** | ${message.author.tag} (${message.author.id})\n> ${content}`

      });

    }

  }

};