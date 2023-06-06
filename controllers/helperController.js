const bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);

exports.encryptPassword = (password) => {
    return bcrypt.hashSync(password, salt);
}
exports.matchPassword = (password, hash) => {
    console.log(password, hash)
    return bcrypt.compareSync(password, hash);
}