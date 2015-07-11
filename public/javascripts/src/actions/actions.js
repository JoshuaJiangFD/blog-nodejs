/**
 * Created by joy on 2015/6/12.
 */
var Reflux = require('reflux');
var $ = require('zeptojs');
var PageActions=Reflux.createActions(
    {
        jump:{},
        finishQuestion:{
            asyncResult:true
        }
    }
);
PageActions.finishQuestion.listen(function(answers){
    $.ajax({
       type:'get',
       url: '/quiz',
        data: {
            jsonData: JSON.stringify(answers)
        },
       dataType: 'json',
       success: function(validationResponse) {
           PageActions.finishQuestion.completed(validationResponse,null)
        }
    });

});
module.exports=PageActions;