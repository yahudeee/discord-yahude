console.log('🚀 [yahudeee store] Memulai proses instalasi...');

const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes } = require('discord.js');
const config = require('./config.json');

// 🔹 Monitoring helper & utilitas
const statusMonitor = require('./utils/statusMonitor');
const errorMonitoring = require('./utils/errormonitoring');
const autoActivity = require('./utils/autoActivity');
require('./deploy-commands');
const securitySystem = require("./security");
const ticketOrder = require("./commands/ticket/ticketorder.js");

// 🔹 Inisialisasi Client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: ['CHANNEL'] // agar bisa membaca DM
});

client.commands = new Collection();
client.pendingRequests = new Map();

console.log('✅ [Init] Module dan client Discord berhasil di-load.');

// 🔹 Aktifkan Monitoring
statusMonitor(client);
errorMonitoring(client);
autoActivity(client);
securitySystem(client);
ticketOrder.registerHandlers(client);

// =====================================================
// 📦 LOAD SLASH COMMANDS
// =====================================================
const commandsArray = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    try {
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
        console.log(`✅ [Command] Berhasil dimuat: ${file}`);
      } else {
        console.warn(`⚠️ [Command] Format salah di: ${file}`);
      }
    } catch (err) {
      console.error(`❌ [Command] Gagal load ${file}:`, err);
    }
  }
}

// 🔹 Deploy Slash Commands ke Discord
const rest = new REST({ version: '10' }).setToken(config.token);
rest.put(Routes.applicationCommands(config.clientId), { body: commandsArray })
  .then(() => console.log('📤 [Deploy] Slash commands berhasil di-deploy!'))
  .catch(err => console.error('❌ [Deploy] Gagal deploy commands:', err));

// =====================================================
// 🎯 LOAD EVENT HANDLER
// =====================================================
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  try {
    const event = require(filePath);

    // Cek tipe event
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else if (event.onMemberJoin) {
      client.on(event.onMemberJoin.name, (...args) => event.onMemberJoin.execute(...args, client));
    } else if (event.onMemberLeave) {
      client.on(event.onMemberLeave.name, (...args) => event.onMemberLeave.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    console.log(`✅ [Event] Berhasil dimuat: ${file}`);
  } catch (err) {
    console.error(`❌ [Event] Gagal load ${file}:`, err);
  }
}

// =====================================================
// 💬 INTERACTION HANDLER (Slash Commands)
// =====================================================
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (err) {
    console.error(`❌ [Exec] Gagal eksekusi: ${interaction.commandName}`, err);
    await interaction.reply({
      content: '❌ Terjadi error saat menjalankan command.',
      ephemeral: true
    });
  }
});

// =====================================================
// 🚀 EVENT: BOT SIAP
// =====================================================
client.once('ready', async () => {
  console.log(`✅ Bot aktif sebagai ${client.user.tag}`);

  try {
    const statustoko = require('./commands/admin/statustoko.js');
    if (statustoko.init) statustoko.init(client);
  } catch (err) {
    console.warn('⚠️ Tidak ada file statustoko.js atau gagal dimuat:', err.message);
  }
});

// =====================================================
// 🧯 GLOBAL ERROR HANDLER
// =====================================================
process.on('unhandledRejection', err => {
  console.error('❌ [Global] Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('❌ [Global] Uncaught Exception:', err);
});

// =====================================================
// 🔐 LOGIN BOT
// =====================================================
client.login(config.token)
  .then(() => console.log('🔐 [Login] Bot berhasil login ke Discord!'))
  .catch(err => console.error('❌ [Login] Gagal login ke Discord:', err));