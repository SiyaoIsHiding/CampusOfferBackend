var mysql = require('mysql');
var fs = require('fs')

var conn = mysql.createConnection({host:"janedatabase.mysql.database.azure.com", 
    user:"CampusOfferAdmin", 
    password:"DannyJaneSoniaStella2023", 
    database:"JANEDB", 
    port:3306, ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")}
});


let dbWorker = {};

dbWorker.getProductByID = (productID, callback) => {
    sql = "SELECT * FROM products WHERE id = ?";
    console.log(productID);
    conn.query(sql, [productID], function (err, result) {
        if (err) throw err;
        callback(result[0]);
    });
}


dbWorker.getUserByID = (usrID, callback) => {
    sql = "SELECT * FROM uci_usr WHERE id = ?";
    console.log(usrID);
    conn.query(sql, [usrID], function (err, result) {
        if (err) throw err;
        callback(result[0]);
    });
}

dbWorker.getCategoryByID = (categoryID, callback) => {
    sql = "SELECT * FROM product_category WHERE id = ?";
    console.log(categoryID);
    conn.query(sql, [categoryID], function (err, result) {
        if (err) throw err;
        callback(result[0]);
    });
}

dbWorker.getSubCategory = (parentID, callback) => {
    sql = "SELECT * FROM product_category WHERE parent_id = ?" +
            " UNION" +
            " SELECT pc.* FROM product_category pc" +
            " JOIN (" + 
                " SELECT id FROM product_category"+
                " WHERE parent_id = ?" + 
                " ) t ON pc.parent_id = t.id";
    console.log(parentID);
    conn.query(sql, [parentID, parentID], function (err, result) {
        if (err) throw err;
        callback(result[0]);
    });
}


dbWorker.getProductUnderCategory = (categoryID, callback) => {
    sql = " SELECT * FROM products WHERE category_id IN (" +
            " SELECT * FROM product_category WHERE parent_id = ?" +
            " UNION" +
            " SELECT pc.* FROM product_category pc" +
            " JOIN (" +
                "SELECT id FROM product_category"+
                "WHERE parent_id = ?) t ON pc.parent_id = t.id";
    console.log(categoryID);
    conn.query(sql, [categoryID, categoryID], function (err, result) {
        if (err) throw err;
        callback(result[0]);
    });
}

module.exports = dbWorker;