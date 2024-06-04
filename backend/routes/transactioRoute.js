

const express = require('express');
const router = express.Router();


const transactionController = require('../controllers/transactionController')



router.post('/create', transactionController.createTransaction)

// get transaction 
router.get('/get', transactionController.getTransactions)

// get user
// router.get('/getUser', transactionController.getUser)





module.exports = router;