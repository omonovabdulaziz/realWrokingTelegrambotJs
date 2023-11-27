const {bot} = require('./bot')
const {pagination_movie, show_movie, delete_movie, edit_movie, add_movie} = require('./helper/kinolar')
const {request} = require("express");
const {pagination_movie_for_subtitle, add_subtitle} = require("./helper/subtitle");

bot.on('callback_query', async query => {
    const chatId = query.from.id
    const {data} = query
    if (data.includes('subtitle_movie-')) {
        let id = data.split('-')[1]
        add_subtitle(chatId, id)
    }
    if (data === 'add_movie') {
        add_movie(chatId)
    }
    if (data === 'next_page') {
        pagination_movie(chatId, 'next_page')
    }
    if (data === 'back_page') {
        pagination_movie(chatId, 'back_page')
    }
    if (data.includes('movie_')) {
        let id = data.split('_')[1]
        show_movie(chatId, id)
    }
    if (data.includes('edit_movie-')) {
        let id = data.split('-')[1]
        edit_movie(chatId, id)
    }
    if (data.includes('del_movie-')) {
        let id = data.split('-')[1]
        delete_movie(chatId, id)
    }
    if (data.includes('back_page_for_subtitle')) {
        pagination_movie_for_subtitle(chatId, 'back_page')
    }
    if (data.includes('next_page_for_subtitle')) {
        pagination_movie_for_subtitle(chatId, 'next_page')
    }
})