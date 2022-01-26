import React, {useState, useCallback, useRef, useEffect, useContext} from 'react';
import { Form,InputGroup,Button, ListGroup, Text } from 'react-bootstrap';
import { useConversations } from '../contexts/ConversationsProvider';
import axios from 'axios'
import { SelectContext } from '../App';

export default function OpenConversation() {
  const [selecting, setSelecting] =useContext(SelectContext)
  let chatSocket = null;
  const chatRef = useRef()
  const messRef = useRef()
  let groupData = null
  if(localStorage.getItem("group")){
    groupData = JSON.parse(localStorage.getItem("group"))
    console.log(groupData.members)
  }
   
  // console.log(chatRef)

  // let chatLog = document.querySelector("#chatLog");
  // console.log("chatLog: " + chatLog)

  function connect(chatLog) {
    // console.log(window.location.pathname);
    // let temp = window.location.pathname
    // let other_user = temp.slice(1)
    // console.log("other_user"+ other_user)
    console.log("ogjrtohbjgopb9jig9j")
    let roomName = []
    if(localStorage.getItem('user')){
      roomName = JSON.parse(localStorage.getItem('user'))['username'] + "-" + selecting
    }else{
      return
    }
    if(roomName.includes("undefined") || roomName.endsWith("-")){

    }else{
      if(localStorage.getItem("chatType")==="group"){
        chatSocket = new WebSocket("ws://" + "127.0.0.1:8000" + "/ws/chat/group/" + roomName + "/");
      }else if (localStorage.getItem("chatType")==="friend"){
        chatSocket = new WebSocket("ws://" + "127.0.0.1:8000" + "/ws/chat/private/" + roomName + "/");
      }
    if (!chatSocket){
      return
    }
    // console.log(chatSocket)
    chatSocket.onopen = function(e) {
        console.log("Successfully connected to the WebSocket.");
        
    }

    chatSocket.onclose = function(e) {
        console.log("WebSocket connection closed unexpectedly. Trying to reconnect in 2s...");
        setTimeout(function() {
            console.log("Reconnecting...");
            connect();
        }, 2000);
    };

    chatSocket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data);

        switch (data.type) {
            case "chat_message":
                chatLog.value += data.user + ": " + data.message + "\n";
                break;
            case "user_list":
                for (let i = 0; i < data.users.length; i++) {
                    // onlineUsersSelectorAdd(data.users[i]);
                }
                break;
            case "user_join":
                // onlineUsersSelectorAdd(data.user);
                break;
            case "user_leave":
                // chatLog.value += data.user + " left the room.\n";
                // onlineUsersSelectorRemove(data.user);
                break;
            case "private_message":
                chatLog.value += "PM from " + data.user + ": " + data.message + "\n";
                break;
            case "private_message_delivered":
                chatLog.value += "PM to " + data.target + ": " + data.message + "\n";
                break;
            case "prev_messages":
                chatLog.value = ""
                for (let i = 0; i < data.contents.length; i++) {

                    chatLog.value += data.users[i] + ": " + data.contents[i] + " at " + data.timestamps[i] + "\n";
                }
                break;
            default:
                console.error("Unknown message type!");
                break;
        }

        // scroll 'chatLog' to the bottom
        chatLog.scrollTop = chatLog.scrollHeight;
    };

    chatSocket.onerror = function(err) {
        // console.log("WebSocket encountered an error: " + err.message);
        // console.log("Closing the socket.");
        chatSocket.close();
    }
  }
}
connect();
let item = null
window.addEventListener('storage', () => {
  // When local storage changes, dump the list to
  // the console.
   console.log(JSON.parse(localStorage.getItem('selecting')))   
});
useEffect(() => {
  // Update the document title using the browser API
  item = localStorage.getItem['selecting']
  connect(chatRef.current)
});



const  clickHandle = ()  => {
  console.log("running")
  chatSocket.send(JSON.stringify({
      "message": "test",
  }));
}

    //const [text,setText] = useState('');
    //const {sendMessage, selectedConversation} = useConversations()
    //this will send us to the last message when we send our message
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({smooth: true})
        }
    },[])
    function handleSubmit(e) {
        e.preventDefault()
        console.log("running")
        console.log(messRef)
        chatSocket.send(JSON.stringify({
            "message": messRef.current.value,
        }));
    }
    function getData(){
      console.log("selecting is:" + localStorage.getItem['selecting'])
    }

  return (
    <div className="d-flex flex-column flex-grow-1 chat-room">

        <Form.Control as="textarea" ref={chatRef} className='complete-chat'/>
        <ListGroup variant="flush" >
        {groupData?  groupData.members.map(contact => (
            <ListGroup.Item 
            >
            {contact}
          </ListGroup.Item>
        )) :<div></div> }
        </ListGroup>




        <Form onSubmit={handleSubmit}>
            <Form.Group className="m-2">
                <InputGroup>
                    <Form.Control 
                        as="textarea" 
                        required 
                        ref={messRef}
                        // value={text} 
                        // onChange={e => setText(e.target.value)}
                        style={{height: '75px', resize:'none' }}

                    />  
                    <Button 
                    // onClick={clickHandle} 
                    type="submit">Send</Button>
                </InputGroup>
            </Form.Group>
        </Form>

    </div>);
}
