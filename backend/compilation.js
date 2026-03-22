const { spawn } = require('node:child_process')

async function compilationProcess(lang,filePath,outputPath){
    console.log(outputPath+"inside compilation");
    
    if(!lang.compile){
        return {
            status:"SUCCESS"
        }
    }
    
    return new Promise((resolve,reject)=>{
        const [cmd,args] = lang.compile(filePath,outputPath)
        const compileProcess = spawn(cmd,args)
        let errOutput =""
        compileProcess.stderr.on("data",(data)=>{
            errOutput+=data
        })
        compileProcess.on("close",(code)=>{
            if(code!==0){
                return resolve({
                    status:"COMPILE_ERROR",
                    error:errOutput
                })
            }
            resolve()
        })

    })
}
module.exports = compilationProcess