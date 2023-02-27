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
        callback(result);
    });
}


dbWorker.getProductUnderCategory = (categoryID, callback) => {
    sql = "SELECT * FROM products WHERE category_id IN (" +
            "SELECT id FROM product_category WHERE parent_id = ?" +
            " UNION" +
            " SELECT pc.id FROM product_category pc" +
            " JOIN (SELECT id FROM product_category "+
                    "WHERE parent_id = ?) t ON pc.parent_id = t.id)";
    console.log(categoryID);
    conn.query(sql, [categoryID, categoryID], function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

dbWorker.getSavedProducts = (usr_id, callback) => {
    sql = "SELECT product_id FROM saved_products WHERE usr_id = ?";
    console.log(usr_id);
    conn.query(sql, [usr_id], function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

dbWorker.getProductByUser = (usr_id, callback) => {
    sql = "SELECT id FROM products WHERE seller_id = ?";
    console.log(usr_id);
    conn.query(sql, [usr_id], function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

dbWorker.getImageByID = (image_id, callback) => {
    sql = "SELECT content FROM images WHERE id = ?";
    console.log(image_id);
    conn.query(sql, [image_id], function (err, blob) {
        if (err) throw err;
        callback(blob);
    });
    var reader = new FileReader();
    reader.readAsDataURL(blob); 
    reader.onloadend = function() {
        var base64data = reader.result;                
        console.log(base64data);
    }
}

// postProduct: create one product and two empty images
dbWorker.postProduct = (category_id, seller_id, description, title, price, callback) => {
    sql = "INSERT INTO products (id, category_id, seller_id, description, is_sold, title, created_date, price) " + 
          "VALUES(UUID(),?,?,?,default,?,default,?); " + 
          "INSERT INTO images (id, product_id, content) VALUES (UUID(), ?, default);" + 
          "INSERT INTO images (id, product_id, content) VALUES (UUID(), ?, default);";
    conn.query(sql, [category_id, seller_id, description, title, price, seller_id, seller_id], function (err, result) {
      if (err) throw err;
        callback(result);
    });
}

// upLoadImage: Update image content
dbWorker.upLoadImage = (seller_id, blob, callback) => {
    sql = "UPDATE images " + 
          "SET content = (UUID(),?,?,?,default,?,default,?); " + 
            "INSERT INTO images (id, product_id, content) VALUES (UUID(), ?, default);" + 
            "INSERT INTO images (id, product_id, content) VALUES (UUID(), ?, default);";
    conn.query(sql, [category_id, seller_id, description, title, price, seller_id, seller_id], function (err, result) {
      if (err) throw err;
        callback(result);
    });
}

module.exports = dbWorker;