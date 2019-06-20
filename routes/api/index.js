const express = require("express");
const router = express.Router();

/*
 * @Router  GET /index
 * @desc    Index
 * @access  Protected
 */
router.get("/", function(req, res) {
   if (req.session.user && req.cookies.user_sid) {
      const user = req.session.user;
      res.render("index", { email: user.email });
   } else {
      res.render("login");
   }
});

module.exports = router;
