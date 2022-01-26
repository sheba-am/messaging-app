import React, {useContext} from 'react';
import { ListGroup } from 'react-bootstrap';
import { useConversations } from '../contexts/ConversationsProvider';
import { SelectContext } from '../App';
import axios from 'axios'
export default function Conversations() {
  const [selecting, setSelecting] =useContext(SelectContext)
  const handleClick = (contact) => {
    setSelecting(contact)
    if(groups.includes(contact)){
        localStorage.setItem('chatType', "group")
        const config = {
          headers: {
              'Content-type': 'application/json',
          }
        }
        let username = JSON.parse(localStorage.getItem('user'))['username']
        const result = axios.post(
          'http://127.0.0.1:8000/api/users/getGroup',
          {'name': contact}
          , config
        ).then((response) => response)
        .then((response) => {
          console.log(response.data)
          localStorage.setItem("group", JSON.stringify(response.data))
          }
        )
    }else if (friends.includes(contact)){
        localStorage.setItem('chatType', "friend")
    }
  }
  // const {conversations, selectConversationIndex} = useConversations()
  let friends = []
  let groups = []
  
  if(localStorage.getItem('user') != undefined){
    friends = JSON.parse(localStorage.getItem('user'))['friends']
    groups = JSON.parse(localStorage.getItem('user'))['chats']
   }
  return (
    <div>
      <p className="thumbnail-header text-center">Private Conversations</p>
      <ListGroup variant="flush" >
        {friends?  friends.map(contact => (
          <ListGroup.Item 
            key={contact} 
            className="thumbnail-list"
            onClick ={()=> handleClick(contact)} 
            active ={contact === selecting}
            >

            {contact}
          </ListGroup.Item>
        )) :<div></div> }
        </ListGroup>
        <p className="thumbnail-header text-center">Groups</p>

        <ListGroup variant="flush" >
        {groups? groups.map(contact => (
          <ListGroup.Item 
            key={contact} 
            className="thumbnail-list"
            onClick ={()=> handleClick(contact)} 
            active ={contact === selecting}
            >
            {contact}
          </ListGroup.Item>
        )) :<div></div> }
      </ListGroup>
    </div>);
}
