import {body} from 'express-validator'
import { scheduleJob, scheduledJobs } from 'node-schedule'
import twilio from "twilio"
import fs from "fs"

function writeLog(req, res, next){
    let data = {};
    data.ip = req.connection.remoteAddress; //req.socket.remoteAddress or req.ip
    data.time = new Date().toISOString();
    data.userAgent = req.headers[`user-agent`];
    data.method = req.method;
    data.url = req.url;
    data.referer = req.headers.referer || "-";
    data.contentLength = parseInt(req.headers['content-length'], 10) || "-" ;
    res.on("finish", ()=>{
        req.log = ` ip : ${data.ip}\n time : ${data.time}\n userAgent : ${data.userAgent}\n method : ${data.method}\n url : ${data.url}\n referer : ${data.referer}\n contentLength : ${data.contentLength}\n statusCode : ${res.statusCode}\n`;
        fs.appendFileSync("logs/logs.txt", req.log);
    })    
    next();
}

function isDataValid(){
     //validation middleware for fields return an array of error objects when invoked
        return [
            body("taskname")
                .isLength({min : 6})
                .withMessage("TaskName must be a minimum of 6 characters"), 
                //ensure that custom validation middleware returns a boollean value. 'value' arg passed to anonymous function is "deadline" (specific field of that payload)
            body("deadline")
                .custom((value, {req})=>{
                //deadline isn't checked if status is true
                if(req.body.status == 'true')return true;
                //req object is made available in order to access other payload fields if needed
                let inputDate = new Date(`${value}`);
                let currentDate = new Date();
                let dateInMin = (inputDate.getTime()) / (1000 * 60); 
                let currentInMin = (currentDate.getTime()) / (1000*60);
                let thirtyDays = 30*24*60;
                if(!Date.parse(value)){
                    return false;
                }else if(inputDate < currentDate){
                    return false;
                }
                else if(dateInMin < currentInMin+15){
                    return false;
                }
                else if(dateInMin > (currentInMin + thirtyDays)){
                    return false;
                }
                return true;
            })
                .withMessage("Deadline must be of valid format, cannot be backdated, cannot be within 15 minitutes from current time and cannot exceed 30 days from today")
        ];
    //next(); -> since next can't be invoked, isDataValid function is invoked 
}

function generateReminders(deadline){
    const currentTime = new Date();
    deadline = new Date(deadline);
    const timeDiff = deadline - currentTime;
    let reminders = [], reminder, scheduled;
    for(let i=1; i<4; i++){
        reminder = (timeDiff * i/4);
        scheduled = new Date(currentTime.getTime() + reminder);
        reminders.push(scheduled) //current time + reminder = first reminder
    }
    return reminders;
}

async function addReminders(taskData){
    //adding reminders to scheduler pool
    let twilioCreds = {
        "phone_number" : "+18149759658",
        "account_SID" : "ACda2939f41097cb803bc23afc45c418b7",
        "auth_token" : "4a78a2a582587fb2761450c66e20c17e"
    }
    const client = new twilio(twilioCreds.account_SID, twilioCreds.auth_token);
    let reminders = taskData.reminders, count = 0;
    reminders.forEach((el)=>{
        scheduleJob(`${taskData._id}${++count}`, new Date(el) , async function(){
            try{
                const message_status = await client.messages.create({
                    from : twilioCreds.phone_number,
                    body : `reminder ${count} : ${taskData.taskName}`,
                    to : `+917780424502`
                })
                console.log(message_status.sid);
            }catch(error){
                console.log(error.message);        
            }
        }
        )
    }) 
}

function deleteReminders(id){
    let job;
    for(const jobId in scheduledJobs){
        job = scheduledJobs[jobId];
        console.log(jobId.slice(0, jobId.length-1));
        if(jobId.slice(0, jobId.length-1) == id){
            job.cancel();
        }
    }
    console.log("jobs for given ID are deleted");
}

function fetchScheduledJobs(){
    let jobs = [], obj={};
    for(const jobId in scheduledJobs){
        obj._id = jobId;
        obj.timeStamp = scheduledJobs[jobId].nextInvocation().toString();
        jobs.push(obj);
        obj = {};
    }
    return jobs;
}

 export {
    writeLog, isDataValid, generateReminders, addReminders, deleteReminders, fetchScheduledJobs
 }