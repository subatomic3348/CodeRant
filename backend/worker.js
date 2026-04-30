
const { MAX_RETRY, TIME_OUT } = require('./constant');
const { clientRedis, workerRedis } = require('./redis')
 const runTestCase = require('./tests-runner')
const languages = require('./utils/language')

 async function worker(){
    let heartBeatInterval;

  console.log('Worker A running');
  while(true){
     
      let file = ""
       let lang = ""
       let code = ""
       let id = ""
  try {

   
    
        const task = await workerRedis.brpoplpush("JobQueue","ProcessingQueue",0)
        console.log(task);
        
        console.log('Woker A picked', task);
        
        if(!task) continue
        const getJob = await workerRedis.get(task)
        console.log(getJob);
        
        
        if(!getJob){
            console.log('worker picked job but no job found');
            continue
            
        }
        const execution = JSON.parse(getJob)
        if(execution.status==="COMPLETED"){
            await workerRedis.lrem("ProcessingQueue",1,task)
            continue
        }
         if(execution.attempts>MAX_RETRY){
            execution.status = "DEAD"
            await workerRedis.set(task,JSON.stringify(execution))
            await workerRedis.lrem("ProcessingQueue",1,task)
            await workerRedis.rpush("deadLetterQueue",task)
            continue
         }
         execution.attempts = (execution.attempts||0)+1
        execution.status = "RUNNING"
        execution.startedAt = Date.now()
        execution.lastHeartBeat = Date.now()
       
        const runningExecution = JSON.stringify(execution)
        await workerRedis.set(task,runningExecution)

        lang = execution.language
         code = execution.code
         id = execution.id
   

        
         heartBeatInterval = setInterval(async()=>{
                execution.lastHeartBeat = Date.now()
                await workerRedis.set(task,JSON.stringify(execution))

            },3000)
        const answer = await runTestCase(code,lang)
        execution.lastHeartBeat = Date.now()
        execution.status = "COMPLETED"
        execution.result = answer
        
        const completeExecution = JSON.stringify(execution)
        await workerRedis.set(task,completeExecution)
        await workerRedis.lrem("ProcessingQueue",1,task)
        console.log(answer);
        }
        
    
    catch(e){
         console.error("Worker error:", e)

    if (execution) {
        execution.status = "FAILED"
        execution.result = {
            status:"SYSTEM_ERROR",
            error:e
        }
        }
        await workerRedis.set(task,JSON.stringify(execution))
       
      

    }
    finally{
        clearInterval(heartBeatInterval)
      
    }
    
  }
}
module.exports = worker