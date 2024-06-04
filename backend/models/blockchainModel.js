const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  recipient: { type: String, required: true },
  amount: { type: Number, required: true },

  
});

const blockSchema = new mongoose.Schema({
  previousBlockHash: { type: String, required: true },
  merkleRoot: { type: String, required: true },
  timestamp: { type: Date, default: Date.now, required: true },
  nonce: { type: Number, required: true },
  transactions: [transactionSchema],
  

});

const BlockchainModel = mongoose.model('Blockchain', blockSchema);

module.exports = BlockchainModel;
