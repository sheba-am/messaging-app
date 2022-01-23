import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useContacts } from '../contexts/ContactsProvider';
export default function Contacts() {
  const {contacts} =useContacts()
//we get the list of my contacts from contacts provider and show them here
  return (
    <div>
      <ListGroup variant="flush">
        {contacts.map(contact => (
          <ListGroup.Item key={contact.id}>
            {contact.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>);
}
