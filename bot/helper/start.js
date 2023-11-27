const {bot} = require('../bot')
const {process_params} = require('express/lib/router')
const {adminKeyboard} = require('../menu/keyboard')

const start = async (chatId) => {
    if (chatId == process.env.ADMINCHATID) {
        bot.sendMessage(chatId, 'Choose from menu Mister Admin😁', {
            reply_markup: {
                keyboard: adminKeyboard,
                resize_keyboard: true
            }
        })
    } else {
        console.log(chatId)
        await bot.sendMessage(chatId, 'You are not an admin. please do not log in')
    }
}


module.exports = {start}