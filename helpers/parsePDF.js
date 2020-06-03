var pdfjs = require('pdfjs-dist');
var _ = require('lodash');

function getPageText(pageNum, PDFDocumentInstance) {
    // Return a Promise that is solved once the text of the page is retrieved
    return new Promise(function (resolve, reject) {
        PDFDocumentInstance.getPage(pageNum).then(function (pdfPage) {
            // The main trick to obtain the text of the PDF page, use the getTextContent method
            pdfPage.getTextContent().then(function (textContent) {
                var textItems = textContent.items;
                var finalString = [];

                // Concatenate the string of the item to the final string
                for (var i = 0; i < textItems.length; i++) {
                    var item = textItems[i];
                    finalString.push(item.str);
                }
                // Solve promise with the text retrieven from the page
                resolve(finalString);
            });
        });
    });
}

module.exports = function collectPages(filePath){
    return pdfjs.getDocument(filePath).then(function (PDFDocumentInstance) {
        // Create an array that will contain our promises 
        var pagesPromises = [];
        var numPages = PDFDocumentInstance._pdfInfo.numPages;
    
        for (var i = 1; i <= numPages; i++) {
            // Store the promise of getPageText that returns the text of a page
            pagesPromises.push(getPageText(i, PDFDocumentInstance));
        }
    
        // Execute all the promises
        return Promise.all(pagesPromises);

    }).catch((reason)=>{
        console.log(reason);
    });
}