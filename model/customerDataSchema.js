const mongoose = require("mongoose");

// Define the Customer schema
const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type:String,
      required:[true,"Customer Id is required"], 
      unique:true,
      index:true
    },
    // Compulsory fields
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    fatherName: {
      type: String,
      required: [true, "Father's name is required"],
    },
    contact: {
      type: String,
      required: [true, "Contact number is required"],
    },
    date:{
      type:Date,
      required:true 
    },
    // Optional fields
    address: {
      type: String,
      required: true,
    },
    weight: {
      type: Number,
      required: false,
      min: [0, "Weight cannot be negative"],
    },

    cardio: {
      type: String,
      required: false,
    },
    locker: {
      type: String,
      required: false,
    },
    admissionFee: {
        type: Number,
        required: [true, "Admission fee is required"],
        min: [0, "Admission fee cannot be negative"],
    },
    monthlyFee: {
        type: Number,
        required: [true, "Monthly fee is required"],
        min: [0, "Monthly fee cannot be negative"],
    },
    // Paid/Unpaid status
    paymentStatus: {
      type: String,
      enum: ["paid", "unpaid","pending"], // Only allows "paid" or "unpaid"
      default: "unpaid", // Default status is "unpaid"
    },
    lastPaymentDate: {
      type:Date,
    },
    paymentHistory: [
      {
        month: {
          type:String,
          required:false
        },
        amount: {
          type:Number,
          required:true
        },
        paymentDate: {
          type:Date,
          default:Date.now,
        }
      }
    ],
    attendance: {
      type:Date,
      default:Date.now()
    }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

customerSchema.pre("save", function(next) {
  if(this.lastPaymentDate) {
    const paymentDate = new Date(this.lastPaymentDate)
    const currentDate = new Date();
    const timeDifference = currentDate - paymentDate  //Difference in milisecond
    const daysInDifference = timeDifference / (1000 * 60 * 60 * 24) //Convert to days
  

  //Update paymentStatus based on the 30 day rule
  this.paymentStatus = daysInDifference <= 30 ? "paid" : "pending" ;
  } else {
    this.paymentStatus = "unpaid"
  }
  next();
})

// Create the Customer model
const customerData = mongoose.model("Customer", customerSchema);

module.exports = customerData;

