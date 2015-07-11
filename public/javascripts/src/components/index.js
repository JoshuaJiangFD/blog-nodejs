/**
 * Created by joy on 2015/6/12.
 */
var React = require('react');
var Reflux = require('reflux');
var Store = require('../stores/page');
var CoverPage = require('./cover');
var QuizPage = require('./quiz');
var ListPage = require('./list');
var resultPage=require('./result');



var body=document.body;

var Index=React.createClass(
    {
        displayName: "exports",
        mixins: [Reflux.connect(Store)],
        render:function(){
            body.className="bg_51";
            switch(this.state.page){
                case "cover":
                    return React.createElement(CoverPage, null);
                case "question":
                    body.className = "bg_51";
                    return React.createElement(QuizPage,{questions:this.state.questions});/*second parameter is the props of component*/
                case "result":
                    body.className = "game_bg";
                    return React.createElement(resultPage,{answer:this.state.finalAnswer});
                default:
                    return React.createElement(CoverPage, null);
            }
        }
    }
);

module.exports=Index;