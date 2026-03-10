const express = require('express')
const app = express()
app.use(express.json())
const { spawn } = require('node:child_process')
const fs = require("fs")
const fsPromises = require('fs').promises
app.post('/run',async(req,res)=>{
    const code = req.body.code
    const filePath = `/home/subatomic/codeRant/backend/temp${Date.now()}.py`
    try{
     const data = await runCodeFile(code,filePath)
      console.log(`data:${data}`);
      fs.unlinkSync(filePath)
      
       return res.json({
        result:data
       })
    }
    catch(e){
     console.log(e);
      return res.status(400).json({
        message:'error while running the code'
      })
     
    }
   
})


async function runCodeFile(code,filePath) {

    try {

        await fsPromises.writeFile(
                filePath, code, {
            encoding: "utf8",
            flag: "w",
            mode: 0o666
        });

        console.log("File written successfully\n");
        console.log("The written has the "
                + "following contents:");

   return new Promise((resolve,reject)=>{ 
     let stream = ""
     let finished = false
        const process = spawn('python3',[filePath])
        const timeout = setTimeout(()=>{
            if(finished) return
             finished = true
            process.kill('SIGKILL')
            reject(new Error('Time limit exceeded'))
        },2000)
     process.stdout.on('data',(data)=>{
        stream+=data
        console.log(`stdout:${data}`);

        
     }) 
     process.stderr.on('data',(data)=>{
        console.log(`stderr:${data}`);
       
           
     })
     process.on('close',(code)=>{
        if(finished) return
        finished = true
        clearTimeout(timeout)
        if(code!==0){
                reject(new Error(`python process exited with ${code}`))
                    
        }
        console.log(stream);
        
        resolve(stream)
       
     }) 
            
        
    })        

       
    }
    catch (err) {
        console.error(err);
    }
};


app.listen(3000,()=>{
    console.log('app is listening on port 3000');
    
})
