const express = require('express')
const app = express()
app.use(express.json())
const { spawn } = require('node:child_process')
const fs = require("fs")
const { exit } = require('node:process')
const fsPromises = require('fs').promises
const langauges = require('./utils/language')
const runTestCase = require('./tests-runner')
const languages = require('./utils/language')
const Redis = require('ioredis')

const redis = new Redis()








app.post('/submit',async(req,res)=>{
 const jobId = crypto.randomUUID()
 const job = {
    id:jobId,
    code:req.body.code,
    language:req.body.language,
    status:"PENDING",
    result:null
 }
 
  redis.set(jobId,JSON.stringify(job))
  console.log('job added');
 await   redis.lpush("JobQueue",jobId)
  
  
  
   res.json({
    jobId
    
  })
  
})
 const worker = async ()=>{
    
      
  console.log('Worker A running');
  
    
   
        const task = await redis.rpop("JobQueue")
        console.log(task);
        
        console.log('Woker A picked', task);
        
        if(!task) return
        const getJob = await redis.get(task)
        console.log(getJob);
        
        
        if(!getJob){
            console.log('worker picked job but no job found');
            
        }
        const execution = JSON.parse(getJob)

        
        execution.status = "RUNNING"
        const lang = execution.language
        const code = execution.code
        const id = execution.id
      const file = `./temp-${id}${languages[lang].extension}`
      const binaryFile = `./temp-1${id}`
        await fs.promises.writeFile(file,code,{
            encoding:"utf-8"
        })
        try{
        const answer = await runTestCase(file,lang,binaryFile)
        execution.status = "COMPLETED"
        execution.result = answer
        console.log(answer);
        }
        
    
    catch(e){
        execution.status = "FAILED",
        execution.result = {
            status:"SYSTEM_ERROR",
            error:e
        }
      

    }
    finally{
        fs.unlink(file,err=>{
            if(err){
                console.log('error while deleting code file');
                
            }
            else{
                console.log(`${file} deleted`);
                
            }
        })
        if(langauges[lang].compile){
            fs.unlinkSync(binaryFile)
            console.log('binary file deleted');
            
        }
    }
    

}


setInterval(worker
,1000)



const port1 = 3001

app.listen(port1,()=>{
    console.log(`app is listening on port ${port1}`);
    
})