const express = require('express')
const app = express();
require('dotenv').config();
app.use(express.json());

require('./bot/bot')



async function dev() {
    try {
        app.listen(process.env.PORT, () => {
            console.log('Server is running')
        })
    } catch (error) {
        console.log(error)
    }
}

dev()