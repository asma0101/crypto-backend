const errors = require('../utilities/messages');
const axios = require('axios');
const { KEY } = require('../utilities/config');
const Coin = require('../models/coin.model');

exports.getCoinsChains = (async (req, res) => {
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
exports.getLiveCoins = (async (req, res) => {
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

exports.purchaseCoin = (async (req, res) => {
    if (!req) {
        res.status(500).send(errors.messages.SOMETHING_WENT_WRONG);
    }
    try {
        let coin = new Coin({
          name: req.body.coin.name,
          rate: req.body.coin.rate,
        userId: req.body.coin.userId,
            
        });
        let coinDoc = await Coin.find({
            $and: [
                { name: req.body.coin.name },
                { userId: req.body.coin.userId }
            ]
         });
        if (coinDoc && coinDoc.length != 0) {
            res.status(500).send({ success: false, data: null, msg: errors.messages.ALREADY_PURCHASED });
        }
        else {
            const response = await coin.save();
            const updatedUserCoins = await Coin.find({userId: req.body.coin.userId})
            res.json({
                    success: true,
                    updatedUserCoins: updatedUserCoins,
                    message: errors.messages.COIN_PURCHASE_SUCCESS,
                });
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ success: false, data: null, error: res?.error });
    }
})

exports.getUserCoins = (async (req, res) => {
    if (!req) {
        res.status(500).send( "Unable to process request");
    }
    const coins = await Coin.find({userId: req.query.userId});
    if (coins) {
        res.json({ success: true, data: coins });
    }
    else {
        res.status(500).send({success: false, data: null, error: res?.error});
    }
   
})

exports.transferCoin = (async (req, res) => {
    if (!req) {
        res.status(500).send( "Unable to process request");
    }
    try {
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const coin = req.body.coin;

   
    await Coin.deleteOne({ userId: senderId });
    let coinObj = new Coin({
          name: coin.name,
          rate: coin.rate,
          userId: receiverId,
    });
    const response = await coinObj.save();
    const updatedUserCoins = await Coin.find({userId: senderId})
        
    res.json({
            success: true,
            updatedUserCoins: updatedUserCoins,
            message: errors.messages.TRANSACTION_SUCCESS,
        });        
    } catch (e) {
        console.log(e)
        res.status(500).send({ success: false, data: null, error: res?.error });
    }



    
})
