import pdfjs from 'pdfjs-dist';
import _ from 'lodash';

function getPageText(pageNum, PDF) {
    // Return a Promise that is solved once the text of the page is retrieved
    return new Promise((resolve, reject) => {

        //get page from doc
        PDF.getPage(pageNum)
            .then((pdfPage) => {

                // get lines from each page
                pdfPage.getTextContent()
                    .then((textContent) => {
                        const content = textContent.items.map(({ str }) => str);
                        if (content) {
                            resolve(content);
                        } else {
                            reject('could not get content')
                        }

                    });
            });
    });
}

function collectPages(filePath) {

    return pdfjs.getDocument(filePath).then(
        (PDF) => {
            // Create an array that will contain our promises 
            var pagesPromises = [];
            var numPages = PDF._pdfInfo.numPages;

            for (var i = 1; i <= numPages; i++) {
                // Store the promise of getPageText that returns the text of a page
                pagesPromises.push(getPageText(i, PDF));
            }

            // Execute all the promises
            return Promise.all(pagesPromises);
        }).catch((reason) => {
            console.log(reason);
        });
}

export default collectPages;