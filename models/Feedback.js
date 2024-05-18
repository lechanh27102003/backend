// feedbackModel.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    productID: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: true },
    dateTime:{type: Date, required:true},
    image:{type:String, required: false},
    userId : { type: String, required: true}
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
