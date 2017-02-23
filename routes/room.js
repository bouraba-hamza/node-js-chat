var express = require("express");

var router = express.Router();


router.get("/:pseudo",function(req,res) {

    var username = req.params.pseudo;

    res.render("room",{"username":username});

});




module.exports = router;