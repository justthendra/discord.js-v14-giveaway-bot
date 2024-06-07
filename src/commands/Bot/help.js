const { SlashCommandBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const config = require('../../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Bot komutlarını listeler."),
    async execute(interaction) {

        const help = new EmbedBuilder()
        .setAuthor({ name: `🎉 ${interaction.client.user.username} burada!`, iconURL: interaction.client.user.displayAvatarURL()})
        .setColor("Random")
        .addFields(
            { name: "/giveaway `<süre>` `<kazanansayı>` `<ödül>`", value: "Bir çekiliş başlatın ve hediyeler dağıtın."},
            { name: "/end-giveaway `<kazanansayı>`", value: "Çekilişi erkenden bitirin.", inline: true },
            { name: "/reroll `<kazanansayı>`", value: "Çekilişi yeniden çekin.", inline: true }
        )
        .setDescription(`Bütün komutlarım aşağıda yer alıyor.`)
        .setFooter({text: `${interaction.client.username} | Yardım Sayfası`, iconURL: interaction.client.user.displayAvatarURL()})
        .setTimestamp()

        const button1 = new ButtonBuilder()
        .setLabel('Botu Davet Et')
        .setURL('https://discord.com/oauth2/authorize?client_id=' + config.bot.client_id + '&scope=bot&permissions=277062437952')
        .setStyle(ButtonStyle.Link);

        const button2 = new ButtonBuilder()
        .setLabel('Destek Sunucusu')
        .setURL('https://discord.com/invite/')
        .setStyle(ButtonStyle.Link);

        const button3 = new ButtonBuilder()
        .setLabel('Github Repo')
        .setURL('https://github.com/justthendra/discord.js-v14-giveaway-bot')
        .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder()
        .addComponents(button1, button2, button3);
        return interaction.reply({ embeds: [help], components: [row] })
    }
}