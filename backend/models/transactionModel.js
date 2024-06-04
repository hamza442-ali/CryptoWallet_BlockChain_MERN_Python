const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a sub-schema for transactions
const transactionSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },

    priority: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },
    recipientAddress: String,
    senderAddress: String,
    fee: {
        type: Number,
        default: 0
    }
 
    
});


// Create a model for the user schema
const trans = mongoose.model('transaction', transactionSchema);

module.exports = trans;
