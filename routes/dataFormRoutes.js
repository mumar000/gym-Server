const express = require('express')
const router = express.Router();

const { getCustomerData,createCustomerData,deleteCustomerData,updatePaymentStatus } = require('../controller/customerDataController')

router.get('/customerData', getCustomerData)
router.post('/customerData', createCustomerData)
router.put('/customerData/:id',updatePaymentStatus)
router.delete('/customerData/:id',deleteCustomerData)


module.exports = router;