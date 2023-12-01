const { ApplicationCommandOptionType, Client, ChatInputCommandInteraction } = require('discord.js');
const sdConfig = require('../../../sdConfig.json');
const GenerateImage = require('../../utils/SD/generateImage');

module.exports = {
    //deleted: true,
    name: 'dream',
    description: 'Generates an image.',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'prompt',
            description: 'What to dream',
            required: true,
            type: ApplicationCommandOptionType.String,
            length: 512,
        }, {
            name: 'negative_prompt',
            description: 'Nightmares are not acceptable',
            required: false,
            type: ApplicationCommandOptionType.String,
            length: 512,
        }, {
            name: 'steps',
            description: "How much time to spend generating",
            required: false,
            type: ApplicationCommandOptionType.Integer,
            choices: sdConfig.steps_choices
        }, {
            name: 'cfg',
            description: "How close the image should be to the prompt",
            required: false,
            type: ApplicationCommandOptionType.Integer,
            choices: sdConfig.cfg_choices
        }
    ],

    /**
     * 
     * @param {Client} _client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    callback: async (_client, interaction) => {
        
        let prompt = interaction.options.get('prompt').value;
        /*
        if(prompt.length > 249)(
            interaction.reply("Prompt must be less than 250 Characters")
        )
        */
        await GenerateImage(
            'sdapi/v1/txt2img',
            {
                prompt: prompt,
                negative_prompt: interaction.options.get('negative_prompt')?.value || sdConfig.generationDefaults.defaultNegativePrompt,
                steps: interaction.options.get('steps')?.value || sdConfig.generationDefaults.defaultSteps,
                cfg_scale: interaction.options.get('cfg')?.value || sdConfig.generationDefaults.defaultCfg,
                width: 512,
                height: 768,
            },
            interaction, 
            {
                upscaleBtn: true,
                redoBtn: true
            }
        );
    },
};