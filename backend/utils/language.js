const languages = {
    python:{
        extension:".py",

        run : (filePath)=>["python3",[filePath]]
    },
    javascript:{
        extension:".js",
        run:(filePath)=>["node",[filePath]]
    },
    cpp:{
        extension:".cpp",
        compile:(filePath,outputPath)=>["g++",[filePath,"-o",outputPath]],
        run:(output)=>["./"+ output,[]]
    }
}
module.exports = languages