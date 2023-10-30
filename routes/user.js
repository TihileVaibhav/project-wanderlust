

const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


const userContorller = require("../controllers/users.js");


router
    .route("/signup")
 
    .get( userContorller.rendersignupForm)

  
    .post(wrapAsync( userContorller.signup ));


router
    .route("/login")
 
    .get( userContorller.renderLoginForm)

   
    .post( saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login", 
            failureFlash: true,
        }), 
        userContorller.login
    );


router.get("/logout", userContorller.logout);


module.exports = router;