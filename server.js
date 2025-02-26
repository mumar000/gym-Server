const express = require('express');
const app = express();
const PORT = process.env.PORT || 4080;

const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
connectDB();

const cors = require('cors');

app.use(
    cors({
      origin: ["https://gym-dashboard-site.netlify.app",
                'http://localhost:5173'
      ], // Allow frontend URL
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true, // Allow cookies & authentication headers
    })
  );

app.options("*", cors());

app.use(express.json());

const dataFormRoute = require('./routes/dataFormRoutes');
app.use('/',dataFormRoute);

const paymentRoute = require('./routes/paymentRoute');
app.use('/', paymentRoute);

const attendanceRoutes = require('./routes/attendanceRoutes')
app.use('/',attendanceRoutes)

app.options('*', cors());  // This handles the preflight requests


app.get('/', (req, res) => {
    return res.status(200).send({
        status: true,
        message: 'Gym Server is running',
    });
});

app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
