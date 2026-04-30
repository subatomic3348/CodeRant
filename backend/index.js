const express = require('express')
const app = express()
app.use(express.json())
// const fs = require("fs")
// const langauges = require('./utils/language')
// const runTestCase = require('./tests-runner')
// const languages = require('./utils/language')
// const Redis = require('ioredis')

// const clientRedis = new Redis()
// const workerRedis = new Redis()

// const MAX_RETRY = 3
// const TIME_OUT = 10000
// app.post('/submit',async(req,res)=>{
    

//  const jobId = crypto.randomUUID()
//  console.log(jobId);
 
//  const job = {
//     id:jobId,
//     code:req.body.code,
//     language:req.body.language,
//     status:"PENDING",
//     result:null,
//     startedAt:null,
//     attempts:0,
//     lastHeartBeat:null
//  }
 

// await clientRedis.set(jobId, JSON.stringify(job))


// await clientRedis.lpush("JobQueue", jobId)


// res.json({ job: jobId })
  
// })
//  const worker = async ()=>{
//     let heartBeatInterval;
    
//   console.log('Worker A running');
//   while(true){
     
//       let file = ""
//       let binaryFile = ""
//        let lang = ""
//        let code = ""
//        let id = ""
//   try {

   
    
//         const task = await workerRedis.brpoplpush("JobQueue","ProcessingQueue",0)
//         console.log(task);
        
//         console.log('Woker A picked', task);
        
//         if(!task) continue
//         const getJob = await workerRedis.get(task)
//         console.log(getJob);
        
        
//         if(!getJob){
//             console.log('worker picked job but no job found');
//             continue
            
//         }
//         const execution = JSON.parse(getJob)
//         if(execution.status==="COMPLETED"){
//             await workerRedis.lrem("ProcessingQueue",1,task)
//             continue
//         }
//          if(execution.attempts>MAX_RETRY){
//             execution.status = "DEAD"
//             await workerRedis.set(task,JSON.stringify(execution))
//             await workerRedis.lrem("ProcessingQueue",1,task)
//             await workerRedis.rpush("deadLetterQueue",task)
//             continue
//          }
//          execution.attempts = (execution.attempts||0)+1
//         execution.status = "RUNNING"
//         execution.startedAt = Date.now()
//         execution.lastHeartBeat = Date.now()
       
//         const runningExecution = JSON.stringify(execution)
//         await workerRedis.set(task,runningExecution)

//         lang = execution.language
//          code = execution.code
//          id = execution.id
   

        
//          heartBeatInterval = setInterval(async()=>{
//                 execution.lastHeartBeat = Date.now()
//                 await workerRedis.set(task,JSON.stringify(execution))

//             },3000)
//         const answer = await runTestCase(code,lang)
//         execution.lastHeartBeat = Date.now()
//         execution.status = "COMPLETED"
//         execution.result = answer
        
//         const completeExecution = JSON.stringify(execution)
//         await workerRedis.set(task,completeExecution)
//         await workerRedis.lrem("ProcessingQueue",1,task)
//         console.log(answer);
//         }
        
    
//     catch(e){
//          console.error("Worker error:", e)

//     if (execution) {
//         execution.status = "FAILED"
//         execution.result = {
//             status:"SYSTEM_ERROR",
//             error:e
//         }
//         }
//         await workerRedis.set(task,JSON.stringify(execution))
       
      

//     }
//     finally{
//         clearInterval(heartBeatInterval)
      
//     }
    
//   }
// }
// const recoveryWorker = async ()=>{
//     const jobs = await workerRedis.lrange("ProcessingQueue",0,-1)
//     for(const jobId of jobs){
//         const data = await workerRedis.get(jobId)
//         if(!data)continue
//         const job = JSON.parse(data)
//         if(Date.now()-job.lastHeartBeat>TIME_OUT){
//             await workerRedis.lrem("ProcessingQueue",1,jobId)
//             await workerRedis.lpush("JobQueue",jobId)
//         }
//     }
// }
const worker = require('./worker')
const recoveryWorker = require('./recovery')

 require('./submit-routes')(app)


worker()
setInterval(recoveryWorker,5000)

// app.get('/result/:id',async(req,res)=>{
//     const job = await workerRedis.get(req.params.id)
//     if(!job){
//         return res.json({
//             message:'job not found'
//         })
//     }
//     res.json(JSON.parse(job))
// })

const port = 3000

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
    
})