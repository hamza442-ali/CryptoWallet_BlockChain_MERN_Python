const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    userName: String,
    userEmail: String,
    password: String,
    publicKey: {
        type: String,
        default: 'your_default_public_key'
    },
    privateKey: {
        type: String,
        default: 'your_default_private_key'
    },
    walletAddress: String,
    bitcoin: String,
    
});

const users = mongoose.model('user', userSchema);
module.exports = users;
