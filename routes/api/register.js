const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// Load inputs validation
const validateRegisterInput = require("../../validation/register-validator");

/*
 * @Router  GET /register
 * @desc    Register
 * @access  Public
 */
router.get("/", (req, res) => {
   res.render("register");
});

/*
 * @Router  POST /register/submit
 * @desc    Submit register form
 * @access  Public
 */
router.post("/submit", (req, res) => {
   const { errors, isValid } = validateRegisterInput(req.body);
   let noErrors = true;

   if (!isValid) {
      return res.status(400).json(errors);
   } else {
      // insert users to DB
      User.create({
         email: req.body.email2,
         password: req.body.password2,
         phone: req.body.phone
      })
         .then(user => {
            console.log("Inserted successfully");
            req.session.user = user.dataValues;
         })
         .catch(error => {
            // DEBUG
            console.log(error);
         });

      return res.status(200).json("Success");
   }
});

/*
 * @Router  POST /register/verify-phone
 * @desc    Verify phone number
 * @access  Public
 */
router.post("/verify-phone", (req, res) => {
   // twilio api setup
   const accountSid = "ACe9a91d8a00aa9dae4750fb630871ba28";
   const authToken = "6ec9b2312c46cb39d36dfc9755d07f02";
   const client = require("twilio")(accountSid, authToken);

   // user phone number
   const userPhone = "+1" + req.body.phone;

   // send sms
   client.messages
      .create({
         from: "+16193045882",
         body: "Welcome to the Network! This is a verification sms.",
         to: userPhone
      })
      .then(message => {
         const object = message.sid;

         // non-exist phone number
         if (object.error_code === "30005") {
            return res.status(400).json("fail to verify");
         }

         // valid phone number
         return res.status(200).json("verified");
      });
});

module.exports = router;
