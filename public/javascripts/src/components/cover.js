/**
 * Created by joy on 2015/6/13.
 */
var React = require("react");
var PageActions = require("../actions/actions");

var cover=React.createClass(
    {
        displayName:"exports",
        getInitialState: function(){
            return {}
        },
        onJumpToQuestion:function(e){
            console.log("triggered");
            e.preventDefault();
            PageActions.jump("question");
        },
        render: function() {
            return (
            <div className="wrap">
                <div className="main clouds">
                    <div className='table02'>
                        <div className='table02-cont'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <p><span>眼睛红最常见的原因是得不到充分休息，导致眼部毛细血管充血扩张.</span></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>我们平时看到的白眼球上的血管是结膜下毛细血管，不仅供血丰富而且对外界刺激很敏感，长期用眼会导致眼部自由基增加，刺激充血，还可能诱发各种眼部疾病</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>如果您长期眼睛充血，不妨试下下面的测试，轻松几步帮您获得对症的分析</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <input className="btn btn-alt startbtn"  type="button" value="开始体检" onClick={this.onJumpToQuestion} />
                </div>
            </div>
            );
        }
    }
);
module.exports=cover;