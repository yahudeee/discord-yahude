const { REST, Routes } = require("discord.js");

const fs = require("fs");

const path = require("path");

const config = require("./config.json"); // pastikan file config.json ada di root project kamu

// ambil semua command di folder ./commands

const commands = [];

const commandsPath = path.join(__dirname, "commands");

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {

  const command = require(path.join(commandsPath, file));

  if (command.data) {

    commands.push(command.data.toJSON());

  }

}

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {

  try {

    console.log("🚀 Deploying slash commands to Discord...");

    // Jika kamu ingin mendaftarkan ke semua server (global):

    // await rest.put(Routes.applicationCommands(config.clientId), { body: commands });

    // Kalau kamu ingin cepat update ke 1 server (guild) saja (disarankan untuk development):

    await rest.put(

      Routes.applicationGuildCommands(config.clientId, config.guildId),

      { body: commands }

    );

    console.log("✅ Slash commands berhasil di-deploy!");

  } catch (error) {

    console.error("❌ Gagal deploy commands:", error);

  }

})();