const { v4:uuidv4} = require("uuid");

var express = require('express');
var router = express.Router();

const { connectToDatabase } = require('../db');
const dbWorker = require("../db");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
*  endpoints
*/
router.post("/products", async (req, res, next) => {
  //PostProduct
  //Post product with the specific ID
  try{
    const conn = await connectToDatabase();

    let {category_id, seller_id, description, title, _image_num, price} = req.body;
    let id = uuidv4();
    let is_sold = false;
    let currDate = Date();
    sql = "INSERT INTO products (id, category_id, seller_id, description, is_sold, title, created_date, price) VALUES(?,?,?,?,?,?,NOW(),?)";
    conn.query(sql, [id, category_id, seller_id, description, is_sold, title, price], await function (err, result) {
      if (err) throw err;
      console.log("Result: " + result[0]);
    });
    res.status(201).send("completed");
  } catch (err) {
    next(err);
  }
});

router.get("/product", (req, res,next ) => {
  //GetProductByID
  //Return product with the specific ID
  try{
    //const conn = await connectToDatabase();
    const productID = req.query.id;
    
    dbWorker.getProductByID(productID, (product) => {
      console.log(product);
      res.send(product);
    });
    

    //sql = "SELECT * FROM products"
    /*
    conn.query(sql, await function (err, result) {
      if (err) throw err;
      console.log("Result: " + result[0]);
    });
    */
    //const productID = req.query.id;
    /*
    res.status(200).json(
      {
        "id": "de066979-f4a9-470e-91dd-04e854626e67",
        "category_id": "50078c52-f315-46c4-9b14-f3c3f7656f63",
        "seller_id": "ce2d1cb1-af79-4d72-ac33-1b56c14f769e",
        "description": "A fully working chair. Bought in March last year.",
        "is_sold": false,
        "title": "An office chair at Verano Place",
        "create_date": "2022-12-31 11:59:59",
        "_images": [
          "24e3ef46-3fb0-40d8-b163-402b2d96d9bf",
          "642097f4-9f4e-44c4-a3d1-79865d109b8d"
        ]
      }
    );
    */
  } catch (err) {
    next(err);
  }
});

router.get("/category", async (req, res, next) => {
  //GetCategoryByID
  //Return specific category given id
  try{
    const conn = await connectToDatabase();

    const categoryID = req.query.id;
    sql = "SELECT id, name FROM product_catergory WHERE id = (categoryID) VALUES(?)";
    conn.query(sql, [categoryID], await function (err, result) {
      if (err) throw err;
      console.log("Result: " + result[0]);
    });
    res.status(200).send(result[0]);
  } catch (err) {
      next(err);
  }
  
/*
  res.status(200).json({
    "id": "41859207-5471-4223-b01c-e566d506c799",
    "name": "furniture"
  });
  */
});

router.get("/subcategory", async (req, res, next) => {
  //GetSubCategory
  //Return all categories under given id
  const subcategoryID = req.query.id;
  res.status(200).json(
    {
      "subcategory":[
          {
              "id":"41859207-5471-4223-b01c-e566d506c799",
              "name":"furniture"
          },
          {
              "id":"32049c06-8a4c-45ea-84a1-492c11f401be",
              "name":"game consoles"
          }
      ]
    }
  );
});

router.get("/usr", async (req, res, next) => {
  //GetUserByID
  //Return user given specific id
    const userID = req.query.id;
    res.status(200).json(
      {
        "id":"4a716403-ffc5-4c16-b880-310c3e85b7ee",
        "uci_netid":"siyaoh4",
        "first_name":"jane",
        "last_name":"he",
        "bio":"Living in Verano Place. Gonna leave here soon so contact me via siyaoh4@uci.edu for some cheap furniture."
      }
    );
});

router.get("/products", async (req, res, next) => {
  //ProductsUnderCategory
  //Return all products under this category id
  const categoryID = req.query.category_id;
  res.status(200).json(
    {
      "product_id":[
          "70464662-4f1d-4ff2-ba96-ccb47cde3a3c",
          "ea876059-c168-4892-b874-2253e28ecd75",
          "13c2dbd0-c6bd-4d19-a2ef-36a6f4c6d866"
      ]
    }
  );
});

router.get("/saved_products", async (req, res, next) => {
  //GetSavedProducts
  //Return the save products this user has saved
  const usrID = req.query.usr_id;
  res.status(200).json(
    {
      "saved_products": [
          "92c6ebb6-b0ca-11ed-a0a9-00224829ee55"
      ]
    }
  );
});

router.put("/images/:image_id", async (req, res, next) => {
  //UploadImage
  //Upload image with id
  const imageID = req.params.image_id;
  res.status(200);
});

router.patch("/products/:id", async (req, res, next) => {
  //MarkSold
  //Mark product as sold
  const productID = req.params.id;
  res.status(200);
});

router.get("/images/:image_id", async (req, res, next) => {
  //GetImageByID
  //Returns image by id
  const imageID = req.params.image_id;
  res.status(200);
});

router.get("/products", async (req, res, next) => {
  //GetProductByUser
  //Returns all product under a specific user id
  const userID = req.query.user_id;
  res.status(200).json(
    {
      "product_id": [
          "70464662-4f1d-4ff2-ba96-ccb47cde3a3c",
          "ea876059-c168-4892-b874-2253e28ecd75",
          "13c2dbd0-c6bd-4d19-a2ef-36a6f4c6d866"
      ]
    }
  );
});


module.exports = router;
