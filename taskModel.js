import mongoose from "mongoose";
const ObjectId = mongoose.Schema.Types.ObjectId;

const taskSchema = new mongoose.Schema({


    user: { type: Schema.Types.ObjectId, ref: 'user' },
    taskName: String,
    taskType: String


}, { timestamps: true })



export default mongoose.model('task',taskSchema)