import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema({


    user: {
        type: ObjectId,
        ref: 'User'
    },
    taskName:{
        type:String
    },
    taskType:{
        type:String
    }


}, { timestamps: true })



export default mongoose.model('Task', taskSchema)

