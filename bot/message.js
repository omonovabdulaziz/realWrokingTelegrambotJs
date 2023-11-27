const {bot} = require('./bot')
const {start} = require("./helper/start");
const {get_all_movies} = require("./helper/kinolar");
const {add_subtitle, get_all_movie_for_subtitle} = require('./helper/subtitle')


bot.on('message', async msg => {
    const chatId = msg.from.id
    const text = msg.text
    if (text === '/start') {
        start(chatId)
    }
    if (text === 'Kinolar') {
        get_all_movies(chatId)
    }
    if (text === 'addSubtitle') {
        get_all_movie_for_subtitle(chatId)
    }
})