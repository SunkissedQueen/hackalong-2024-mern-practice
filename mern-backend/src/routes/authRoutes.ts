const express = require('express')
const { signup } = require('../controllers/signupController')
const { signin } = require('../controllers/signinController')

const router = express.Router()

router.post('/signup', signup)
router.post('/signin', signin)

module.exports = router

export default router