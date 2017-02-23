var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    username : String,
    password : String,
    role : String
});



var CompteSchema = new mongoose.Schema({
    solde : Number,
    type : String,
    id_client : {
        type : mongoose.Schema.ObjectId,
        ref : "clients"
    }
});


var ClientSchema = new mongoose.Schema({
    nom : String,
    prenom : String,
    age : Number,
    email : String,
    fax : String,
    tel : String,
    id_user : {
           type : mongoose.Schema.ObjectId,
           ref : 'users'
    },
    comptes : [{

        type : mongoose.Schema.ObjectId,
        ref : 'comptes'
    }]
    
    


});




mongoose.connect("mongodb://localhost/banque6");

var UserModel = mongoose.model("users",UserSchema);
var ClientModel = mongoose.model("clients",ClientSchema);
var CompteModel = mongoose.model("comptes",CompteSchema);


module.exports.UserModel = UserModel;
module.exports.ClientModel = ClientModel;
module.exports.CompteModel = CompteModel;