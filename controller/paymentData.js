const customerData = require('../model/customerDataSchema');

const updatePaymentRequest = (req,res) => {
    const { id } = req.params;
    const { month, amount, paymentDate } = req.body

    if(!month || !amount  ) {
        return res.status(500).json({status:false, message:'Please enter valid fields'})
    }

    //Find the Customer Id
    customerData.findById(id)
    .then((customer) => {
        if(!customer) {
            return res.status(400).json({status:false, message:'Unable to find data'})
        }
    

    customer.paymentHistory.push({
        month,
        amount,
        paymentDate: paymentDate || Date.now(),
    })

    customer.lastPaymentDate = paymentDate || Date.now()
    return customer.save();
    })
    .then((updatedCustomer) => {
        res.status(200).json({status:true , message:'Payment Updated Successfully', updatedCustomer})
    })
    .catch((error) => {
        console.log("Error updating payment", error);
        res.status(500).json({message: 'Internal Server Error'})
    })

}

module.exports = {updatePaymentRequest}