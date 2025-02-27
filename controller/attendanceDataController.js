const customerData = require('../model/customerDataSchema')

exports.markAttendance = async (req,res) => {
    try {
        const customer = await customerData.findOne({customerId:req.body.customerId})
        if(!customer) {
            return res.status(500).send({
                status:false, 
                message:'Please enter valid Id'
            })
        }
        console.log(customer)
        customer.attendance.push(new Date());
        await customer.save();
        res.status(200).send({
            status:true,
            message:'Mark attendance successfully',
            customer
        })
    } catch(error) {
        console.log("Error", error)
    }
}

//get attendance history 
exports.getAttendance = async (req, res) => {
    try {
        const customer  = await customerData.findOne({customerId: req.params.customerId })
        if(!customer){ 
            return res.status(500).send({
                status:false,
                message:'Please enter valid id'
            })
        }
        res.status(200).send({status:true,attendance:customer.attendance})
    } catch(error) {
        console.log("Error geting customer attendance",error)
    }
}