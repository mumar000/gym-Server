const mongoose = require('mongoose');
const customerData = require('./model/customerDataSchema'); // Ensure the path is correct
const xlsx = require('xlsx');
const colors = require('colors');

// Connect to MongoDB
mongoose.connect('mongodb+srv://umar9943:12345@cluster0.a2phy.mongodb.net/gymData?retryWrites=true&w=majority&appName=Cluster0');

// Read the Excel file
const workbook = xlsx.readFile('./sample_customers.xlsx'); // Ensure the file path is correct
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName]; // Fixed: Use workbook.Sheets[sheetName]

// Convert the sheet to JSON
const data = xlsx.utils.sheet_to_json(worksheet);

// Function to generate a customer ID
const generateCustomerId = () => {
    const prefix = "CFC";
    const randomNum = Math.floor(Math.random() * 2000); // Generates a random number between 0 and 1999
    return `${prefix}${randomNum}`;
};

// Function to import data
const importData = async () => {
    try {
        for (let row of data) {
            const customer = new customerData({
                customerId: row.customerId || generateCustomerId(),
                name: row.name,
                fatherName: row.fatherName || '',
                date: row.date ? new Date(row.date) : new Date(),
                address: row.address || '',
                age: row.age || null,
                gender: row.gender || 'unknown', // Fixed ternary issue
                weight: row.weight || null,
                cardio: row.cardio || '',
                locker: row.locker || '',
                admissionFee: row.admissionFee || 0,
                monthlyFee: row.monthlyFee || 0,
                paymentStatus: row.paymentStatus || 'unpaid',
                lastPaymentDate: row.lastPaymentDate ? new Date(row.lastPaymentDate) : null,
                paymentHistory: [],
                attendance: []
            });

            await customer.save();
            console.log(`Customer ${customer.name} imported successfully`.green);
        }
        console.log("Data imported successfully".green);
    } catch (error) {
        console.error("Error importing data:".red, error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the import function
importData();