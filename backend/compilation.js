const { spawn } = require('node:child_process')

async function compilationProcess(lang,filePath,outputPath){
    console.log(outputPath+"inside compilation");
    
    if(!lang.compile)return;
    return new Promise((resolve,reject)=>{
        const [cmd,args] = lang.compile(filePath,outputPath)
        const compileProcess = spawn(cmd,args)
        let errOutput =""
        compileProcess.stderr.on("data",(data)=>{
            errOutput+=data
        })
        compileProcess.on("close",(code)=>{
            if(code!==0){
                return reject({
                    type:"COMPILE_ERROR",
                    error:errOutput
                })
            }
            resolve()
        })

    })
}
module.exports = compilationProcess