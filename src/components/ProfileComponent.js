import React from 'react';
import { useContacts } from '../contexts/ContactsProvider';


export default function ProfileComponent() {
    // const {sendMessage, selectedConversation} = useConversations()
    const {selectContactId, selectedContact} = useContacts()
  return (
    <div className="d-flex  profile justify-content-center">
        <div className='profile-header'>
        </div>
        <div className='big-profile-picture'>

        </div>
        <div className='profile-name'>
        {console.log(selectContactId)}
        {        console.log(selectedContact.name)}
        {selectedContact.name}
        </div>
        <div className='delete-button'>
            Delete
        </div>
    </div>
  );
}

