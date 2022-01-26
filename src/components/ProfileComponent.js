import React , { useContext} from 'react';

import { SelectContext } from '../App';

export default function ProfileComponent() {
  const [selecting, setSelecting] =useContext(SelectContext)



    // const {sendMessage, selectedConversation} = useConversations()
    //const {selectedContact} = useContacts()

  return (
    <div className="d-flex  profile justify-content-center">
        <div className='profile-header'>
        </div>
        <div className='big-profile-picture'>

        </div>
        <div className='profile-name'>
        {selecting}
          {/* { contacts.length >0 ?console.log(selectedContact): console.log("zero")} */}
          {/* {selectedContact? selectedContact.name :""} */}
        </div>
        
        {/* <div className='delete-button'>
            Friend Request
        </div> */}
        {/* <Button className='friend-request'>
          Friend Request

        </Button> */}
    </div>
  );
}
