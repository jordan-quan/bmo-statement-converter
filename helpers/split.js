var edge = require("edge-js");

//Creates javascript function from C# file in ./external/Startup.cs
//function splits pdf at specific start and end points

var splitC = edge.func({
    source: __dirname + '/external/Startup.cs',
    references: [ __dirname + '/external/itextsharp.dll']
});

module.exports = function (filepath, docName, outpath, start, end){
    var splitInfo ={
        filepath,
        docName,
        outpath,
        start,
        end
    }

    splitC(splitInfo, function(error, result){
        if(error){
            console.log(error);
            return;
        }
    });

}