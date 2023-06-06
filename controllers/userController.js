const User = require('../models/user.model');
const helper = require('./helperController');
const jwt = require('jsonwebtoken');
const config = require('../utilities/config');
const errors = require('../utilities/messages');
// const Task = require('../models/task.model');

exports.getUsers = (async (req, res) => {
    if (!req) {
        res.status(500).send( "Unable to process request");
    }
    const users = await User.find();
    if (users) {
        res.json({ success: true, data: users });
    }
    else {
        res.status(500).send({success: false, data: null, error: res?.error});
    }
   
})
exports.login = (async (req, res) => {
    if (!req) {
        res.status(500).send("Request body can't be empty");
    }
    const user = await User.find({ email: req.body.user.email });
    if (user.length && user.length > 0) {
        if (user[0]['loginAttempts'] >= 3) {
            res.json({ success: false, msg: errors.messages.USER_BLOCKED });
            return;
        }
        console.log(user)
        const isValidPassword = helper.matchPassword(req.body.user.password, user[0].password);
        user[0]['loginAttempts'] += 1;
        if (isValidPassword) {
          //proceed to login
          let token = jwt.sign({ email: user[0].email }, config.KEY, {
            expiresIn: "24h",
          });
            const returnUser = {
                name: user[0].name,
                email: user[0].email,
                id: user[0]._id,
                homeAddress: user[0].homeAddress,
                cnic: user[0].cnic,
                loginAttempts: user[0].loginAttempts,
                isBlocked: user[0].isBlocked
            }
            if (returnUser.loginAttempts >= 3) {
                blockUser(returnUser);
            }
            updateLoginAttempts(returnUser, true)
          res.json({ success: true, token, user: returnUser });
        }
        else {
            updateLoginAttempts(user[0], false);
            if (user[0]['loginAttempts'] >= 3) {
                res.json({ success: false, msg: errors.messages.USER_BLOCKED });
            }
            else {
                res.json({ success: false, msg: errors.messages.INVALID_EMAIL_PASS });                
            }
        }
        
    }
    else {
        res.json({ success: false, msg: errors.messages.USER_NOT_EXIST });
    }

})
exports.addUser =  (async (req, res, next) => {
    if (!req) {
        res.send("Unable to add user");
    }
    else {
        let user = new User({
          name: req.body.user.name,
          email: req.body.user.email,
            password: helper.encryptPassword(req.body.user.password),
            homeAddress: req.body.user.homeAddress,
            cnic: req.body.user.cnic,
            loginAttempts: req.body.user.loginAttempts,
            isBlocked: req.body.user.isBlocked
        });
        try {
            let userDoc = await User.find({ email: user.email });
            console.log(userDoc)
            if (userDoc && userDoc?.length !==0) {
                res.status(500).send({ success: false,message: errors.messages.USER_ALREADY_EXISTS });
            }

            else {
                 const response = await user.save();
                const returnUser = {
                    name: response.name,
                    email: response.email,
                    id: response._id,
                    homeAddress: response.homeAddress,
                    cnic: response.cnic,
                    loginAttempts: response.loginAttempts,
                    isBlocked: response.isBlocked
                }
                let token = jwt.sign({ email: user.email }, config.KEY, {
                expiresIn: "24h",
                });
                res.json({
                    success: true,
                    token,
                    user: returnUser,
                    message: errors.messages.CREATE_ACC_SUCCESS,
                });
            }
           
        }
        catch (e) {
            console.log(e);
            res.status(500).send({ success: false,e, message: errors.messages.SOMETHING_WENT_WRONG });
        }
       
    }
    
})

exports.updateUser = (async (req, res) => {
    if (!req.body) {
        res.status(500).send(errors.messages.SOMETHING_WENT_WRONG);
    }
    const reqUser = req.body.user;
    try {
        let userDoc = await User.findByIdAndUpdate({ _id: reqUser.id }, reqUser, {new:true}); 
        res.json({
            success: true,
            msg: errors.messages.UPDATED_SUCCESS,
            data: userDoc
        });
    }
    catch (e) {
        res.status(500).send(e);
    }


})
exports.deleteUser = (async (req, res) => {
    if (!req.body) {
      res.status(500).send(errors.messages.SOMETHING_WENT_WRONG);
    }
    try {
        await User.deleteOne({ _id: req.query.id });
        res.json({
          success: true,
          msg: errors.messages.DELETE_SUCCESS,
        });
    } catch (e) {
        res.status(500).send(e);
    }
})

exports.getTransferAddresses = (async (req, res) => {
     if (!req) {
        res.status(500).send( "Unable to process request");
    }
    const addresses = await User.find({}, '_id');
    if (addresses) {
        res.json({ success: true, data: addresses.map(address => ({id: address._id})) });
    }
    else {
        res.status(500).send({success: false, data: null, error: res?.error});
    }
})


const updateLoginAttempts = async (user, isReset) => {
    let payload = { id: user.id, loginAttempts: user.loginAttempts, isReset };
    console.log(payload);
    try {
            if (payload.isReset) {
                payload.loginAttempts = 0;
            }
            const response = await User.findOneAndUpdate(
            { _id: payload.id },
                {
                    $set: { ['loginAttempts']: payload.loginAttempts },
                },
                {new:true}
            );
            console.log("result ",response);
            const returnUser = {
                name: response.name,
                email: response.email,
                id: response._id,
                homeAddress: response.homeAddress,
                cnic: response.cnic,
                loginAttempts: response.loginAttempts,
                isBlocked: response.isBlocked
            }
    } catch (e) {
        console.log(e);
        }
}


const blockUser = (async (user) => {
   
    try {
        const response = await User.findOneAndUpdate(
        { _id: user.id },
            {
                $set: { ['isBlocked']: user.isBlocked },
            },
            {new:true}
        );
        const returnUser = {
            name: response.name,
            email: response.email,
            id: response._id,
            homeAddress: response.homeAddress,
            cnic: response.cnic,
            loginAttempts: response.loginAttempts,
            isBlocked: response.isBlocked
        }
       
    }catch (e) {
                console.log(e);

    }
})