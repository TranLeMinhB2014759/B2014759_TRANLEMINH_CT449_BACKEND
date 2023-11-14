const express = require("express");
const orders = require("../controllers/dathang.controller.js"); // Đổi tên controller
const router = express.Router();

router
  .route("/")
  .get(orders.findAll) 
  .post(orders.create);

router
  .route("/:id")
  .get(orders.findOne)
  .put(orders.update)
  .delete(orders.delete);

module.exports = router;
