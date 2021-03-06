import React, { Component } from 'react';
import ChatList from './ChatListComponent'
import OpenConversation from './OpenConversation'
import { useConversations} from '../contexts/ConversationsProvider'
import Profile from './ProfileComponent' ;
// class Main extends Component{
//     render(){
//         <p>hello</p>
//         return (
//             <div >
//                 <div className='chat-list'>
//                     <ChatList />
//                 </div>
//                 <div className='chat-room'>
//                     <ChatRoom />
//                 </div>
//                 <div className='profile'>
//                     <Profile />
//                 </div>
//             </div>

//         );
//     }
// }
const geteSelected = () => {
    let show =localStorage.getItem('selecting')
    console.log(show)
  }

export default function Main({id}) {
    const {selectedConversation} =useConversations()


    return(
        <div  className="d-flex" style={{ height: '100vh' }}>
            <ChatList id={id} />
            
            {// open conversation if we selected that conversation
            <OpenConversation />
        }
            <Profile />
        </div>
    )


}