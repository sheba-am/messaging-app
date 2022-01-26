import React, { useRef } from 'react'
import { Modal, Form, Button, ListGroup } from 'react-bootstrap'
import {useContacts} from '../contexts/ContactsProvider'
import axios from 'axios'
export default function NewContactModal({ closeModal }) {
  const idRef = useRef()
  const nameRef = useRef()
  const { createContact, contacts,selectContactId } = useContacts()
  const friendRequests = JSON.parse(localStorage.getItem('user'))['friendRequests']
  console.log(friendRequests)
  function handleSubmit(e) {
    e.preventDefault()

    createContact(idRef.current.value, nameRef.current.value, false)
    closeModal()
  }

  function acceptSubmit(e){
    const config = {
      headers: {
          'Content-type': 'application/json',
      }
    }
    const myId = JSON.parse(localStorage.getItem('user'))['username']
    const result = axios.post(
      'http://127.0.0.1:8000/api/users/friendRequestResponse',
      {'username': myId, 'num': e.target.id, 'accept': 'yes'}
      , config
    ).then((response) => response)
    .then((response) => {
      localStorage.setItem("user", JSON.stringify(response.data))
      console.log(response.data)
    })
  }
  function denySubmit(e){
    const config = {
      headers: {
          'Content-type': 'application/json',
      }
    }
    const myId = JSON.parse(localStorage.getItem('user'))['username']
    const result = axios.post(
      'http://127.0.0.1:8000/api/users/friendRequestResponse',
      {'username': myId, 'num': e.target.id, 'accept': 'no'}
      , config
    ).then((response) => response)
    .then((response) => {
      localStorage.setItem("user", JSON.stringify(response.data))
      console.log(response.data)
    })
  }
  return (
    <>
      <Modal.Header closeButton>Friend Requests</Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush" >
          {friendRequests.map((contact, index) => (
            
            <ListGroup.Item 
              key={index} 
              onClick ={() => selectContactId(contact.id)}
              active ={contact.selected}
              >

              {contact}

              <Button type="button" id={index} onClick={acceptSubmit} className='btn btn-success friend-request-accept'>
                accept
            </Button>
            <Button type="button" id={index} onClick={denySubmit} className='btn btn-danger  friend-request-deny'>
                deny
            </Button>



            </ListGroup.Item>
          
          ))}
        </ListGroup>



        {/* <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Id</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>
          <Button type="submit">Create</Button>
        </Form> */}
      </Modal.Body>
    </>
  )
}