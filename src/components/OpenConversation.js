import React, {useState, useCallback, useRef, useEffect, useContext} from 'react';
import { Form,InputGroup,Button } from 'react-bootstrap';
import { useConversations } from '../contexts/ConversationsProvider';
import { SelectContext } from '../App';

export default function OpenConversation({id}) {

    const [selecting, setSelecting] =useContext(SelectContext)
    console.log(selecting)
  let chatSocket = null;
  const chatRef = useRef()
  console.log(chatRef)
  let chatLog = document.querySelector("#chatLog");
  console.log("chatLog: " + chatLog)

  function connect(chatLog) {
    let roomName = id+'-'+selecting
    //let roomName = 'admin-dani'

    chatSocket = new WebSocket("ws://" + "127.0.0.1:8000" + "/ws/chat/private/" + roomName + "/");
    console.log(chatSocket)
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
        console.log("WebSocket encountered an error: " + err.message);
        console.log("Closing the socket.");
        chatSocket.close();
    }
}

useEffect(() => {
  // Update the document title using the browser API
  console.log("useEffect")
  console.log(chatRef)

  if(selecting !== 'notyet'){
    connect(chatRef.current)
    
  }
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
        chatSocket.send(JSON.stringify({
            "message": "test",
        }));
    }
    

  return (
    <div className="d-flex flex-column flex-grow-1 chat-room">
      <div className="flex-grow-1 overflow-auto">
        <div className="d-flex flex-column align-items-start justify-content-end px-3">
        <textarea ref={chatRef} value="one" className="complete-chat">text</textarea>
          {/* {selectedConversation.messages.map((message, index) => {
            const lastMessage = selectedConversation.messages.length -1 ===index
            return (
              <div
                ref = {lastMessage ? setRef : null }
                key= {index}
                className={`my-1 d-flex flex-column ${message.fromMe ? 'align-self-end align-items-end' : 'align-items-start'}`}
              >
                <div
                  className={` px-2 py-1 ${message.fromMe ? 'my-msg text-white' : 'other-msg text-white border'}`}>
                  {message.text}
                </div>
                <div className={`text-muted small ${message.fromMe ? 'text-right' : ''}`}>
                  {message.fromMe ? 'You' : message.senderName}
                </div>
              </div>
            )
          })} */}
        </div>
    </div>



        <Form onSubmit={handleSubmit}>
            <Form.Group className="m-2">
                <InputGroup>
                    <Form.Control 
                        as="textarea" 
                        required 
                        // value={text} 
                        // onChange={e => setText(e.target.value)}
                        style={{height: '75px', resize:'none' }}

                    />  
                    <Button 
                    onClick={clickHandle} 
                    type="submit">Send</Button>
                </InputGroup>
            </Form.Group>
        </Form>

    </div>);
}
