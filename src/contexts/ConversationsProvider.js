import React, { useContext } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';

const ConversationsContext = React.createContext()
// to show our contacts
export function useConversations() {
  return useContext(ConversationsContext)
}
//this code is used to create new contacts 
export function ConversationsProvider({ children }) {
  const [conversations, setConversations] = useLocalStorage('conversations', []) //this is where you save an array of contacts
  const  {contacts} =useContacts() //access to our contacts  
  // add the new contact to contact list
  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations , { recipients, messages: []}]
    })
  }
  // we save our msgs like this 
  const formattedConversations = conversations.map( conversation => {
      const recipients = conversation.recipients.map( recipient => {
          const contact = contacts.find( contact => {
              return contact.id === recipient
          })
          const name =(contact && contact.name) || recipient    
          return {id: recipient, name}
      })
      return{...conversation, recipients}
  })

  const value = {
      conversations: formattedConversations, 
      createConversation
  }
  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}