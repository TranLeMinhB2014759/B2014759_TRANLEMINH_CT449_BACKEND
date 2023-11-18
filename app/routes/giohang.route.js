const express = require("express");
const carts = require("../controllers/giohang.controller"); // Đổi tên controller
const router = express.Router();

router
  .route("/")
  .get(carts.findAll)
  .post(carts.create)
  
  .delete(carts.delete);
  router
  .route("/:id")
  .put(carts.update)
  .get(carts.findOne)
  

module.exports = router;
