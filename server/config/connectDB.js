const mongoose = require("mongoose");
const dotenv = require('dotenv');

dotenv.config();

const MONGOURL = process.env.MONGOURL


const connectDB = async() => {
    try {
        await mongoose.connect(MONGOURL)
        console.log("connetion sucessfully Mongodb Database")
    } catch (error) {
        console.log("failed connection", error)
    }

}

module.exports = connectDB