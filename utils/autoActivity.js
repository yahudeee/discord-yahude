const { ActivityType } = require('discord.js');

module.exports = (client) => {
  const activities = [
    { text: 'yahudeee', type: ActivityType.Watching },
    { text: 'yahudeee', type: ActivityType.Playing },
  ];

  let index = 0;

  const updateStatus = () => {
    // Hitung total member dari semua server
    const totalMembers = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );

    // Ambil aktivitas dari array dan tambahkan total member
    const current = activities[index];
    const displayText = `${current.text} | ${totalMembers} Members`;

    client.user.setPresence({
      status: 'idle', // 🟡 Idle
      activities: [
        {
          name: displayText,
          type: current.type,
        },
      ],
    });

    console.log(`🌙 [Activity] Status diperbarui → ${displayText}`);

    // Ganti ke aktivitas berikutnya (loop)
    index = (index + 1) % activities.length;
  };

  client.once('ready', () => {
    console.log('⚙️ [AutoActivity] Sistem aktivitas otomatis aktif.');
    updateStatus();
    setInterval(updateStatus, 30 * 1000); // ganti setiap 30 detik
  });
};