const express= require('express')
const router = express.Router()
const  { updatePaymentRequest } = require('../controller/paymentData')

router.put('/updatePayment/:id', updatePaymentRequest)

module.exports = router