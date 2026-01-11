const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {

  data: new SlashCommandBuilder()

    .setName("sendembed")

    .setDescription("Kirim pesan embed ke channel manapun (dengan gambar & mention).")

    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addChannelOption(option =>

      option.setName("channel")

        .setDescription("Pilih channel tujuan.")

        .setRequired(true)

    )

    .addStringOption(option =>

      option.setName("title")

        .setDescription("Judul embed.")

        .setRequired(true)

    )

    .addStringOption(option =>

      option.setName("description")

        .setDescription("Isi pesan embed.")

        .setRequired(true)

    )

    .addStringOption(option =>

      option.setName("color")

        .setDescription("Warna embed (contoh: #00FF00 atau RED).")

        .setRequired(false)

    )

    .addStringOption(option =>

      option.setName("mention")

        .setDescription("Tag user/role (contoh: @everyone, <@123>, <@&456>)")

        .setRequired(false)

    )

    .addStringOption(option =>

      option.setName("imageurl")

        .setDescription("URL gambar untuk ditampilkan di embed.")

        .setRequired(false)

    )

    .addAttachmentOption(option =>

      option.setName("imagefile")

        .setDescription("Upload file gambar untuk embed.")

        .setRequired(false)

    ),

  async execute(interaction) {

    const channel = interaction.options.getChannel("channel");

    const title = interaction.options.getString("title");

    const description = interaction.options.getString("description");

    const color = interaction.options.getString("color") || "#00FFFF";

    const mention = interaction.options.getString("mention") || "";

    const imageURL = interaction.options.getString("imageurl");

    const imageFile = interaction.options.getAttachment("imagefile");

    try {

      const embed = new EmbedBuilder()

        .setTitle(title)

        .setDescription(description)

        .setColor(color)

        .setTimestamp()

        .setFooter({ text: `Dikirim oleh ${interaction.user.tag}` });

      // Jika ada gambar, tambahkan

      if (imageFile) {

        embed.setImage(imageFile.url);

      } else if (imageURL) {

        embed.setImage(imageURL);

      }

      // Kirim pesan ke channel tujuan

      await channel.send({

        content: mention || null,

        embeds: [embed],

      });

      await interaction.reply({

        content: `✅ Pesan embed berhasil dikirim ke ${channel}`,

        ephemeral: true,

      });

    } catch (err) {

      console.error("❌ [SendEmbed] Gagal kirim pesan:", err);

      await interaction.reply({

        content: "❌ Terjadi kesalahan saat mengirim pesan.",

        ephemeral: true,

      });

    }

  },

};