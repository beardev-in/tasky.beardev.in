import express from "express";
import { isDataValid } from "../utils/helpers.js";
import { fetchAllTasks, fetchTask, addTask, editTask, deleteTask} from "../controllers/tasksControllers.js";
import {body, param} from "express-validator";
const router = express.Router();

router.get("/", 
    fetchAllTasks);

router.get("/:taskid",
    param('taskid').isMongoId().withMessage("the taskId must be mongo object ID"),
    fetchTask);

router.post("/add", 
    isDataValid(), 
    addTask);

router.put("/edit/:taskid",
    body("status").isBoolean().withMessage("status must be boollean"),
    isDataValid(),
    param('taskid').isMongoId().withMessage("the taskId must be mongo object ID"),
    editTask);

router.delete("/delete/:taskid", 
    param('taskid').isMongoId().withMessage("the taskId must be mongo object ID"),
    deleteTask);

export default router;