import express from "express";
import basicAuth from "express-basic-auth";
import { getJobsScheduled } from "../controllers/adminControllers.js";
const router = express.Router();

router.use(basicAuth({
    users : {'admin' : 'secret'},
    challenge : true
}));

//implement auth middleware -> display chrons
router.get("/", getJobsScheduled);


export default router;