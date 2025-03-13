const mongoose = require('mongoose');


// Function to connect to MongoDB
module.exports.dbConnect=async()=> {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb://localhost:27017",{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 600000, // ⏳ 10-minute timeout for initial connection
            socketTimeoutMS: 600000, // ⏳ 10-minute timeout for MongoDB operations
        } );
        console.log('Connected to MongoDB using Mongoose');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}


