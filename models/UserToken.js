const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new mongoose.Schema (
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User"
        },
        token: {
            type:String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            expires:300
        }
    }
);
const UserToken = mongoose.model('Token', TokenSchema);
module.exports = UserToken;
