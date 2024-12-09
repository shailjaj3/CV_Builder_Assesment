const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("../config/connectDB"); 
const userRoutes = require("../router/userRoutes"); 
const cvRoutes = require('../router/cvRoutes');  
const uploadRoute = require('../controllers/routeUpload');

// Load environment variables as early as possible
dotenv.config();

// Initialize Express app
const app = express();

// Use Helmet for security by setting various HTTP headers
app.use(helmet());

// Use Morgan for logging HTTP requests (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Use CORS for cross-origin requests
app.use(cors());

// Connect to the database
connectDB().catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit if the connection fails
});

// Define port and hostname
const port = process.env.PORT || 5000; 
const hostname = process.env.HOSTNAME || 'localhost';

// Middleware to parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define routes
app.use('/api/v1/cv', cvRoutes);
app.use("/api/v1/auth", userRoutes); 
app.use("/api/users", uploadRoute);

// // Handle undefined routes (404)
// app.use((req, res, next) => {
//     res.status(404).json({
//         success: false,
//         message: "API route not found",
//     });
// });

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
    });
});

// Start the server
app.listen(port, hostname, () => {
    console.log(`Server is working at http://${hostname}:${port}`);
});
