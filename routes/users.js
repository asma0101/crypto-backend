var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');
const middleware = require('../utilities/middleware');

/* GET users listing. */
router.get('/', userController.getUsers);
router.post('/createUser', userController.addUser);
router.post('/login', userController.login);
router.get('/getTransferAddresses',userController.getTransferAddresses);

module.exports = router;
