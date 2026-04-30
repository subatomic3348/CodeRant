const { MAX_RETRY, TIME_OUT } = require("./constant")
const { workerRedis } = require("./redis")
 async function recoveryWorker (){
    const jobs = await workerRedis.lrange("ProcessingQueue",0,-1)
    for(const jobId of jobs){
        const data = await workerRedis.get(jobId)
        if(!data)continue
        const job = JSON.parse(data)
        if(Date.now()-job.lastHeartBeat>TIME_OUT){
            await workerRedis.lrem("ProcessingQueue",1,jobId)
            await workerRedis.lpush("JobQueue",jobId)
        }
    }
}
module.exports = recoveryWorker