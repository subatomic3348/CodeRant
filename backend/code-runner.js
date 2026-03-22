const languages = require('./utils/language')

const { spawn } = require('node:child_process')
async function runCodeFile(filePath,input,langauge,outputPath) {


    try {

        return new Promise((resolve,reject)=>{ 
     let stream = ""
     let errorOutput="";
     let finished = false
     let runArg = filePath;
     
     const lang = languages[langauge]
     if(lang.compile){
        runArg = outputPath
     }

    
     const [cmd,args] = lang.run(runArg)
     
        const pythonProcess = spawn(cmd,args)
        const timeout = setTimeout(()=>{
            if(finished) return
             finished = true
            pythonProcess.kill('SIGKILL')
            // reject(new Error('Time limit exceeded'))
         return   resolve({
               status:'TIME_LIMIT_EXCEEDED',
               error: 'execution took too long'
            })
        },10000)
   pythonProcess.stdin.write(input)
   pythonProcess.stdin.end()
   pythonProcess.stdout.on('data',(data)=>{
        stream+=data
        console.log(`stdout:${data}`);
        
     }) 
     pythonProcess.stderr.on('data',(data)=>{
      errorOutput+=data
        console.log(`stderr:${data}`);
       
           
     })
     pythonProcess.on('error', (err) => {
    if(finished) return
    finished = true
    clearTimeout(timeout)

    resolve({
        status: "SYSTEM_ERROR",
        error: err
    })
})
     pythonProcess.on('close',(code)=>{
        if(finished) return
        finished = true
        clearTimeout(timeout)
        if(code!==0){
         console.log(`program exited with ${code}`);
                return resolve({
                  status:'RUNTIME_ERROR',
                  error:errorOutput
                })
                
                
                    
        }
        console.log(stream);
        
        resolve({
          status:'SUCCESS',
           result:stream
        })
        
       
     }) 

    })       
    }
    catch (err) {
        console.error(err);
        return {
         status:"SYSTEM_ERROR",
         error:err || "UNKNOWN_ERROR"
        }

    }
};
module.exports = runCodeFile