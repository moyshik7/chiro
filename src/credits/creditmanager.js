const { QuickDB } = require("quick.db");

const credits = new QuickDB({ filePath: "./db/credits.sqlite" })


module.exports.BasicFreeCredit = BasicFreeCredit = 20;


module.exports.CreditDB = credits;
module.exports.AddBasicCredits = (id) => {
    return new Promise((resolve, reject)=> {
        if(!id){ return reject(false) }
        credits.get(id).then(check => {
            if(check !== null){
                return reject(false);
            }
            credits.set(id, BasicFreeCredit)
            return resolve(true)
        })
        
        
    })
}

/**
 * Checks if the user has enough credits to run this task
 * @param {String} id The discord User ID
 * @param {Number} required The amount of credits required
 * @returns {Boolean}
 */
module.exports.IsEnoughCredit = async (id, required) => {}


/**
 * Reduces the amount of credits from the user
 * @param {The Discord User ID} id 
 * @param {*} amount 
 */
module.exports.ReduceCredits = async (id, amount) => {
    return new Promise((resolve, reject) => {
        if(!id){ reject("No User ID") }
        if(!amount){ reject("No amount Provided or The provided amount is Zero") }
        if(typeof amount !== "number"){ reject("The amount must be a number") }
        if(amount < 0){ reject}{ reject("The amount must be more than zero") }

        const check1 = this.IsEnoughCredit(id, amount)

        if(!check1){ reject("The user does not have wnough credits") }

        credits.get(id).then(currentCredit => {
            const newCredit = currentCredit - amount;

            credits.set(id, newCredit)
            resolve(newCredit)
        })
    })
}