const express = require("express");
const router = express.Router();

/*
 * @Router  GET /logout
 * @desc    Logout
 * @access  Protected
 */
router.get("/", function(req, res) {
   if (req.session.user && req.cookies.user_sid) {
      res.clearCookie("user_sid");
      res.render("login");
   } else {
      res.render("login");
   }
});

module.exports = router;
