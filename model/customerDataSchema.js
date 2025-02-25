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
      enum: ["paid", "unpaid","pending"],
      default:"paid" // Only allows "paid" or "unpaid"
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

customerSchema.pre("save", function (next) {
  if (this.isModified("paymentStatus") && this.paymentStatus === "paid") {
    // Schedule a task to update paymentStatus after 2 minutes (for testing)
    // const timeUntilUnpaid = 2 * 60 * 1000; // 2 minutes (for testing)
    const timeUntilUnpaid = 30 * 24 * 60 * 60 * 1000; // 30 days (for production)

    setTimeout(async () => {
      const customer = await this.constructor.findById(this._id);
      if (customer && customer.paymentStatus === "paid") {
        customer.paymentStatus = "unpaid";
        await customer.save();
        console.log(`Payment status updated to "unpaid" for customer ${customer._id}`);
      }
    }, timeUntilUnpaid);
  }
  next();
});

// Create the Customer model
const customerData = mongoose.model("Customer", customerSchema);

module.exports = customerData;

