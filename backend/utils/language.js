const languages = {
    python:{
        extension:".py",
        image:"python:3.9-alpine",

        run : (filePath)=>["python3",[filePath]]
    },
    javascript:{
        extension:".js",
        image:"node:20-alpine",
        run:(filePath)=>["node",[filePath]]
    },
    cpp:{
        extension:".cpp",
        image:"gcc:15.2.0",
       run: (file, output) => ["sh", ["-c", `g++ ${file} -o ${output} && ./${output}`]]
    }
}



module.exports = {
    languages
    
}
