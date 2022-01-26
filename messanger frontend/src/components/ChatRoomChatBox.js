import React, { Component } from 'react';
import SendTextBox from './SendTextBoxComponent';
class ChatRoomChatBox extends Component{
    render(){
        return (
            <div>
                <div >
                    <SendTextBox />            
                </div>
                <div className='send-button'>
                send
                </div>
            </div>

        );
    }
}
export default ChatRoomChatBox;