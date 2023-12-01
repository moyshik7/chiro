const { EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, User } = require("discord.js");
const base64ToBuffer = require("./base64ToBuffer");
const botConfig = require('../../../botConfig.json')
const { QuickDB } = require('quick.db');

/**
 * 
 * @param {Object[]} data [progressData, imageData] format
 * @param {Object} settings 
 * @param {boolean} settings.upscaleBtn Should the image be able to be upscaled?
 * @param {boolean} settings.redoBtn Should the image be able to be redone?
 * @param {string} settings.additionalTitleText Text to add alongside the prompt in the title.
 * @param {User} user The user that requested the image.
 * @returns {Promise<import("discord.js").MessagePayloadOption>}
 */
module.exports = async (data, settings = {upscaleBtn: true, redoBtn: false, additionalTitleText: ""}, user, quote = " ", cost, imageURL) => {
    const additionalTitleText = settings.additionalTitleText;
    //const formattedAdditionalTitleText = additionalTitleText == undefined ? "" : `${additionalTitleText} - `;
    
    const [progressData, imageData] = data;
    const cancelled = progressData.state.interrupted;

    //const imageAttachment = new AttachmentBuilder(await base64ToBuffer(imageData.images[0]), {name: 'output.png', description: ""});
    const imageParams = JSON.parse(imageData.info); //imageData.parameters doesn't contain info such as seed or sampler_name.

    const credits = new QuickDB({ filePath: "./db/credits.sqlite" })

    const currentCredit = await credits.get(user.id)

    let prompt = imageParams.prompt;
    if(prompt.length > 512){
        prompt = prompt.slice(0, 512)
    }
    let negativePrompt = imageParams?.negative_prompt || sdConfig.generationDefaults.defaultNegativePrompt;
    if(negativePrompt.length > 512){
        negativePrompt = negativePrompt.slice(0, 512)
    }

    let embed = new EmbedBuilder()
        .addFields([
            {
                name: "Seed",
                value: imageParams.seed.toString(),
                inline: true
            }, {
                name: "Steps",
                value: imageParams.steps.toString(),
                inline: true
            }, {
                name: "CFG SCale",
                value: imageParams.cfg_scale.toString(),
                inline: true
            }, { 
                name: '\u200B',
                value: '\u200B',
            }, {
                name: "Credits Used:",
                value: `${cost}`,
                inline: true,
            }, {
                name: "Credits Remaining:",
                value: `${currentCredit - cost}`,
                inline: true,
            }, {
                name: "Image Link",
                value: imageURL || `N/A`,
                inline: true
            }, { 
                name: '\u200B',
                value: '\u200B',
            },{
                name: "Prompt:",
                value: `\`\`\`\n${prompt}\n\`\`\``,
                inline: false
            },{
                name: "Negative Prompt",
                value: `\`\`\`\n${negativePrompt}\n\`\`\``,
                inline: false
            },
        ])
        //${cancelled ? "Cancelled - ": ""}${formattedAdditionalTitleText}"${imageParams.prompt}"
        .setTitle(`Dreams can be good, can be bad`)
        //.setImage('attachment://output.png')
        .setImage(imageURL)
        .setColor(cancelled ? "#ff6f61" : "#88B04B")

    if (botConfig.showImageAuthor) { embed.setAuthor({name: user.username, iconURL: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=256`}); }
    
    const row = new ActionRowBuilder()

    if (settings.redoBtn) {
        const redoBtn = new ButtonBuilder()
            .setCustomId('redoImage')
            .setLabel('Redo')
            .setEmoji('🔁')
            .setStyle(ButtonStyle.Primary)
        row.addComponents(redoBtn);
    }
    
    const saveBtn = new ButtonBuilder()
        .setCustomId('saveImage')
        .setLabel('Save')
        .setStyle(ButtonStyle.Secondary)

    row.addComponents(saveBtn);

    /*

    if (settings.upscaleBtn && !cancelled) {
        const upscaleBtn = new ButtonBuilder()
            .setCustomId('upscaleImageMenu')
            .setLabel('Upscale')
            .setStyle(ButtonStyle.Secondary)

        row.addComponents(upscaleBtn);
    }
    */

    return({
        content: `*'${quote}'*`,
        embeds: [embed], 
        //files: [imageAttachment], 
        components: [row],
    });
};