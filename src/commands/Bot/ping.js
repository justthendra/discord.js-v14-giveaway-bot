const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Pingimi görürsünüz.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        interaction.reply(`My ping is: \`${interaction.client.ws.ping}\`ms`)
    }
}