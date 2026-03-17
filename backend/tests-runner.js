const languages = require('./utils/language')
const tests = require('./utils/test-cases')
const compilationProcess = require('./compilation')
const runCodeFile = require('./code-runner')
const { spawn } = require('node:child_process')

async function runTestCase(file,langauge,outputPath){  
    
     const lang = languages[langauge]
   await compilationProcess(lang,file,outputPath)

 
    for(let i =0;i<tests.length;i++){
        const output = await runCodeFile(file,tests[i].input,langauge,outputPath)
        if(output.trim()!=tests[i].expected.trim()){
            return {
                status:"wrong answer",
                failedTest:tests.length+i,
                input:tests[i].input,
                expected:tests[i].expected,
                got:output
                

            }
        }
       
    }
    return {
     status:"all test passed",
     passed:tests.length,
     total:tests.length

    }
}
module.exports = runTestCase
