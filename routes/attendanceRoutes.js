const express = require('express')
const router = express.Router()
const { markAttendance, getAttendance } = require('../controller/attendanceDataController')


router.post('/markAttendance', markAttendance)
router.get('/getAttendance/:customerId', getAttendance)

module.exports = router