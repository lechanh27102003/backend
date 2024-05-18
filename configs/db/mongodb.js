const mongoose = require('mongoose');
require('dotenv/config');

async function connect() {
    try {
        await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB successfully');
    }
    catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};
module.exports = {connect};