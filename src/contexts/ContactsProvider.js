import React, { useContext,useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext()
// to show our contacts
export function useContacts() {
  return useContext(ContactsContext)
}
//this code is used to create new contacts 
export function ContactsProvider({ children }) {
  const [contacts, setContacts] = useLocalStorage('contacts', []) //this is where you save an array of contacts
  const [selectedContactId, setSelectedContactId]=useState(0)

  // add the new contact to contact list
  function createContact(id, name, selected) {
    setContacts(prevContacts => {
      return [...prevContacts, { id, name, selected }]
    })
  }

  



  // we save our msgs like this 
  const formattedContacts = contacts.map( (contact) => {

  const name = contact.name
  const id = contact.id
  //we want to check if our contact is selected
  const selected = contact.id === selectedContactId
  return{...contact,name, id, selected}
})



  const value={ 
      contacts: formattedContacts,
      createContact,
      selectContactId: setSelectedContactId, //this is not what it looks like and idk why :(
      selectedContact: formattedContacts[selectedContactId-1] //getting the selected contact

  }
  return (
    <ContactsContext.Provider value={value}>
      {children}
    </ContactsContext.Provider>
  )
}