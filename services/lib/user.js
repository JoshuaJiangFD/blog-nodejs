/**
 * Created by krystal on 7/4/15.
 */
var User = require('../../models/user');

module.exports=function(req,res,next){
    var uid=req.session.uid;
    if(!uid) return next();
    User.get(uid,function(err,user){
        if(err) return next(err);
        req.user=res.locals.user=user;
        next();
    });
};