/**
 * Created by joy on 2015/6/15.
 */

var bcrypt=require('bcrypt');
var redis = require('redis');
var db = redis.createClient();

/**
 * export User class from the module
 * @type {User}
 */
module.exports=User;

/**
 * constructor of class User.
 * @param obj
 * @constructor
 */
function User(obj){
    //iterate keys in the object passed, and merge values in to new created User object.
    for(var key in obj)
    this[key]=obj[key];
}


/**
 * save an user(create if not exist or update user's info in redis db.)
 * @param fn
 */
User.prototype.save=function(fn){
   /*user already exists*/
   if(this.id){
       this.update(fn);
   }
    else{
       var user=this;
       /*create unique id for this new user, the 'user:ids' key keeps the global atomic number*/
       db.incr('user:ids',function(err,id){
           if(err) return fn(err);
           user.id=id;
           user.hashPassword(function(err){
               if(err) return fn(err);
               user.update(fn);
           })
       });
    }
};

/**
 *
 * @param fn
 */
User.prototype.update=function(fn) {
    var user=this;
    var id=user.id;
    /*add index from user:id:<username> to userid, so can search userid by username in redis db*/
    db.set('user:id:'+user.name,id,function(err){
       if(err) return fn(err);
        /*add hash from user:<id> to user's information, 'hmset' method set multiple fields at one time*/
       db.hmset('user:'+id,user,function(err){
           fn(err);
       })
    });
};

/**
 * when the user is first created, it'll need to have a .pass property set to the user's password.
 * the user-saving logic will generate salt for user.pass and salt the .pass into hash.
 * salt and hash will be stored in database instead of pass(plain text)
 * @param fn the callback
 */
User.prototype.hashPassword=function(fn){
    var user=this;
    bcrypt.genSalt(12,function(err,salt){
        if(err) {
            return fn(err);
        }
        user.salt=salt;
        bcrypt.hash(user.pass,salt,function(err,hash){
            if(err) return fn(err);
            user.pass=hash;
            fn();
        })
    });
}


/**
 * look up user Id by name and grab user with the id.
 * @param name
 * @param fn
 * @returns {*}
 */
User.getByName=function(name,fn){
    User.getId(name,function(err,id){
        if(err) return fn(err);
        User.get(id,fn);
    });
}


/**
 * get id indexed by name
 *
 * @param name
 * @param fn
 */
User.getId=function(name,fn){
    db.get('user:id:'+name,fn);
}

/**
 * fetch plain object hash from db
 * @param id
 * @param fn
 */
User.get=function(id,fn) {
    db.hgetall('user:'+id,function(err,user){
       if(err) return fn(err);
        fn(null,new User(user));/*convert plain text to a new User object*/
    });
};


/**
 *authenticate whether an user exist and password is correct when login.
 * @param name
 * @param pass
 * @param fn callback first element is the err.
 */
User.authenticate=function(name,pass,fn){
    User.getByName(name,function(err,user){
       if(err) return fn(err);
       if(!user.id) return fn();/*user doesn't exist*/
       bcrypt.hash(pass,usr.salt,function(err,hash){
          if(err) return fn(err);
          if(hash==user.pass) return fn(null,user);
       });
    });
};



/*test codes*/
//var tobi=new User({
//    name:'Tobi',
//    pass:'im a ferret',
//    age: '2'
//});
//
//tobi.save(function(err){
//   if(err)
//   throw err;
//    console.log('user id :%d',tobi.id);
//});
