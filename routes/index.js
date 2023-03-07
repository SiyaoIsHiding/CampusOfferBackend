const { v4:uuidv4} = require("uuid");

var express = require('express');
var router = express.Router();

const { connectToDatabase } = require('../db');
const dbWorker = require("../db");

//google authorizarion
const {OAuth2Client} = require('google-auth-library');
const FRONT_CLIENT_ID = "424300706933-gt9in469m1k4hosob37vb7bef9jkmdhg.apps.googleusercontent.com";
const BACK_CLIENT_ID = "424300706933-2t99cdia48nhq4oq893jabv6ffc0u528.apps.googleusercontent.com";
const client = new OAuth2Client(BACK_CLIENT_ID);

function checkAuthenticated(req, res, next){
  let token = req.headers.id_token;
  async function verify() {
    const ticket = await client.verifyIdToken({
        idToken: token,
        requiredAudience: FRONT_CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    console.log(payload);

    //Specify email domain
    const domain = payload['hd'];
    if(domain != "uci.edu"){
      throw new Error("Unauthorized domain.");
    }
  }
  verify()
  .then(()=> {
    next();
  }).catch(console.error);
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
*  endpoints
*/
//COMPLETE
router.post("/products", (req, res, next) => {
  //PostProduct
  //Post product with the specific ID

  let {category_id, seller_id, description, title, _image_num, price} = req.body;
  let productID = uuidv4();
  dbWorker.postProduct(_image_num, productID, category_id, seller_id, description, title, price, (multiQueryRes) => {
    console.log(multiQueryRes);
    let images = multiQueryRes.pop();
    let result = [];
    for(let i = 0; i < images.length; i++){
      let id = images[i]["id"];
      result.push(id);
    };
    res.status(201).send({"_images":result});
  });
});

//COMPLETE
router.get("/product", (req, res,next ) => {
  //GetProductByID
  //Return product with the specific ID
  const productID = req.query.id;
  dbWorker.getProductByID(productID, (product) => {
    console.log(product);

    let obj1 = product[0][0];
    let image_info = product[1];
    let images = [];
    for(let i = 0; i < image_info.length; i++){
      let id = image_info[i]["id"];
      images.push(id);
    };
    let image_id_arr = {"_images" : images};

    let result = Object.assign(obj1, image_id_arr)
    res.status(200).send(result);
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
  const {image} = req.body;
  dbWorker.upLoadImage(imageID, image, (result) => {
    console.log(result);
    res.status(200).send();
  })
});

//COMPLETE
router.patch("/product/:id", checkAuthenticated, (req, res, next) => {
  //MarkSold
  //Mark product as sold
  const productID = req.params.id;
  dbWorker.MarkSold(productID, (result) => {
    console.log(result);
    res.status(200).send();
  });
});

router.get("/images/:image_id", (req, res, next) => {
  //GetImageByID
  //Returns image by id
  const imageID = req.params.image_id;
  dbWorker.getImageByID(imageID, (image) => {
    console.log(image);
    res.status(200).send({"image":image["content"].toString("utf-8")});
  });
});

module.exports = router;
