//@ts-check
const { ChatInputCommandInteraction, ButtonInteraction, EmbedBuilder, Colors } = require('discord.js')
const createImageEmbed = require("./createImageEmbed");
const progressUpdater = require("./progressUpdater");
const sendRequest = require("./sendRequest");
const DreamQuotes = require("./../../random/quotes");
const { QuickDB } = require('quick.db');
const { BasicFreeCredit } = require('../../credits/creditmanager');
const { UploadImageToImgur } = require('../upload');

/**
 * 
 * @param {string} route The SD api route e.g "sdapi/v1/txt2img".
 * @param {object} requestData JSON data to be sent with axios request to api.
 * @param {ChatInputCommandInteraction | ButtonInteraction} interaction Command interaction to reply to.
 * @param {object} embedData createImageEmbed parameters.
 */
module.exports = async (route, requestData, interaction, embedData) => {

    const credits = new QuickDB({ filePath: "./db/credits.sqlite" })

    const creditCost = 1;
    //Maybe add algorithm to calculate credit in the future

    let userCredits = await credits.get(interaction.user.id)

    
    if(userCredits === null){
        await credits.set(interaction.user.id, BasicFreeCredit);
        try{
            await interaction.channel?.send({
                content: `<@${interaction.user.id}>`,
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`You got ${BasicFreeCredit} Free Credits`)
                        .setDescription(`
Created your account
You received 20 FREE credits as beginner
Use \`/profile\` To check your profile and Manage Credits

Happy Dreaming!`)
                        .setColor(Colors.Purple)
                ]
            })
            userCredits = await credits.get(interaction.user.id)
        } catch(e){ }
    }


    if((userCredits - creditCost) < 0){
        //Not enough credits to generate image
        //Show error to user

        return interaction.reply({
            content: `<@${interaction.user.id}>`,
            embeds: [
                new EmbedBuilder()
                    .setTitle("Not enough Credits")
                    .setDescription(`You currently have **${userCredits} Credits**\nYou will need **${creditCost} Credits** to generate this image`)
                    .setColor("#ff6f61")
            ]
        })
    }


    const quote = DreamQuotes[Math.floor(Math.random()*DreamQuotes.length)];

    await interaction.reply({ 
        content: `*'${quote}'*`,
        embeds: [
            new EmbedBuilder()
                .setDescription("Waiting in Queue"),
        ],
    });

    try{

        const imagePromise = sendRequest(route, requestData);

        const progressFinish = await progressUpdater(imagePromise, interaction, quote);

        const imageData = progressFinish[1];

        const imageURL = await UploadImageToImgur(imageData.images[0])
        

        await interaction.editReply(await createImageEmbed(progressFinish, embedData, interaction.user, quote, creditCost, imageURL));
        await credits.set(interaction.user.id, (userCredits - creditCost))
    
    } catch(err){ console.log(err)}
}