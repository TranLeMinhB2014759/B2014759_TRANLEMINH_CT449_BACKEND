const express = require("express");
const details = require("../controllers/chitietdathang.controller.js"); // Thay đổi tên controller
const router = express.Router();

router
  .route("/")
  .get(details.findAll)
  .post(details.create);

router
  .route("/:id")
  .get(details.findOne)
  .put(details.update)
  .delete(details.delete);

module.exports = router;
