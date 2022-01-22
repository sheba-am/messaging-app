import React, { Component } from 'react';
import ChatThumbnail from './ChatThumbnailComponent';
class ThumbnailList extends Component{
    render(){
        return (
            <div className='thumbnail-list'>
                <ChatThumbnail />
                <ChatThumbnail />
                <ChatThumbnail />
            </div>
        );
    }
}
export default ThumbnailList;