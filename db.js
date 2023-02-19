var mysql = require('mysql');
var fs = require('fs')

async function connectToDatabase() {
    var conn = await mysql.createConnection({host:"janedatabase.mysql.database.azure.com", 
        user:"CampusOfferAdmin", 
        password:"DannyJaneSoniaStella2023", 
        database:"JANEDB", 
        port:3306, ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}
    });

    return conn;
}

module.exports = { connectToDatabase };