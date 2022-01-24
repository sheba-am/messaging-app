import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useContacts } from '../contexts/ContactsProvider';
import BookData from '../data/Data.json'
import SearchBar from './SearchBar';
export default function Contacts() {
  const {contacts, selectContactId} =useContacts()
//we get the list of my contacts from contacts provider and show them here
  return (
    <div>
      <SearchBar placeholder="Search..." data={BookData} />

      <ListGroup variant="flush" >
        {contacts.map(contact => (
          <ListGroup.Item 
            key={contact.id} 
            className="thumbnail-list"
            onClick ={() => selectContactId(contact.id)}
            active ={contact.selected}
            >

            {contact.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>);
}
