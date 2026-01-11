const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = (client) => {
  let clientReady = false;

 
  client.once('ready', async () => {
    clientReady = true;

    const channel = await client.channels.fetch(config.statusChannelId).catch(() => null);
    if (!channel || !client.user) return;

    const embed = new EmbedBuilder()
      .setTitle('✨ BOT ONLINE')
      .setDescription('🟩 **yahudeee sekarang aktif dan siap digunakan!**')
      .setColor(0x57F287)
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => null);
  });


  client.on('shardDisconnect', async () => {
    if (!clientReady || !client.user) return;

    const channel = await client.channels.fetch(config.statusChannelId).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle('⚠️ KONEKSI TERPUTUS')
      .setDescription('📡 **Bot kehilangan koneksi dengan Discord.**')
      .setColor(0xED4245)
      .setTimestamp();

    channel.send({ embeds: [embed] }).catch(() => null);
  });


  const sendOfflineStatus = async (reason = 'exit') => {
    if (!clientReady || !client.user) return;

    const channel = await client.channels.fetch(config.statusChannelId).catch(() => null);
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setTitle('💤 BOT OFFLINE')
      .setDescription(`📴 **Bot telah dimatikan**\n📝 Alasan: \`${reason}\``)
      .setColor(0xED4245)
      .setTimestamp();

    try {
      await channel.send({ embeds: [embed] });
      await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error('❌ Gagal kirim status OFFLINE:', err);
    }
  };

  process.on('exit', () => sendOfflineStatus('process exit'));
  process.on('SIGINT', async () => {
    await sendOfflineStatus('SIGINT');
    process.exit();
  });
  process.on('SIGTERM', async () => {
    await sendOfflineStatus('SIGTERM');
    process.exit();
  });
};