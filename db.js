var mysql = require('mysql');
var fs = require('fs')

var conn = mysql.createConnection({
    host:"janedatabase.mysql.database.azure.com", 
    user:"CampusOfferAdmin", 
    password:"DannyJaneSoniaStella2023", 
    database:"JANEDB", 
    port:3306, ssl:{ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")},
    multipleStatements: true  // allow multiple sql queries, it's false by default for security
}
    // {multipleStatements: true} // this is the wrong format to config
);


let dbWorker = {};

// get product by ID
dbWorker.getProductByID = (productID, callback) => {
    sql = "SELECT * FROM products WHERE id = ?";
    console.log(productID);
    conn.query(sql, [productID], function (err, result) {
        if (err) throw err;
        callback(result[0]);
    });
}

// get user by ID
dbWorker.getUserByID = (usrID, callback) => {
    sql = "SELECT * FROM uci_usr WHERE id = ?";
    console.log(usrID);
    conn.query(sql, [usrID], function (err, result) {
        if (err) throw err;
        callback(result[0]);
    });
}

// get Category by ID
dbWorker.getCategoryByID = (categoryID, callback) => {
    sql = "SELECT * FROM product_category WHERE id = ?";
    console.log(categoryID);
    conn.query(sql, [categoryID], function (err, result) {
        if (err) throw err;
        callback(result[0]);
    });
}

// get sub-category by its parent ID
dbWorker.getSubCategory = (parentID, callback) => {
    sql = "SELECT id, name FROM product_category WHERE parent_id = ? " +
            "AND id not in ('00000000-0000-0000-0000-00000000000') " +
            "UNION " +
            "SELECT pc.id, pc.name FROM product_category pc " +
            "JOIN (" + 
                "SELECT id FROM product_category WHERE parent_id = ? " + 
                "AND id not in ('00000000-0000-0000-0000-00000000000') " +
                ") t ON pc.parent_id = t.id";
    console.log(parentID);
    conn.query(sql, [parentID, parentID], function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

// get products under a category ID as deep as its two layer sub-categories
dbWorker.getProductUnderCategory = (categoryID, callback) => {
    sql = "SELECT id FROM products WHERE category_id IN (" +
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

// get saved products by user ID who saved it
dbWorker.getSavedProducts = (usr_id, callback) => {
    sql = "SELECT product_id FROM saved_products WHERE usr_id = ?";
    console.log(usr_id);
    conn.query(sql, [usr_id], function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

// get all products posted by a user with user ID
dbWorker.getProductByUser = (usr_id, callback) => {
    sql = "SELECT id FROM products WHERE seller_id = ?";
    console.log(usr_id);
    conn.query(sql, [usr_id], function (err, result) {
        if (err) throw err;
        callback(result);
    });
}

// get a image by its ID
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

// postProduct: create one product and five empty images
// create image id and its product_id leave content as null in DB
// Only the product uuid is passed from server
dbWorker.postProduct = (called_image_num, product_id, category_id, seller_id, description, title, price, callback) => {
    sql = "INSERT INTO products (id, category_id, seller_id, description, is_sold, title, created_date, price) " + 
           "VALUES(?,?,?,?,default,?,default,?); "
    const questionMarks = [product_id, category_id, seller_id, description, title, price];
    for (let i=1; i <= called_image_num; i++){
        sql = sql  + "INSERT INTO images (id, product_id, content) VALUES (UUID(), ?, default);" ;
        questionMarks.push(product_id); 
    }
    sql = sql + "SELECT id FROM images WHERE product_id = ?";
    questionMarks.push(product_id);
    conn.query(sql, questionMarks, function (err, result) {
      if (err) throw err;
        callback(result);
    });
}

// upLoadImage: Update one image content with its image ID
dbWorker.upLoadImage = (image_id, blob, callback) => {
    sql = "UPDATE images SET content = (?) WHERE id = ? ";
    conn.query(sql, [blob, image_id], function (err, result) {
      if (err) throw err;
        callback(result);
    });
}

// MarkSold: Mark a product as sold
dbWorker.MarkSold = (product_id, callback) => {
    sql = "UPDATE products SET is_sold = 1 WHERE id = ? ";
    conn.query(sql, [product_id], function (err, result) {
      if (err) throw err;
        callback(result);
    });
}

module.exports = dbWorker;