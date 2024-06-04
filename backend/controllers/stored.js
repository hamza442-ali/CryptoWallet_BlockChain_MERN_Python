const Transaction = require('../models/transactionModel');
const User = require('../models/signupModel')

// create transaction
const { exec } = require('child_process');


const calculateTransactionFee = (transactionSize, priority) => {
    // Fee calculation logic
    const baseFeeRate = 0.0001; // Base fee rate per byte

    // Priority factor (e.g., higher priority, higher fee)
    const priorityFactor = priority === 'high' ? 2 : 1;

    // Calculate the total fee based on transaction size and priority
    const totalFee = baseFeeRate * transactionSize * priorityFactor;

    return totalFee;
};

const createTransaction = async (req, res) => {
    console.log(req.body, " Body data here");

    try {
        const { amount, priority, publickey, receiverPublicKey } = req.body;

        // Simulating the calculation of transaction size (in bytes)
        const transactionSize = JSON.stringify(req.body).length;

        // Calculate transaction fee
        const transactionFee = calculateTransactionFee(transactionSize, priority);

        // console.log(transactionFee, amount, priority, publickey, receiverPublicKey, " Transaction Fee");

        // Create a new transaction instance
        const newTransaction = new Transaction({
            priority,
            amount,
            recipientAddress: receiverPublicKey,
            senderAddress: publickey,
            fee: transactionFee
        });

        // Update sender's balance (deduct transaction amount and fee)
        const sender = await User.findOne({ publicKey: publickey });
        sender.bitcoin -= (amount + transactionFee);
        await sender.save();

        localStorage.setItem('userInformation', JSON.stringify(sender));
        const storedUserInformation = localStorage.getItem('userInformation');
        console.log(storedUserInformation, " Stored Info")

        
        // Update receiver's balance (add transaction amount)
        const rec = await User.findOne({ publicKey: receiverPublicKey });
        // console.log(" Reciever Bitcoin", rec)
        rec.bitcoin = Number(rec.bitcoin) + amount;
        await rec.save();

        // Save the transaction to the database
        await newTransaction.save();

        


        // Execute the Python script as a child process
        const pythonProcess = exec(
            'python scripts/transaction.py',  // Update with the correct Python script name
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing Python script: ${error}`);
                    return;
                }
                console.log(`Python script output: ${stdout}`);
            }
        );

        // Send data to the Python script
        const dataToSend = JSON.stringify(req.body);
        pythonProcess.stdin.write(dataToSend);
        pythonProcess.stdin.end();

        res.status(201).json({
            status: 'success',
            message: 'Transaction created and sent to Python script'
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// get all transactions on the base of publickey
const getTransactions = async (req, res) => {
    const publicKey = req.query.publicKey; // Use req.query instead of req.body
    // console.log(publicKey, " Backend Public key ");

    try {
        const transactions = await Transaction.find({ senderAddress: publicKey });
        res.status(200).json({
            status: 'success',
            data: transactions
        });

        console.log(transactions, " Transactions here");
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};


// get user 
const getUser = async (req, res) => {
    const publicKey = req.query.publicKey; // Use req.query instead of req.body
    console.log(publicKey, " Backend Public key ");

    try {
        const user = await User.findOne({ publicKey: publicKey });
        res.status(200).json({
            status: 'success',
            data: user
        });

        console.log(user, " User here");
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};





module.exports = {
    createTransaction,
    getTransactions,
    getUser
  };
  