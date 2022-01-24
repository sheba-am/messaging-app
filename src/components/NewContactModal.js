import React, { useRef } from 'react'
import { Modal, Form, Button, ListGroup, ListGroupItem } from 'react-bootstrap'
import {useContacts} from '../contexts/ContactsProvider'
export default function NewContactModal({ closeModal }) {
  const idRef = useRef()
  const nameRef = useRef()
  const { createContact, contacts,selectContactId } = useContacts()

  function handleSubmit(e) {
    e.preventDefault()

    createContact(idRef.current.value, nameRef.current.value, false)
    closeModal()
  }

  return (
    <>
      <Modal.Header closeButton>Friend Requests</Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush" >
          {contacts.map(contact => (
            <ListGroup.Item 
              key={contact.id} 
              onClick ={() => selectContactId(contact.id)}
              active ={contact.selected}
              >

              {contact.name}

              <Button type="button" className='btn btn-success friend-request-accept'>
                accept
            </Button>
            <Button type="button" className='btn btn-danger  friend-request-deny'>
                deny
            </Button>



            </ListGroup.Item>

            
          ))}
        </ListGroup>



        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Id</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>
          <Button type="submit">Create</Button>
        </Form>
      </Modal.Body>
    </>
  )
}