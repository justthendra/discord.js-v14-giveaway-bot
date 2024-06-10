const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('end-giveaway')
    .setDescription('Belirli bir çekilişi sonlandır ve kazananları duyur')
    .addStringOption(option =>
      option.setName('mesaj_id')
        .setDescription('Çekiliş mesajının ID\'si')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('kazananlar')
        .setDescription('Kazananların sayısı')
        .setRequired(true)),

  async execute(interaction) {
    const messageId = interaction.options.getString('mesaj_id');
    const winnersCount = interaction.options.getInteger('kazananlar');
    const channel = interaction.channel;
    const dataPath = '../../giveaways.json';

    try {
      
        const giveawayMessage = await channel.messages.fetch(messageId);
      
        if (!fs.existsSync(dataPath)) {
          return interaction.reply('Çekiliş bilgilerini içeren bir dosya bulunamadı.');
        }

        const rawData = fs.readFileSync(dataPath);
        const giveaways = JSON.parse(rawData);

     
        const giveaway = giveaways.find(g => g.messageId === messageId);

        if (!giveaway) {
          return interaction.reply('Belirtilen mesaj ID\'si için bir çekiliş bulunamadı.');
        }

        const { prize, winnersCount } = giveaway;
        const reactions = await giveawayMessage.reactions.cache.get('🎉').users.fetch();
        const participants = reactions.filter(user => !user.bot);

        if (participants.size === 0) {
            return interaction.reply('Çekiliş için geçerli bir katılımcı bulunamadı.');
        }

      
        const winners = [];
        for (let i = 0; i < winnersCount; i++) {
          if (participants.size === 0) break; 
          const winner = participants.random();
          winners.push(winner);
          participants.delete(winner.id);
        }


        const winnersText = winners.map(w => `<@${w.id}>`).join(', ');

        const embed = new EmbedBuilder()
        .setTitle('🎉 **ÇEKİLİŞ SONA ERDİ** 🎉')
        .setDescription(`**Ödül:** \`${prize}\`\n**Kazananlar:** ${winnersText}`)
        .setColor('#FF0000')
        .setTimestamp();
        await interaction.reply({ embeds: [embed] });

        const updatedGiveaways = giveaways.filter(g => g.messageId !== messageId);
        fs.writeFileSync(dataPath, JSON.stringify(updatedGiveaways, null, 2), 'utf-8');
    } catch (error) {
      console.error(error);
      return interaction.reply('Belirtilen mesaj ID\'sine sahip bir çekiliş mesajı bulunamadı.');
    }
  },
};
