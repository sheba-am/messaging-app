import React, { Component, useState } from 'react';
import ChatList from './ChatListComponent'
import OpenConversation from './OpenConversation'
import { useConversations} from '../contexts/ConversationsProvider'
import Profile from './ProfileComponent' ;

const geteSelected = () => {
    let show =localStorage.getItem('selecting')
    console.log(show)
  }

export default function Main({id}) {
    const {selectedConversation} =useConversations()
    const [groups, setGroups] = useState("")

    return(
        <div  className="d-flex" style={{ height: '100vh' }}>
            <ChatList id={id} setGroups={setGroups}/>
            
            {// open conversation if we selected that conversation
            <OpenConversation groups={groups}/>
        }
            <Profile />
        </div>
    )


}