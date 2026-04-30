const { clientRedis, workerRedis } = require("./redis");

module.exports = function(app){
  app.post('/submit',async(req,res)=>{
    

 const jobId = crypto.randomUUID()
 console.log(jobId);
 
 const job = {
    id:jobId,
    code:req.body.code,
    language:req.body.language,
    status:"PENDING",
    result:null,
    startedAt:null,
    attempts:0,
    lastHeartBeat:null
 }
 

await clientRedis.set(jobId, JSON.stringify(job))


await clientRedis.lpush("JobQueue", jobId)


res.json({ job: jobId })
  
})
app.get('/result/:id',async(req,res)=>{
    const job = await workerRedis.get(req.params.id)
    if(!job){
        return res.json({
            message:'job not found'
        })
    }
    res.json(JSON.parse(job))
})

}