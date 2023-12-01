const { ApplicationCommandOptionType, Client, ChatInputCommandInteraction } = require('discord.js');
const sdConfig = require('../../../sdConfig.json');
const GenerateImage = require('../../utils/SD/generateImage');

module.exports = {
    //deleted: true,
    name: 'remix',
    description: 'Mix your dreams. Remix 2 Images',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'image1',
            description: 'First Image',
            required: true,
            type: ApplicationCommandOptionType.Attachment,
        }, {
            name: 'image2',
            description: 'Second Image',
            required: true,
            type: ApplicationCommandOptionType.Attachment,
        },
    ],

    /**
     * 
     * @param {Client} _client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        
        await interaction.reply("Still in Development").catch(console.log)

    },
};