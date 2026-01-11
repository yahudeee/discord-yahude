const {

  SlashCommandBuilder,

  EmbedBuilder,

  ButtonBuilder,

  ActionRowBuilder,

  ButtonStyle,

  PermissionFlagsBits,

} = require("discord.js");

const ms = require("ms");

module.exports = {

  data: new SlashCommandBuilder()

    .setName("giveaway")

    .setDescription("🎉 Buat atau reroll giveaway")

    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

    .addSubcommand(sub =>

      sub

        .setName("start")

        .setDescription("Mulai giveaway baru")

        .addStringOption(opt =>

          opt.setName("hadiah").setDescription("Hadiah giveaway").setRequired(true)

        )

        .addStringOption(opt =>

          opt.setName("durasi").setDescription("Durasi contoh: 1m, 1h, 1d").setRequired(true)

        )

        .addIntegerOption(opt =>

          opt.setName("pemenang").setDescription("Jumlah pemenang").setRequired(true)

        )

    )

    .addSubcommand(sub =>

      sub

        .setName("reroll")

        .setDescription("🎲 Reroll giveaway")

        .addStringOption(opt =>

          opt.setName("id_pesan").setDescription("ID pesan giveaway").setRequired(true)

        )

    ),

  async execute(interaction) {

    const sub = interaction.options.getSubcommand();

    const client = interaction.client; // ✅ pastikan client valid

    if (sub === "start") {

      const hadiah = interaction.options.getString("hadiah");

      const durasi = interaction.options.getString("durasi");

      const jumlahPemenang = interaction.options.getInteger("pemenang");

      const waktuAkhir = Date.now() + ms(durasi);

      const embed = new EmbedBuilder()

        .setTitle("🎉 Giveaway Dimulai!")

        .setDescription(`🎁 **Hadiah:** ${hadiah}\n🏆 **Jumlah Pemenang:** ${jumlahPemenang}\n⏰ **Berakhir:** <t:${Math.floor(waktuAkhir / 1000)}:R>`)

        .setColor("Random");

      const tombol = new ActionRowBuilder().addComponents(

        new ButtonBuilder()

          .setCustomId("giveaway_join")

          .setLabel("🎉 Ikut Giveaway")

          .setStyle(ButtonStyle.Success)

      );

      const pesan = await interaction.reply({

        embeds: [embed],

        components: [tombol],

        fetchReply: true,

      });

      const peserta = [];

      const collector = pesan.createMessageComponentCollector({

        time: ms(durasi),

      });

      collector.on("collect", async i => {

        if (i.customId === "giveaway_join") {

          if (peserta.includes(i.user.id)) {

            return i.reply({ content: "❌ Kamu sudah ikut giveaway ini!", ephemeral: true });

          }

          peserta.push(i.user.id);

          await i.reply({ content: "✅ Kamu berhasil ikut giveaway!", ephemeral: true });

        }

      });

      collector.on("end", async () => {

        if (peserta.length === 0) {

          return pesan.edit({

            embeds: [embed.setDescription("❌ Tidak ada peserta yang ikut.")],

            components: [],

          });

        }

        const pemenang = [];

        for (let i = 0; i < jumlahPemenang && peserta.length > 0; i++) {

          const index = Math.floor(Math.random() * peserta.length);

          pemenang.push(peserta.splice(index, 1)[0]);

        }

        await pesan.edit({

          embeds: [

            embed

              .setDescription(`🎉 **Giveaway Selesai!**\n🎁 **Hadiah:** ${hadiah}\n🏆 **Pemenang:** ${pemenang.map(id => `<@${id}>`).join(", ")}`)

              .setColor("Gold"),

          ],

          components: [],

        });

        interaction.followUp(`🎉 Selamat kepada ${pemenang.map(id => `<@${id}>`).join(", ")} yang memenangkan **${hadiah}**!`);

      });

    } else if (sub === "reroll") {

      const messageId = interaction.options.getString("id_pesan");

      try {

        const channel = interaction.channel;

        const message = await channel.messages.fetch(messageId);

        if (!message || !message.embeds.length)

          return interaction.reply({ content: "❌ Pesan giveaway tidak ditemukan!", ephemeral: true });

        const pesertaMatch = message.embeds[0].description.match(/<@(\d+)>/g);

        if (!pesertaMatch)

          return interaction.reply({ content: "❌ Tidak ada peserta ditemukan di embed!", ephemeral: true });

        const peserta = pesertaMatch.map(p => p.replace(/[<@>]/g, ""));

        const pemenangBaru = peserta[Math.floor(Math.random() * peserta.length)];

        await interaction.reply(`🎲 Pemenang baru adalah <@${pemenangBaru}>!`);

      } catch (err) {

        console.error("Giveaway reroll error:", err);

        return interaction.reply({ content: "❌ Gagal melakukan reroll!", ephemeral: true });

      }

    }

  },

};