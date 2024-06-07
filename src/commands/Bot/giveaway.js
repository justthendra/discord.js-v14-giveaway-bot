const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

function formatDuration(durationMs) {
    const seconds = Math.floor((durationMs / 1000) % 60);
    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor(durationMs / (1000 * 60 * 60 * 24));
  
    const daysDisplay = days > 0 ? `${days} gün` : '';
    const hoursDisplay = hours > 0 ? `${hours} saat` : '';
    const minutesDisplay = minutes > 0 ? `${minutes} dakika` : '';
    const secondsDisplay = seconds > 0 ? `${seconds} saniye` : '';
  
    return `${daysDisplay} ${hoursDisplay} ${minutesDisplay} ${secondsDisplay}`.trim();
  }

module.exports = {
    data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription("Bir çekiliş başlatın ve hediyeler dağıtın.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(time =>
        time.setName("süre")
        .setDescription("Çekilişin süresi (1d,1w,2w)")
        .setRequired(true)
    )
    .addIntegerOption(win =>
        win.setName("kazananlar")
        .setDescription("Kaç kazanan olacak?")
        .setRequired(true)
    )
    .addStringOption(prize =>
        prize.setName("ödül")
        .setDescription("Bir ödül belirt.")
        .setRequired(true)
    )
    .addStringOption(term => 
        term.setName("şart")
        .setDescription("Çekiliş şartı belirt.")
    ),
    async execute(interaction) {

        const duration = interaction.options.getString("süre");
        const winner = interaction.options.getInteger("kazananlar");
        const prize = interaction.options.getString("ödül");
        const term = interaction.options.getString("şart") || "Belirtilmedi";

        const ms = require('ms');
        const durationMs = ms(duration);

        if(isNaN(durationMs)) return interaction.reply({content: "Lütfen geçerli bir süre belirtin."})

        const formattedDuration = formatDuration(durationMs);

        const giveAwEmb = new EmbedBuilder()
        .setTitle("🎉 **ÇEKİLİŞ** 🎉")
        .setDescription(`Bir çekiliş başladı. Çekilişe katılmak için 🎉 emojisine tıklayın.\n\n**Ödül:** \`${prize}\`\n**Çekiliş Şartı:** \`${term}\`\n**Süre:** ${formattedDuration}\n**Kazanan Sayısı:** \`${winner}\``)
        .setColor('Random')
        .setFooter({text: `Çekilişi başlatan: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
        .setTimestamp()
        interaction.reply({embeds: [giveAwEmb]});

        const giveawayMessage = await interaction.fetchReply();

        await giveawayMessage.react('🎉');

        setTimeout(async () => {
            const reactions = await giveawayMessage.reactions.cache.get('🎉').users.fetch();
            const participants = reactions.filter(user => !user.bot);

            if (participants.size === 0) return interaction.followUp(`Çekiliş sona erdi, ancak geçerli katılım yok.`)

            const winners = [];
            for (let i = 0; i < winner; i++) {
                const winner = participants.random();
                winners.push(winner);
                participants.delete(winner.id)
            }

            const winnersText = winners.map(w => `<@${w.id}>`).join(", ");

            const resultEmb = new EmbedBuilder()
            .setTitle(`🎉 **ÇEKİLİŞ SONA ERDİ** 🎉`)
            .setDescription(`Mevcut çekiliş sona erdi. Kazananları tebrik ederim.\n\n**Ödül:** \`${prize}\`\n**Kazananlar:** ${winnersText}`)
            .setColor("Green")
            .setFooter({text: "Çekilişe katılan herkese teşekkürler."})
            .setTimestamp()
            await interaction.editReply({embeds: [resultEmb]})
        }, durationMs);
        
    }
}