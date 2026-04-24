const languages = require('./utils/language')
const tests = require('./utils/test-cases')
const runCodeFile = require('./code-runner')

async function runTestCase(code,langauge){  
    
     const lang = languages[langauge]
 
 
    for(let i =0;i<tests.length;i++){
        const output = await runCodeFile(code,tests[i].input,langauge)
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
