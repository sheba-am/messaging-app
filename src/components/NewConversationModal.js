import React, { useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import {  useContacts  } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'

export default function NewConversationModal({ closeModal }) {
  const {contacts} =useContacts();
  const {createConversation} =useConversations();
  const [selectedContactIds, setSelectedContactIds] = useState([]);

  function handleSubmit(e) {
    e.preventDefault()
    createConversation(selectedContactIds)
    closeModal()
  }
  
  function handleCheckboxChange(contactId){
    setSelectedContactIds(prevSelectedContactIds => {
      if(prevSelectedContactIds.includes(contactId)) {
        return prevSelectedContactIds.filter(prevId =>{
          return contactId !== prevId  //this keeps all the different contacts and remove the same one
        })
      } else {
        return [...prevSelectedContactIds, contactId] //add the new contact
      }
    })
  }

  return (
    <div>
      <Modal.Header closeButton>Create Conversations</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map(contact =>(
            <Form.Group controlId={contact.id} key={contact.id}>
              <Form.Check
              type="checkbox"
              value={selectedContactIds.includes(contact.id)}
              label={contact.name}
              onChange={() => handleCheckboxChange(contact.id)}
              >

              </Form.Check>
            </Form.Group>
          ))}
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </div>
  )
}