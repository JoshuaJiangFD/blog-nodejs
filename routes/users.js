var express = require('express');
var login = require('../services/login');
var router = express.Router();

/*login in*/
router.get('/login',function(req,res){
   /*check if the user's credentials are saved in a cookie*/
    login.form(req,res);
   //if(req.cookie.user==undefined||req.cookie.pass==undefined){
   //}
});


/*create new user*/
router.post('login',login.submit);

/*log out*/
router.get('/logout',login.logout);

module.exports = router;
