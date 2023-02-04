// import mongoose from "mongoose";
const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({


    name: {
        type: String,
        required: true,
        unique: true
    },
    
    email: {
        type:String,
        required:true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    }


}, { timestamps: true })



// expor mongoose.model('user',userSchema)
module.exports =mongoose.model('user', userSchema)