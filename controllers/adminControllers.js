import { fetchScheduledJobs } from "../utils/helpers.js";

async function getJobsScheduled(req, res){
    try{
        let jobs = fetchScheduledJobs();
        res.send(jobs);
    }catch(error){
        console.log(error.message);
    }
}

export { getJobsScheduled }