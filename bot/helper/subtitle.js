const {bot} = require('../bot');
const axios = require('axios');
const FormData = require('form-data');
let pageCalc = 0;

const add_subtitle = async (chatId, id) => {
    if (chatId == process.env.ADMINCHATID) {
        bot.sendMessage(chatId, 'Iltimos subtitleni yuklang');
        bot.on('document', async (msg) => {
            const documentId = msg.document.file_id;
            const file = await bot.getFile(documentId);

            const response = await axios({
                method: 'get',
                url: `https://api.telegram.org/file/bot${process.env.TOKEN}/${file.file_path}`,
                responseType: 'arraybuffer',
            });

            const formData = new FormData();
            formData.append('file', response.data, {filename: 'subtitle_file.txt'});

            const headers = {
                'Authorization': `Bearer ${process.env.BEKENDTOKEN}`,
                ...formData.getHeaders(),
            };

            const requestData = {
                languageId: 1,
            };

            await axios.post(`${process.env.MAINAPI}/api/v1/subtitleWords/addSubtitle/${id}`, formData, {
                headers,
                params: requestData,
            });

            bot.sendMessage(chatId, 'Subtitle file uploaded successfully.');
        });
    } else {
        bot.sendMessage(chatId, 'Damingni ol');
    }
};
const get_all_movie_for_subtitle = async (chatId, page = 0) => {
    if (chatId == process.env.ADMINCHATID) {
        try {
            const response = await axios.get(process.env.MAINAPI + '/api/v1/movie/getAllMoviePage', {
                params: {
                    page: page, size: 10, noSubtitle: true
                }, headers: {
                    'Authorization': `Bearer ${process.env.BEKENDTOKEN}`
                }
            });
            const allResponse = response.data
            const movies = allResponse.content;
            const movieButtons = movies.map(movie => [{
                text: movie.name,
                callback_data: 'subtitle_movie-' + movie.id
            }]);
            bot.sendMessage(chatId, 'Kinolar ro`yxati', {
                reply_markup: {
                    inline_keyboard: [...movieButtons, [{
                        text: 'Ortga', callback_data: page === 0 ? '0' : 'back_page_for_subtitle'
                    }, {
                        text: page, callback_data: '0'
                    }, {
                        text: 'Keyingi',
                        callback_data: allResponse.totalPages === pageCalc ? '0' : 'next_page_for_subtitle'
                    }]]
                }
            });

        } catch (error) {
            console.error('Error fetching movies:', error);
            bot.sendMessage(chatId, 'Error fetching movies. Please try again later.');
        }
    } else {
        bot.sendMessage(chatId, 'Damingni ol');
    }
}


const pagination_movie_for_subtitle = async (chatId, action) => {
    if (action === 'next_page') {
        pageCalc++
    }
    if (action === 'back_page') {
        pageCalc--
    }
    get_all_movie_for_subtitle(chatId, pageCalc)
}


module.exports = {add_subtitle, get_all_movie_for_subtitle, pagination_movie_for_subtitle}