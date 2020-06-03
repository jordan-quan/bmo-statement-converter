using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System;
using System.IO;
using System.Threading.Tasks;

 
 public class Startup
{

    public async Task<object> Invoke(dynamic input) {

        string filepath = (string)input.filepath;
        string outpath = (string)input.outpath;
        string docName = (string)input.docName;
        int start = (int)input.start;
        int end = (int)input.end;

        SplitPDFs(start, end, filepath, outpath, docName);

        return null;
    }

    public void SplitPDFs(int start, int end, string source, string outpath, string docName)
    {
        var pdfReader = new PdfReader(source);
        try
        {
            pdfReader.SelectPages(start + "-" + end);
            using (var fs = new FileStream(outpath + "\\" + docName, FileMode.Create, FileAccess.Write))
            {
                Console.WriteLine("Creating " + outpath + "\\" + docName);
                PdfStamper stamper = null;
                try
                {
                    stamper = new PdfStamper(pdfReader, fs);
                }
                finally
                {
                    stamper.Close();
                }
            }
        }
        finally
        {
            pdfReader.Close();
        }

    }

}

