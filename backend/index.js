const express = require('express')
const app = express()
app.use(express.json())
const { spawn } = require('node:child_process')
const fs = require("fs")
const { exit } = require('node:process')
const test = require('node:test')
const { file } = require('zod')
const { type } = require('node:os')
const fsPromises = require('fs').promises
const langauges = require('./utils/language')
const runTestCase = require('./tests-runner')
const languages = require('./utils/language')
app.post('/run',async(req,res)=>{
    const code = req.body.code
   const l = req.body.l;
  
    
    
    
    const filePath = `./temp-${Date.now()}${langauges[l].extension}`

    const outputPath = `./temp1-${Date.now()}`

    try{
      await fsPromises.writeFile(
                filePath, code, {
            encoding: "utf8",
            flag: "w",
            mode: 0o666
        });
       
    const data = await runTestCase(filePath,l,outputPath)
    

    return res.json({
        output:data
    })

    }
    catch(e){
     console.log(e);
      return res.status(400).json({
        message:'error while running the code'
      })
     
    }
    finally{
         fs.unlink(filePath,(err)=>{
            if(err){
                console.log('file couldnot be deleted');
                 console.error(err)

                
            }
            else{
                console.log(`${filePath} is deleted after program ran`);
                
            }

        })
        if(languages[l].compile){
        fs.unlink(outputPath, (err)=>{
            if(err) {
                console.log('binary file cannot be deleted');
                console.log(err);
                
            }
            else{
                console.log('binary file also deleted suck on that');
                
            }
            
        })
        }

    }
   
})


app.listen(3000,()=>{
    console.log('app is listening on port 3000');
    
})
