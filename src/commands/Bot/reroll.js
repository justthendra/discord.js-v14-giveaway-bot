const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reroll')
    .setDescription('Belirli bir çekiliş mesajı için kazananları yeniden belirle')
    .addStringOption(option =>
      option.setName('mesaj_id')
        .setDescription('Çekiliş mesajının ID\'si')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('kazananlar')
        .setDescription('Yeni kazanan sayısı')
        .setRequired(true)),

  async execute(interaction) {
    const messageId = interaction.options.getString('mesaj_id');
    const winnersCount = interaction.options.getInteger('kazananlar');
    const channel = interaction.channel;

    try {
        

      const giveawayMessage = await channel.messages.fetch(messageId);

      const regex = /\*\*Ödül:\*\*\s*(.*?)\n/;
      const match = giveawayMessage.content.match(regex);
      const prize = match ? match[1] : 'Bilinmeyen Ödül';
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
        .setTitle('🎉 **ÇEKİLİŞ TEKRAR ÇEKİLDİ** 🎉')
        .setDescription(`**Yeni kazananlar:** ${winnersText}\n**Ödül:** \`${prize}\``)
        .setColor('Green')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.reply('Belirtilen mesaj ID\'sine sahip bir çekiliş mesajı bulunamadı.');
    }
  },
};