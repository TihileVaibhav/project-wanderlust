
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");



module.exports.isLoggedIn = ( req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {  //method to check user is loged in or not
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be loged in to create listing!");
        return res.redirect("/login");
    }
        next();
};


//to save redirect url
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


// if the listing owner is not equals to current owner 
//so dont provide permission for edit & delete and other routes
module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the Owner's have permission to do changes!! ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};


//listing schema validation
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};

//listing review schema
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else {
        next();
    }
};


module.exports.isReviewAuthor= async (req, res, next) => {
    let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "Only the Author have permission to Delete review!! ");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

