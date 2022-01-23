import React, { Component,useState } from 'react';
import ThumbnailList from './ThumbnailList';
// class ChatList extends Component{
//     render(){
//         return (
//             <div>
//                 <div className='chat-list-header'>
//                     <div className='search-box'>
//                         <button className='search-icon'>
//                             ?
//                         </button>

//                     </div>
//                 </div>
//                 <div>
//                     <ThumbnailList />
//                 </div>

//             </div>
//         );
//     }
// }
// export default ChatList;
import {Tab,Nav,Button,Modal} from 'react-bootstrap';
import Conversations from './Conversations';
import Contacts from './Contacts' ;
import NewContactModal from './NewContactModal'
import NewConversationModal from './NewConversationModal'
const CONVERSATIONS_KEY = 'conversations';
const CONTACT_KEY = 'contacts';



export default function ChatListComponent({id}) {
    const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY)
    const conversationsOpen = activeKey === CONVERSATIONS_KEY
    const [modalOpen, setModalOpen] = useState(false)
  
    function closeModal() {
        setModalOpen(false)
      }

  return (
    <div style={{width: '250px' }} className="d-flex flex-column">
        <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
            <Nav variant="tabs" className="justify-content-center">
                <Nav.Item>
                    <Nav.Link eventKey={CONVERSATIONS_KEY}>Conversations</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey={CONTACT_KEY}>Contacts</Nav.Link>
                </Nav.Item>                
            </Nav>
            <Tab.Content className="border-right overflow-auto flex-grow-1">
                <Tab.Pane eventKey={CONVERSATIONS_KEY}>                   
                    <Conversations />
                </Tab.Pane>
                <Tab.Pane eventKey={CONTACT_KEY}>                   
                    <Contacts />
                </Tab.Pane>                
            </Tab.Content>
            <div className="p-2 border-top border-right small">
                Id <span className="text-muted">{id}</span>
            </div>
            <Button onClick={() => setModalOpen(true)} className="rounded-0">
                New {conversationsOpen ? 'Conversation' : 'Contact'}
            </Button>
        </Tab.Container>
        <Modal show={modalOpen} onHide={closeModal}>
            {conversationsOpen ?
            <NewConversationModal closeModal={closeModal} /> :
            <NewContactModal closeModal={closeModal} />
            }
        </Modal>
    </div>
    );
}