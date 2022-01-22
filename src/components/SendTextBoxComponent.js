import React, { Component } from 'react';
class SendTextBox extends Component{
//     render(){
//         return (
//             <div >
//                 <input type="text" className='send-text-box' ></input>
//             </div>
//         );
//     }
// }
render(){
    return (
        <div >
            <form>
                <div class="form-group" >
                    <textarea class="form-control send-text-box" id="send-msg" rows="3"></textarea>
                </div>
            </form>
        </div>
    );
}
}
export default SendTextBox;