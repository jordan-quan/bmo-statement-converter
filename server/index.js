
import express from 'express';
import config from './fileConfig.js';
import cors from 'cors';
import PDF_router from './routers/PDF_router.js'
import { pdf_url } from './constants/endpoints.js';
var app = express();

var port = 8000;
var message = 'listening on port ' + port;

// Set up a whitelist and check against it:
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// Then pass them to cors:
//app.use(cors(corsOptions));
app.use(cors());
//Routes
app.use(pdf_url, PDF_router);

app.listen(port, function () {
	console.log(message);
});
