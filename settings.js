/**
 * Created by krystal on 7/5/15.
 */
module.exports.secrets={
    cookieSecret:'surveynodejs_cookie_2015',
    sessionSecret:'surveynodejs_session_2015'
};


/*see doc of connect-redis*/
module.exports.sessionStoreConfig={
    host:'127.0.0.1',
    port:6379,
    db:2,/*database index to use, redis use integer as database name*/
    pass:'password',
    prefix:'sess:'
};

module.exports.mongodbConfig={

};

