const path = require('node:path');
const {languages} = require('./utils/language')

const { spawn } = require('node:child_process')
const fs = require('fs');
const { resolve } = require('node:dns');

const UID = process.getuid();
const GID = process.getgid();

const getDockerArgs = (dir,image,fullCmdArray)=>{
   return [
      'run',
      '--rm',
      '-i',
      '--network','none',
      '--memory','128m',
      '--cpus','0.5',
      '--pids-limit','64',
      '--cap-drop','ALL',
      '--user',`${UID}:${GID}`,
      '-v',`${dir}:/app`,
      '-w','/app',
      image
   ].concat(fullCmdArray)
}
async function runCodeFile(code ,input,lang) {
   try{
   const randomId = crypto.randomUUID();
   const dir = path.join(process.cwd(),randomId);
   fs.mkdirSync(dir,{recursive:true});
   const outputName = 'main';
   console.log(lang);
   

   const file =   `main${languages[lang].extension}`
   console.log(file);
   
   console.log(file);
   
   const filePath = path.join(dir,file);
   console.log(filePath);
   
   fs.writeFileSync(filePath,code)
   const image = languages[lang].image;
   const [executable,cmdArgs] = languages[lang].run(file,outputName)
   const fullExecutionCmd = [executable].concat(cmdArgs)
   const args = getDockerArgs(dir,image,fullExecutionCmd)
   const cmd = 'docker';
   return new Promise((resolve)=>{
      let finished = false
      let ouptut ="";
      let errorOutput="";
   const docker = spawn(cmd,args,{
      detached:true
   })
   const timeout = setTimeout(()=>{
      if(finished){
         return         
      }
      finished = true
      docker.kill(-docker.pid,'SIGKILL')
      return   resolve({
         status:'TIME_LIMIT_EXCEEDED',
         error: 'TIMEOUT'
    })

   },10000)
   if(input){
    const formattedInput = input.endsWith('\n') ? input : `${input}\n`;
   docker.stdin.write(formattedInput);

   }
   docker.stdin.end();
   
      docker.stdout.on('data',(data)=>{
         ouptut+=data.toString();
      })
      docker.stderr.on('data',(data)=>{
         errorOutput+=data.toString();
      })
      docker.on('close',(exitCode)=>{
         if(finished)return
         finished = true
         clearTimeout(timeout)
         fs.rmSync(dir,{recursive:true,force:true})
         if(exitCode!==0){
            return resolve({
               status:'Error',
               result:errorOutput || 'Process exited with Error'
            })
         }
         resolve({
            status:'SUCCESS',
            result:ouptut
         })
      })     
   })
   }
   catch(e){
      return {
         status:'SYSTEM_ERROR',
         Error:e
      }
   }

 }
 
 
module.exports = runCodeFile