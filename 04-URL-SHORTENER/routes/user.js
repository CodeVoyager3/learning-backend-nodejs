const express = require ('express')
const {handleUserAuthentication, handleUserLogin} = require('../controllers/user')
const router = express.Router()

router.post("/", handleUserAuthentication)
router.post("/login", handleUserLogin)

module.exports = router;