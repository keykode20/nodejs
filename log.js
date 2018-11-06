var testExport = "test";
function log(message){
    console.log(message);
}

//adding a method called log in the export object
module.exports.log = log;

module.exports.test = testExport;
