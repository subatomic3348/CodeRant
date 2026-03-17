const languages = require('./utils/language')

const { spawn } = require('node:child_process')
async function runCodeFile(filePath,input,langauge,outputPath) {


    try {

        return new Promise((resolve,reject)=>{ 
     let stream = ""
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
            reject(new Error('Time limit exceeded'))
        },10000)
   pythonProcess.stdin.write(input)
   pythonProcess.stdin.end()
   pythonProcess.stdout.on('data',(data)=>{
        stream+=data
        console.log(`stdout:${data}`);
        
     }) 
     pythonProcess.stderr.on('data',(data)=>{
        console.log(`stderr:${data}`);
       
           
     })
     pythonProcess.on('close',(code)=>{
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
module.exports = runCodeFile