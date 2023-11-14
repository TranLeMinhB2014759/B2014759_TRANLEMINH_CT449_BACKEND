const express = require("express");
const employees = require("../controllers/nhanvien.controller.js");
const router = express.Router();

router
  .route("/")
  .get(employees.findAll)
  .post(employees.create)
  .delete(employees.deleteAll);


router
  .route("/:id")
  .get(employees.findEmployeeById)
  .put(employees.update)
  .delete(employees.delete);

module.exports = router;
