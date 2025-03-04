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
      required: false,
    },
    age: {
      type:Number,
      required:false,
    },
    gender: {
      type:String,
      required:true
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
      enum: ["paid", "unpaid","pending"],
    },
    lastPaymentDate: {
      type:Date,
    },
    paymentHistory: [
      {
        reciever: {
          type:String,
          required:true
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
    attendance: [{
        type:Date,
        default:Date.now()
    }]
    
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Customer model
const customerData = mongoose.model("Customer", customerSchema);

module.exports = customerData;

