import React, { Component } from 'react';
import ChatRoomHeader from './ChatRoomtHeaderComponent';
import ChatRoomMsgBox from './ChatRoomMsgBoxComponent';
import ChatRoomChatBox from './ChatRoomChatBox';
class ChatRoom extends Component{
    render(){
        return (
            <div>
                <div className='chat-room-header'>
                    <ChatRoomHeader />
                </div>
                <div className='msg-box'>
                    <ChatRoomMsgBox />
                </div>
                <div className='chat-box'>
                    <ChatRoomChatBox />
                </div>
            </div>

        );
    }
}
export default ChatRoom;