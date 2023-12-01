const { Client, ChatInputCommandInteraction, EmbedBuilder, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { CreditDB, AddBasicCredits, BasicFreeCredit } = require('../../credits/creditmanager');
const { values } = require('../../random/quotes');
const { QuickDB } = require('quick.db');
const credits = new QuickDB({ filePath: "./db/credits.sqlite" })

module.exports = {
    //deleted: true,
    name: 'profile',
    description: 'Your personal dashboard',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [],

    callback: async (_client, interaction) => {
        await interaction.deferReply()

        let userCredits = await credits.get(interaction.user.id)

        if(userCredits === null){
            await credits.set(interaction.user.id, BasicFreeCredit);
        }

        userCredits = await credits.get(interaction.user.id)
        
        const embed = new EmbedBuilder()
            .setColor("#FF6F61")
            .setTitle(interaction.user.username)
            .addFields([
                {
                    name: "**Credits**",
                    value: `"${userCredits}"`,
                    inline: true,
                }, {
                    name: "Account Tier",
                    value: "Free",
                    inline: true,
                }, {
                    name: "Verification Level",
                    value: "None",
                    inline: true,
                }, {
                    name: "Discord ID",
                    value: interaction.user.id,
                    inline: false,
                }, {
                    name: "Account Link",
                    value: "N/A",
                    inline: false,
                },
            ]);
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setEmoji("💰")
                        .setLabel("Buy More Credits")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Primary)
                        .setCustomId("buyCredits")
                )
        
            interaction.editReply({
                embeds: [ embed ],
                components: [row],
            })
    },
};