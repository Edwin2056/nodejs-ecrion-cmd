// 'use strict';
//  config ****************************************************************

const API_KEY = 'API:a061f949-a97b-4a19-be50-20e1d197a277'

//************************************************************************ */

const fs = require('file-system');
const moment = require('moment')
const ab2str = require('arraybuffer-to-string');
const eosAPI = require('./ecrion');

const log4js = require('log4js');
log4js.configure({
  appenders: { writefile: { type: 'file', filename: './log/nodejs-ecrion.log' } },
  categories: { default: { appenders: ['writefile'], level: 'all' } }
});
const logger = log4js.getLogger('writefile');
// logger.trace('log trace testing');
// logger.debug('debug level.');
// logger.info('info level.');
// logger.warn('warn level.');
// logger.error('error level.');
// logger.fatal('fatal level.');

const pdfSave = (xmlPathAndFileJS, eprPathAndFile, pdfPathAndFile) => {

    console.log("Rendering PDF started...");

    const payload = {
        InputSettings: {
            Template: {
                Workspace: "Default",
                Path: eprPathAndFile
            }
        },
        Input: {
            InputFormat: "xml",
            Source: xmlPathAndFileJS,
        },
        PdfOutput: {}
    }

    return eosAPI.authenticate(API_KEY)
        .then(token => 
            eosAPI.render(payload, token))
        .then(response => {
            console.log("Render succeeded!"); 
  
            fs.writeFile(pdfPathAndFile, response.data, (err) => {  
                // throws an error, you could also catch it here
                if (err) throw err;
        
                // success case, the file was saved
                const message = 'file ' + pdfPathAndFile + ' is saved at ' + moment().format('llll')
                console.log(message);
                logger.info(message)
            });
        })
        .catch(error => {
            const errorMsg = "Error " ;
            if(error.response){
                errorMsg += error.response.status + " - " + error.response.statusText + ": ";
 
                if(error.response.data.Message)
                    errorMsg += error.response.data.Message;
                else if (error.response.data)
                    errorMsg += JSON.parse(ab2str(error.response.data)).Message;
            }   
            else 
                errorMsg += ": " + error.message;
                console.log(errorMsg)
                logger.info(errorMsg)
        })
}

// EXECUTION

if (process.argv.length === 5) {
    console.log("1 -> ", process.argv[2])
    console.log("2 -> ", process.argv[3])
    console.log("3 -> ", process.argv[4])
    logger.info("xml is ", process.argv[2])
    logger.info("epr is ", process.argv[3])
    const jsFile = process.argv[2].toString()
    const xml = require(jsFile)
    const epr = process.argv[3].toString()
    const pdf = process.argv[4].toString()
    pdfSave(xml, epr, pdf)
} else {
    console.log("Not executed! Expected is node <jsfile.js> <xml-path-and-file.js> <epr-path-and-file> <pdf-path-and-file>")
}