const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const AutoPromo = require("../../events/autoPost");

module.exports = {

  data: new SlashCommandBuilder()

    .setName("autopromo")

    .setDescription("🎯 Kontrol sistem auto-promo produk.")

    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    .addSubcommand(sub =>

      sub

        .setName("start")

        .setDescription("⚡ Hidupkan sistem auto-promo produk.")

    )

    .addSubcommand(sub =>

      sub

        .setName("stop")

        .setDescription("🛑 Matikan sistem auto-promo produk.")

    ),

  async execute(interaction) {

    const sub = interaction.options.getSubcommand();

    const embed = new EmbedBuilder().setColor("#00ffa6").setTimestamp();

    try {

      // Gunakan interaction.client (bukan client dari parameter)

      const client = interaction.client;

      if (sub === "start") {

        await AutoPromo.startPromo(client);

        embed

          .setTitle("✅ AutoPromo Dihidupkan")

          .setDescription(

            "Sistem promo otomatis telah **dihidupkan kembali**.\n" +

            "Bot akan mulai mengirim promo tiap interval yang ditentukan."

          );

      } else if (sub === "stop") {

        AutoPromo.stopPromo();

        embed

          .setTitle("🛑 AutoPromo Dimatikan")

          .setDescription(

            "Sistem promo otomatis telah **dihentikan sementara**.\n" +

            "Gunakan `/autopromo start` untuk mengaktifkannya lagi."

          );

      }

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } catch (err) {

      console.error("❌ [AutoPromo CMD] Error:", err);

      await interaction.reply({

        content: "Terjadi kesalahan saat memproses perintah ini.",

        ephemeral: true,

      });

    }

  },

};