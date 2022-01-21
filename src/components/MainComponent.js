import React, { Component } from 'react';
import ChatList from './ChatListComponent'
import ChatRoom from './ChatRoomComponent';
import Profile from './ProfileComponent' ;
class Main extends Component{
    render(){
        <p>hello</p>
        return (
            <div >
                <div className='chat-list'>
                    <ChatList />
                </div>
                <div className='chat-room'>
                    <ChatRoom />
                </div>
                <div className='profile'>
                    <Profile />
                </div>
            </div>

        );
    }
}
export default Main;