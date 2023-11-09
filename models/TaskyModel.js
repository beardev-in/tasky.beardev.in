import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    taskname : {
        type : String,
        required : true
    },
    deadline : {
        type : Date,
        required : true
    },
    status : {
        type : Boolean,
        default : false
    },
    reminders : {
        type : [Date]
    }
});

//model name, schema used, collection name
const TaskModel = new mongoose.model("Tasks", taskSchema, "tasks");

export default TaskModel;