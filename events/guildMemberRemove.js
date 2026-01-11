const { Events, EmbedBuilder } = require("discord.js");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    const channel = member.guild.channels.cache.get("1428403251601997885"); // ganti ID

    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor("#ff5555")
      .setTitle("😢 Member Keluar")
      .setDescription(`Selamat tinggal **${member.user.tag}** 👋\nSemoga sukses di tempat lain!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setImage("https://cdn.discordapp.com/attachments/1274003029632221348/1430831092331712513/7127ba5463d6be06b40da627a0f9e900.jpg?ex=68fb34cb&is=68f9e34b&hm=62a0894756768f6f627bc3c7fa656cb0112b585f5c490d2403ec6de33f1cc7d4&") // 🖼️ gambar latar custom
      .setFooter({ text: "Sampai jumpa lagi!" })
      .setTimestamp();

    await channel.send({ embeds: [embed] });
  },
};