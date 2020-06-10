import edge from 'edge-js';

//Creates javascript function from C# file in ./external/Startup.cs
//function splits pdf at specific start and end points

var splitC = edge.func({
    source: './external/Startup.cs',
    references: ['./external/itextsharp.dll']
});

const splitPDF = (filepath, docName, outpath, start, end) => {

    var splitInfo = {
        filepath,
        docName,
        outpath,
        start,
        end
    }

    splitC(splitInfo, function (error, result) {
        if (error) {
            console.log(error);
            return;
        }
    });

}

export default splitPDF;