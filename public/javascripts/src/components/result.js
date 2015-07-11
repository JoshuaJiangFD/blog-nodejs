/**
 * result page is to show the result from user's selection.
 *
 * it's a static page so actually no state need to be set internally.
 * page's content is fully decided by the parameter passed in, as this.props
 *
 * Created by krystal on 6/17/15.
 */
var React = require('react/addons');


module.exports=React.createClass({
    displayName:"exports",
    getInitialState: function(){
        var body=document.getElementsByTagName("body")[0];
        var height=window.innerHeight||body.clientHeight;
        return{
            height:height,
            answer:this.props.answer
        }
    },
    render:function(){
        var image="images/"+this.state.answer.rating+"-star.png";
        return(
            <div className='table02'>
                <div className='table02-cont'>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <h3>您的结果分析如下</h3>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>{this.state.answer.title}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><span>{this.state.answer.advice}</span></p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>紧急程度</b>
                                    <img src={image} className='starpic'/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
});