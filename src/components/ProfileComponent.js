import React from 'react';
import { useContacts } from '../contexts/ContactsProvider';


export default function ProfileComponent() {
    // const {sendMessage, selectedConversation} = useConversations()
    const {selectedContact} = useContacts()

  return (
    <div className="d-flex  profile justify-content-center">
        <div className='profile-header'>
        </div>
        <div className='big-profile-picture'>

        </div>
        <div className='profile-name'>
          {/* { contacts.length >0 ?console.log(selectedContact): console.log("zero")} */}
          {selectedContact? selectedContact.name :""}
        </div>
        <div className='delete-button'>
            Delete
        </div>
    </div>
  );
}
