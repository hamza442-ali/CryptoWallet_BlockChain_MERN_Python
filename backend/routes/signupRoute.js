

const express = require('express');
const router = express.Router();


const userController = require('../controllers/signupController')


// Create a new panel
router.post('/createUser', userController.createUser)

// Retrieve all panels
// router.get('/getUser', userController.getUser);

router.post('/login', userController.loginUser)





module.exports = router;