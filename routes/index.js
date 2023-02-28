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
    let {category_id, seller_id, description, title, _image_num, price} = req.body;
    let productID = uuidv4();
    dbWorker.postProduct(_image_num, productID, category_id, seller_id, description, title, price, (images) => {
      console.log(images);
      let result = [];
      for(let i = 0; i < images.length; i++){
        let id = images[i]["id"];
        result.push(id);
      };
      res.status(201).send({"_images_":results});
    });
  
  } catch (err) {
    next(err);
  }
});

//COMPLETE
router.get("/product", (req, res,next ) => {
  //GetProductByID
  //Return product with the specific ID
  const productID = req.query.id;
  dbWorker.getProductByID(productID, (product) => {
    console.log(product);
    res.status(200).send(product);
  });
    
});

//COMPLETE
router.get("/category", (req, res, next) => {
  //GetCategoryByID
  //Return specific category given id
  const categoryID = req.query.id;
  dbWorker.getCategoryByID(categoryID, (category) => {
    console.log(category);
    res.status(200).send(category);
  });
});

//COMPLETE
router.get("/subcategory", (req, res, next) => {
  //GetSubCategory
  //Return all categories under given id
  const subcategoryID = req.query.id;
  dbWorker.getSubCategory(subcategoryID, (categories) => {
    console.log(categories);
    res.status(200).send({"subcategory":categories});
  });
});

//COMPLETE
router.get("/usr", (req, res, next) => {
  //GetUserByID
  //Return user given specific id
  const userID = req.query.id;
  dbWorker.getUserByID(userID, (user) => {
    console.log(user);
    res.status(200).send(user);
  });
    
});

//COMPLETE
router.get("/products", (req, res, next) => {
  //ProductsUnderCategory
  //Return all products under this category id

  const categoryID = req.query.category_id;

  if(categoryID != null){

    dbWorker.getProductUnderCategory(categoryID, (products) => {
      console.log(products);
      let result = [];
      for(let i = 0; i < products.length; i++){
        let id = products[i]["id"];
        result.push(id);
      };
      res.status(200).send({"product_id":result});
    });
  } else {

    //GetProductByUser
    //Returns all product under a specific user id

    const userID = req.query.user_id;
    console.log(userID);
    dbWorker.getProductByUser(userID, (products) => {
      console.log(products);
      let result = [];
      for(let i = 0; i < products.length; i++){
        let id = products[i]["id"];
        result.push(id);
      };
      res.status(200).send({"product_id":result});
    });
  }

});

//COMPLETE
router.get("/saved_products", (req, res, next) => {
  //GetSavedProducts
  //Return the save products this user has saved
  const usrID = req.query.usr_id;
  dbWorker.getSavedProducts(usrID, (products) => {
    console.log(products);
    let result = [];
    for(let i = 0; i < products.length; i++){
      let id = products[i]["product_id"];
      result.push(id);
    };
    res.status(200).send({"saved_products":result});
  });
});

router.put("/images/:image_id", (req, res, next) => {
  //UploadImage
  //Upload image with id
  const imageID = req.params.image_id;
  const imageBody = req.body;
  dbWorker.upLoadImage(imageID, imageBody, (result) => {
    console.log(result);
    res.status(200);
  })
});

//COMPLETE
router.patch("/products/:id", (req, res, next) => {
  //MarkSold
  //Mark product as sold
  const productID = req.params.id;
  dbWorker.getSavedProducts(productID, (result) => {
    console.log(result);
    res.status(200);
  });
});

router.get("/images/:image_id", async (req, res, next) => {
  //GetImageByID
  //Returns image by id
  const imageID = req.params.image_id;
  res.status(200);
});

module.exports = router;
