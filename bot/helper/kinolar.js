const axios = require('axios');
const {bot} = require('../bot');

let pageCalc = 0;
let deleteCounter = ''


const askForAddingMovie = async (chatId) => {
    const questions = ['Ism:', 'Description:', 'Narxi:', 'Daraja(INTERMEDIATE , BEGINNER , ELEMENTRY , UPPER_INTERMEDIATE ):', 'Yosh chegarasi:',];

    let answers = [];

    for (const question of questions) {
        const response = await bot.sendMessage(chatId, question);
        const answer = await new Promise((resolve) => {
            bot.once('text', (msg) => resolve(msg.text));
        });
        answers.push(answer);
    }

    return {
        name: answers[0],
        description: answers[1],
        price: parseFloat(answers[2]),
        level: answers[3],
        belongAge: parseInt(answers[4]),
    };
};

const add_movie = async (chatId) => {
    if (process.env.ADMINCHATID == chatId) {
        try {
            const movieInfo = await askForAddingMovie(chatId);
            const apiUrl = process.env.MAINAPI + '/api/v1/movie/addMovie';

            const headers = {
                Authorization: `Bearer ${process.env.BEKENDTOKEN}`, 'Content-Type': 'application/json',
            };
            const response = await axios.post(apiUrl, movieInfo, {headers});
            if (response.status === 200) {
                bot.sendMessage(chatId, 'Kino qo`shildi');
                get_all_movies(chatId)
            } else {
                bot.sendMessage(chatId, 'Kino qo`shishda xatolik');
            }
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'An error occurred while processing your request.');
        }
    } else {
        bot.sendMessage(chatId, 'Damingni ol');
    }
};

const get_all_movies = async (chatId, page = 0) => {
    if (chatId == process.env.ADMINCHATID) {
        try {
            const response = await axios.get(process.env.MAINAPI + '/api/v1/movie/getAllMoviePage', {
                params: {
                    page: page, size: 10
                }, headers: {
                    'Authorization': `Bearer ${process.env.BEKENDTOKEN}`
                }
            });
            const allResponse = response.data
            const movies = allResponse.content;
            const movieButtons = movies.map(movie => [{text: movie.name, callback_data: 'movie_' + movie.id}]);
            bot.sendMessage(chatId, 'Kinolar ro`yxati', {
                reply_markup: {
                    inline_keyboard: [...movieButtons, [{
                        text: 'Ortga', callback_data: page === 0 ? '0' : 'back_page'
                    }, {
                        text: page, callback_data: '0'
                    }, {
                        text: 'Keyingi', callback_data: allResponse.totalPages === pageCalc ? '0' : 'next_page'
                    }], [{
                        text: 'Yangi Kino', callback_data: 'add_movie'
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
const show_movie = async (chatId, id) => {
    if (chatId == process.env.ADMINCHATID) {
        deleteCounter = ''
        try {
            const response = await axios.get(process.env.MAINAPI + `/api/v1/movie/getMovie/${id}`, {
                headers: {
                    'Authorization': `Bearer ${process.env.BEKENDTOKEN}`
                }
            });

            const movieData = response.data;
            const messageText = `
                    Movie ID: ${movieData.id}
                    Name: ${movieData.name}
                    Description: ${movieData.description}
                    Price: ${movieData.price}
                    Genre: ${movieData.genre}
                    ImageUrl:${movieData.avatarUrl}
                    Is Bought: ${movieData.isBought ? 'Yes' : 'No'}
                    Level: ${movieData.level}
                    Belong Age: ${movieData.belongAge} 
                    Is Serial: ${movieData.serial === null ? 'No' : 'Yes'}
                `;
            bot.sendMessage(chatId, messageText, {
                reply_markup: {
                    remove_keyboard: true, inline_keyboard: [[{
                        text: 'Kinoni tahrirlash', callback_data: `edit_movie-${movieData.id}`
                    }, {
                        text: 'Kinoni o`chirish', callback_data: `del_movie-${movieData.id}`
                    }]]
                }
            });
        } catch (error) {
            console.log(error);
        }
    }
}
const pagination_movie = async (chatId, action) => {
    if (action === 'next_page') {
        pageCalc++
    }
    if (action === 'back_page') {
        pageCalc--
    }
    get_all_movies(chatId, pageCalc)
}

const delete_movie = async (chatId, id) => {
    if (chatId == process.env.ADMINCHATID) {
        if (deleteCounter === 'delete_movie') {
            deleteCounter = ''
            try {
                const response = await axios.delete(process.env.MAINAPI + `/api/v1/movie/deleteMovie/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.BEKENDTOKEN}`
                    }
                });
                const statusCode = response.status;
                if (statusCode === 200) {
                    bot.sendMessage(chatId, 'Ushbu kino o`chirildi')
                }
            } catch (error) {
                bot.sendMessage(chatId, `Error: ${error.response.status}\n${error.response.data}`);
            }
        } else {
            deleteCounter = 'delete_movie'
            bot.sendMessage(chatId, `Siz shu kinoni o'chirmoqchisiz. Qaroringiz qatiymi ? `, {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Bekor qilish', callback_data: `movie_${id}`
                    }, {
                        text: 'O`chirish', callback_data: `del_movie-${id}`
                    }]]
                }
            });
        }
    } else {
        bot.sendMessage(chatId, 'Damingni ol')
    }
}
const askForEditInformation = async (chatId) => {
    const questions = ['Ism:', 'Tavsif:', 'Narxi:', 'Daraja(INTERMEDIATE , BEGINNER , ELEMENTRY , UPPER_INTERMEDIATE ):', 'Yosh chegarasi:', 'Serial ID:', 'Rasm URL manzili:', 'Kino janri:'];

    let answers = [];

    for (const question of questions) {
        const response = await bot.sendMessage(chatId, question);
        const answer = await new Promise(resolve => {
            bot.once('text', (msg) => resolve(msg.text));
        });
        answers.push(answer);
    }

    return {
        name: answers[0],
        description: answers[1],
        price: parseFloat(answers[2]),
        level: answers[3],
        belongAge: parseInt(answers[4]),
        serialId: parseInt(answers[5]) || null,
        updateImageUrl: answers[6],
        updateImageGenre: answers[7]
    };
};

const edit_movie = async (chatId, id, editInformation) => {
    if (process.env.ADMINCHATID == chatId) {
        if (editInformation === undefined) {
            editInformations = await askForEditInformation(chatId);
            edit_movie(chatId, id, editInformations)
        }
        try {
            const requestBody = {
                name: editInformation.name,
                description: editInformation.description,
                price: editInformation.price,
                level: editInformation.level,
                belongAge: editInformation.belongAge,
                serialId: null,
                updateImageUrl: editInformation.updateImageUrl,
                updateImageGenre: editInformation.updateImageGenre
            };

            const response = await axios.put(`${process.env.MAINAPI}/api/v1/movie/updateMovie/${id}`, requestBody, {
                headers: {
                    'Authorization': `Bearer ${process.env.BEKENDTOKEN}`
                }
            });

            if (response.status === 200) {
                show_movie(chatId, id);
            } else {
                console.error('Failed to update movie');
            }
        } catch (error) {
            console.error('Error updating movie:', error.message);
        }
    } else {
        bot.sendMessage(chatId, 'Damingni ol');
    }
};


module.exports = {
    get_all_movies, pagination_movie, show_movie, delete_movie, edit_movie, add_movie
};
