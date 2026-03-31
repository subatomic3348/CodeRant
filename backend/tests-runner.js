const languages = require('./utils/language')
const tests = require('./utils/test-cases')
const compilationProcess = require('./compilation')
const runCodeFile = require('./code-runner')
const { spawn } = require('node:child_process')

async function runTestCase(file,langauge,outputPath){  
    
     const lang = languages[langauge]
 const compileCode =   await compilationProcess(lang,file,outputPath)
  if(compileCode&&compileCode.status==="COMPILE_ERROR"){
    return compileCode
  }
 
    for(let i =0;i<tests.length;i++){
        const output = await runCodeFile(file,tests[i].input,langauge,outputPath)
        if(output.status!='SUCCESS'){
            return output
        }
        const answer = output.result || ""
        if(answer.trim()!=tests[i].expected.trim()){
            return {
                status:"WRONG_ANSWER",
                failedTest:i+1,
                input:tests[i].input,
                expected:tests[i].expected,
                got:answer
                

            }
        }
       
    }
    return {
     status:"SUCCESS",
     passed:tests.length,
     total:tests.length

    }
}
module.exports = runTestCase
