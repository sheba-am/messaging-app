import React, { Component } from 'react';
import ThumbnailList from './ThumbnailList';
class ChatList extends Component{
    render(){
        return (
            <div>
                <div className='chat-list-header'>
                    <div className='search-box'>

                    </div>
                </div>
                <div>
                    <ThumbnailList />
                </div>

            </div>
        );
    }
}
export default ChatList;