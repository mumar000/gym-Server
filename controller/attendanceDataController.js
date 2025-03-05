const customerData = require('../model/customerDataSchema')

exports.markAttendance = async (req, res) => {
    try {
        if (!req.body.customerId) {
            return res.status(400).send({
                status: false,
                message: 'Customer ID is required'
            });
        }

        const customer = await customerData.findOne({ customerId: req.body.customerId });
        if (!customer) {
            return res.status(404).send({
                status: false,
                message: 'Customer not found'
            });
        }

        const now = new Date();
        const localTime = new Date(now.getTime() + 5 * 60 * 60 * 1000);

        if (customer.attendance.length > 0) {
            const lastAttendance = customer.attendance[customer.attendance.length - 1];

            // Assuming lastAttendance is already in local time
            const timeDiff = localTime - lastAttendance;
            const hoursDiff = timeDiff / (1000 * 60 * 60);

            if (hoursDiff < 24) {
                return res.status(400).send({
                    status: false,
                    message: 'Attendance already marked in the last 24 hours'
                });
            }
        }

        customer.attendance.push(localTime);
        await customer.save();

        res.status(200).send({
            status: true,
            message: 'Attendance marked successfully',
            customer
        });
    } catch (error) {
        console.error("Error", error);
        res.status(500).send({
            status: false,
            message: 'Internal Server Error'
        });
    }
};


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



