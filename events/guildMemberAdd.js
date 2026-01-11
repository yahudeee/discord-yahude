const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    const channel = member.guild.channels.cache.get("1428403182463225999"); // ganti ID

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#00ff88")
      .setTitle("🎉 Selamat Datang di Server!")
      .setDescription(`Halo ${member}, selamat datang di **${member.guild.name}**! 🎊`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage("https://cdn.discordapp.com/attachments/1274003029632221348/1430831080252117042/b627f1b16dc40ad2be53cb1d8789aa4f.jpg?ex=68fb34c9&is=68f9e349&hm=82aeb99d3891c671c99e3601d548116ee1398a78408ee0139605d631f20d28c4&") // 🖼️ gambar latar custom
      .setFooter({ text: "Semoga betah ya!" })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};