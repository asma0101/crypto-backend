const errors = require('../utilities/messages');
const axios = require('axios');
const { KEY } = require('../utilities/config');

exports.getCoins = (async (req, res) => {
    if (!req) {
        res.status(500).send(errors.messages.SOMETHING_WENT_WRONG);
    }
    try {
        const response = await axios.get(`http://api.coinlayer.com/list?access_key=${KEY}`);
        const posts = response.data;
        res.json(posts);
    } catch (e) {
        res.status(500).send({ success: false, data: null, error: res?.error });
    }
})
exports.getRates = (async (req, res) => {
    if (!req) {
        res.status(500).send(errors.messages.SOMETHING_WENT_WRONG);
    }
    try {
        const response = await axios.get(`http://api.coinlayer.com/live?access_key=${KEY}`);
        const posts = response.data;
        res.json(posts);
    } catch (e) {
        res.status(500).send({ success: false, data: null, error: res?.error });
    }
})


