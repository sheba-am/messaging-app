import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useContacts } from '../contexts/ContactsProvider';
import BookData from '../data/Data.json'
import SearchBar from './SearchBar';
export default function Contacts() {
  const {contacts, selectContactId} =useContacts()
  let friends = []
  if(localStorage.getItem('user') != undefined){
   friends = JSON.parse(localStorage.getItem('user'))['friends']
  }
   
  // console.log(friends)
//we get the list of my contacts from contacts provider and show them here
  return (
    <div>
      <SearchBar placeholder="Search..." data={BookData} />

      <ListGroup variant="flush" >
        {friends? friends.map(contact => (
          <ListGroup.Item 
            key={contact} 
            className="thumbnail-list"
            onClick ={() => selectContactId(contact)}
            active ={contact}
            >

            {contact}
          </ListGroup.Item>
        )) : <div></div>}
      </ListGroup>
    </div>);
}
