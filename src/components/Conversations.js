import React, {useContext} from 'react';
import { ListGroup } from 'react-bootstrap';
import { useConversations } from '../contexts/ConversationsProvider';
import { SelectContext } from '../App';

export default function Conversations() {
  const [selecting, setSelecting] =useContext(SelectContext)
  // const {conversations, selectConversationIndex} = useConversations()
  let friends = []
  let groups = []
  
  if(localStorage.getItem('user') != undefined){
    friends = JSON.parse(localStorage.getItem('user'))['friends']
    groups = JSON.parse(localStorage.getItem('user'))['chats']
   }
  return (
    <div>

      <ListGroup variant="flush" >
        {friends?  friends.map(contact => (
          <ListGroup.Item 
            key={contact} 
            className="thumbnail-list"
            onClick ={()=>setSelecting(contact)} 
            active ={contact === selecting}
            >

            {contact}
          </ListGroup.Item>
        )) :<div></div> }
        </ListGroup>
        <ListGroup variant="flush" >
        {groups? groups.map(contact => (
          <ListGroup.Item 
            key={contact} 
            className="thumbnail-list"
            onClick ={()=>setSelecting(contact)} 
            active ={contact === selecting}
            >
            {contact}
          </ListGroup.Item>
        )) :<div></div> }
      </ListGroup>
    </div>);
}
