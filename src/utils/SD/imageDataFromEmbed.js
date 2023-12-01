const axios = require("axios");
const { Embed } = require("discord.js");

/**
 * 
 * @param {Embed} embed 
 * @param {boolean} returnImageB64 
 * @returns {Promise<object>}
 */
module.exports = async(embed, returnImageB64 = false) => {
    try{
        const embedFields = embed.fields;

        const data = {
            prompt: embedFields[8].value.replace(/`/g,''),
            negative_prompt: embedFields[9].value.replace(/`/g,''),
            cfg_scale: embedFields[2].value,
            steps: embedFields[1].value,
            seed: embedFields[0].value,
        };

        if (returnImageB64) {
            const embedImage = embed.image;
            const response = await axios.get(embedFields[6].value, {responseType: 'arraybuffer'});
            const base64 = Buffer.from(response.data, 'binary').toString('base64');

            data.image = base64;
            data.width = embedImage.width;
            data.height = embedImage.height;
        }

        return data;
    } catch(e){ console.log(e) }
    
}