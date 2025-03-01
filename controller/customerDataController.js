const customerData = require('../model/customerDataSchema');

//@desc Get customer
//@route GET /customerData
//@access Private
const getCustomerData = async (req, res) => {
    try {
        const customers = await customerData.find().limit(50); // Limit results to prevent large payload
        return res.status(200).json({
            status: true,
            message: 'Data of the Clients',
            data: customers
        });
    } catch (error) {
        console.error("Error fetching data of the clients:", error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
};

//@desc Create customer
//@route POST /customerData
//@access Private
const createCustomerData = async (req, res) => {
    const { name, fatherName, contact, address, weight, cardio, age, gender, locker, monthlyFee, date, admissionFee, paymentStatus, lastPaymentDate } = req.body;

    // Validate required fields
    if (!name || !fatherName || !contact || !address || !monthlyFee || !admissionFee || !paymentStatus || !date || !gender ) {
        return res.status(400).send({
            status: false,
            message: 'Please fill all required fields'
        });
    }

    const generateCustomerId =  () => {
        const prefix = "CFC";
        const randomString = Math.random().toString(36).substring(2,8).toUpperCase()
        return `${prefix}${randomString}`
      };

    const customerId = generateCustomerId()

    // Save customer data
    const customerFields = new customerData({ customerId, name, fatherName, contact, address,age,gender, weight, cardio, locker, monthlyFee, date, admissionFee, paymentStatus, lastPaymentDate, paymentHistory: [
        {
        reciever:"Admin",
        paymentDate: new Date(),
        amount:monthlyFee
        }
    ] 
});

    customerFields.save()
        .then((savedData) => {
            return res.status(200).send({
                status: true,
                message: 'Customer Data Saved Successfully',
                data: savedData
            });
        })
        .catch((error) => {
            console.log("Error Creating Customer Detail", error);
            return res.status(400).send({
                status: false,
                message: 'Error creating data',
            });
        });
};

//@desc update customer data
//@route PUT /customerData
//@access Private
const updatePaymentStatus = (req, res) => {

    const { id } = req.params;
    const { paymentStatus } = req.body;

    if(!paymentStatus){
        return res.status(500).send({
            status:false,
            message:'Please enter payment Status'
        })
    }

    //prepare the update object
    const updateData = { paymentStatus }

    if ( paymentStatus === "paid" ){
        updateData.lastPaymentDate = new Date(); 
    }

    if (updateData.lastPaymentDate) {
        const paymentDate = new Date(updateData.lastPaymentDate);
        const currentDate = new Date();
        const timeDifference = currentDate - paymentDate; // Difference in milliseconds
        const daysDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert to days
  
        updateData.paymentStatus = daysDifference <= 30 ? "paid" : "pending";
      }


    customerData.findByIdAndUpdate(
        id, updateData, 
        { paymentStatus }, 
        { new: true }
    )
    .then((updatedCustomer) => {
        res.status(200).send({
            status:true,
            message:'Payment Status Updated Successfully',
            data:updatedCustomer
        })
    })
    .catch((error) => {
        console.log("Error Updating payment status", error);
        res.status(500).json({ error: "Failed to update the payment"})
    })
}


//@desc delete the customer data
//@route DELETE /customerData
//@access Private
const deleteCustomerData = async (req, res) => {
    const { id } = req.params

    if(!id) {
        return res.status(500).send({
            status:false,
            message:'Please Enter valid id for delete'
        })
    }

    customerData.findByIdAndDelete(id)
    .then((deleteRequest) => {
        if(!deleteRequest){
            return res.status(400).send({
                status:false,
                message:'Unable to find the id'
            })
        }

        return res.status(200).send({
            status:true,
            message:'Customer Data deleted successfully'
        })
    })
    .catch((error) => {
        console.log("Error deleting the data ", error)
        return res.status(500).send({
            status:true,
            message:'Error deleting the data'
        })
    })
}






// Export both functions
module.exports = { getCustomerData, createCustomerData, deleteCustomerData, updatePaymentStatus };
