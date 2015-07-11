var React = require('react');
var PageStore=require('./stores/page');
var IndexComponent=require('./components/index')

window.Zhaohaola={
    run:function(options){
        if (!options) {
            options = {}
        }
        var data = PageStore.data;
        if (options.questions) {
            data.questions = options.questions
        }
        if (options.phone) {
            data.phone = options.phone
        }
        this.render()
    },
    render: function() {
        React.render(React.createElement(IndexComponent, null), document.getElementById("root"))
    }
}