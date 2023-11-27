const TELEGRAM_BOT = require('node-telegram-bot-api');

const bot = new TELEGRAM_BOT(process.env.TOKEN, { polling: true });

module.exports = { bot };

require('./message');
require('./query');
