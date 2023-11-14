const express = require("express");
const users = require("../controllers/user.controller.js");
const router = express.Router();

router
  .route("/")
  .get(users.findAll)
  .post(users.create)

  .delete(users.deleteAll);

  router.post("/login", users.login);
  router.post('/logout', users.logout);


router
  .route("/:id")
  .get(users.findUserById)
  .put(users.update)
  .delete(users.delete);

module.exports = router;
