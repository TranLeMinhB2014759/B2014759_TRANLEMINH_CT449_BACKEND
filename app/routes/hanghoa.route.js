const express = require("express");
const products = require("../controllers/hanghoa.controller.js");
const router = express.Router();

router
  .route("/")
  .get(products.findAll)
  .post(products.create)
 



router
  .route("/:id")
  .get(products.findOne)
  .put(products.update)
  .delete(products.delete);

module.exports = router;
