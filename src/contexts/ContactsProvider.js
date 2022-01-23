import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';

const ContactsContext = React.createContext()
// to show our contacts
export function useContacts() {
  return useContext(ContactsContext)
}
//this code is used to create new contacts
export function ContactsProvider({ children }) {
  const [contacts, setContacts] = useLocalStorage('contacts', []) //this is where you save an array of contacts
// add the new contact to contact list
  function createContact(id, name) {
    setContacts(prevContacts => {
      return [...prevContacts, { id, name }]
    })
  }

  return (
    <ContactsContext.Provider value={{ contacts, createContact }}>
      {children}
    </ContactsContext.Provider>
  )
}