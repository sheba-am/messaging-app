import React, { Component } from 'react';
import ChatRoomMessages from './ChatRoomMessages';
class ChatRoomMsgBox extends Component{
    render(){
        return (
            <div className='msg-box'>

                <div className='container'>
                    <div className='row'>
                        <ChatRoomMessages />
                        
                    </div>
                    <div className='row'>
                        <ChatRoomMessages />
                        
                    </div>
                    <div className='row'>
                        <ChatRoomMessages />
                        
                    </div>
                    <div className='row'>
                        <ChatRoomMessages />
                        
                    </div>
                    <div className='row'>
                        <ChatRoomMessages />
                        
                    </div>
                    <div className='row'>
                        <ChatRoomMessages />
                        
                    </div>
                    <div className='row'>
                        <ChatRoomMessages />
                        
                    </div>                                                                                
                </div>
                
            </div>
        );
    }
}
export default ChatRoomMsgBox;