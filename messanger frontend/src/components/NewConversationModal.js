import React, { useState, useRef } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import {  useContacts  } from '../contexts/ContactsProvider'
import { useConversations } from '../contexts/ConversationsProvider'
import axios from 'axios'
export default function NewConversationModal({ closeModal }) {
  const {contacts} =useContacts();
  const {createConversation} =useConversations();
  const [selectedContactIds, setSelectedContactIds] = useState([]);
  const nameRef = useRef()
  function handleSubmit(e) {
    e.preventDefault()
    const config = {
      headers: {
          'Content-type': 'application/json',
      }
    }
    let username = JSON.parse(localStorage.getItem('user'))['username']
    const result = axios.post(
      'http://127.0.0.1:8000/api/users/newGroup',
      {'username': username, 'name': nameRef.current.value}
      , config
    ).then((response) => response)
    .then((response) => {
      console.log(response.data)
      localStorage.setItem("user", JSON.stringify(response.data))
      }
    )
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
      <Modal.Header closeButton>New Group </Modal.Header>
      <Modal.Body>
        
          <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Create a New Group or Type Existing Group's Name to Join </Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>
          <Button type="submit">Submit</Button>
        </Form>
          
      </Modal.Body>
    </div>
  )
}