const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcrypt");

/*
 * @Router  GET /login
 * @desc    Login
 * @access  Public
 */
router.get("/", function(req, res) {
   res.render("login");
});

/*
 * @Router  POST /login
 * @desc    Login
 * @access  Public
 */
router.post("/", function(req, res) {
   const email = req.body.email;
   const password = req.body.password;

   User.findOne({ where: { email: email } }).then(user => {
      if (!user) {
         return res.status(400).json("fail to login");
      } else if (!bcrypt.compareSync(password, user.password)) {
         return res.status(400).json("fail to login");
      } else {
         req.session.user = user.dataValues;
         return res.status(200).json("success");
      }
   });
});

/*
 * @Router  POST /login/security-alert
 * @desc    Send msm to account owner
 * @access  Public
 */
router.post("/security-alert", function(req, res) {
   User.findOne({ where: { email: req.body.email } }).then(user => {
      // twilio api setup
      const accountSid = process.env.ACCOUNT_ID;
      const authToken = process.env.AUTH_TOKEN;
      const client = require("twilio")(accountSid, authToken);

      // user phone number
      const userPhone = "+1" + user.phone;

      // send sms
      client.messages
         .create({
            from: "+16193045882",
            body:
               "[Security Alert]: Someone attempts many times to access to your Network's account",
            to: userPhone
         })
         .then(message => {
            const object = message.sid;

            return res.status(200).json("sms sent");
         })
         .catch(error => {
            console.log(error);
            return res.status(400).json("errors");
         });
   });
});

module.exports = router;
