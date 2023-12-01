const { ImgurClient } = require('imgur');


const client = new ImgurClient({ clientId: process.env.IMGUR_CLINT });

/**
 * Upload an image to imgur
 * @param {String} image Image Data in Base64 Format
 * @returns Promise<any>
 */
const upload = (image) => {
    return new Promise((resolve, reject) => {
        if(!image){ return reject(new Error("No image Provided"))}
        if(typeof image !== "string"){ return reject(new Error("Invalid Image\nImage must be in Base64 Format"))}


        client.upload({
            type: "base64",
            image: image,
        }).then(res => {
            return resolve(res?.data?.link)
        })
    })
}


module.exports.UploadImageToImgur = upload;