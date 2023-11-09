import { generateReminders, addReminders, deleteReminders, fetchScheduledJobs } from "../utils/helpers.js";
import { validationResult } from "express-validator";
import TaskModel from "../models/TaskyModel.js";

async function fetchAllTasks(req, res) {
    try {
        let tasks = await TaskModel.find({});
        res.send(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function fetchTask(req, res) {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.status(400).json({ error: result.array() });
        } else {
            let taskid = req.params.taskid;
            let task = await TaskModel.findById(`${taskid}`)
            if (task) res.status(200).json(task)
            else res.status(200).json({ error: `invalid ID` }); //successfull query but db does not have it 
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addTask(req, res) {
    try {
        const result = validationResult(req); //if there are no errors, isEmpty returns true since string (errors []) is empty
        if (!result.isEmpty()) {
            console.log(result.array());
            res.status(400).json({ error: result.array()[0].msg });
        } else {
            //model instantiated with client data based on defined model
            let taskData = new TaskModel(req.body);
            taskData.reminders = generateReminders(taskData.deadline);
            await taskData.save();
            res.status(200).json({ message: "task has been added successfully" });
            addReminders(taskData); //schedule towards the end in-order to not delay response
            console.log(fetchScheduledJobs());
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

async function editTask(req,res){
    try{
        const result = validationResult(req);
        if(!result.isEmpty()){
            console.log(result.array());
            res.status(400).json({error : result.array()[0].msg});
        }else{
            let taskid = req.params.taskid;
            if(req.body.status == 'false'){//false -> re-generate reminders
                req.body.reminders = generateReminders(req.body.deadline); //converted to date type
            }
            let updatedTask = await TaskModel.findByIdAndUpdate(taskid, req.body, {new : true});
            if(!updatedTask){
                res.status(200).json({message : "task ID invalid"});
            }else{
                res.status(200).json({message : "task has been updated successfully"});
                if(!updatedTask.status){//re-schedule
                    deleteReminders(taskid);
                    addReminders(updatedTask);
                }else{
                    deleteReminders(taskid);
                }
            }
        }
    }catch(error){
        console.log(error.message);
        res.status(500).json({error : error.message});
    }
}

async function deleteTask(req,res){
    try{
        const result = validationResult(req);
        if(!result.isEmpty()){
            console.log(result.array());
            res.status(400).json({error : result.array()[0].msg});
        }else{
            let taskid = req.params.taskid;
            deleteReminders(taskid);
            let deletedTask = await TaskModel.findByIdAndRemove(taskid);
            if(!deletedTask){
            res.status(200).json({message : "task ID invalid"});
            }else{
            res.status(200).json({message : "task has been deleted successfully"});
            }
        }
    }catch(error){
        res.status(500).json({error : error.message});
    }
}

export { fetchAllTasks, fetchTask, addTask, editTask, deleteTask }