const router = require("express").Router()
const { registerUser, getUser, loginUser } = require('../controller/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getUser)

module.exports = router;