import React, { useContext, useState } from 'react'
import useLocalStorage from '../hooks/useLocalStorage';
import { useContacts } from './ContactsProvider';

const ConversationsContext = React.createContext()
// to show our contacts
export function useConversations() {
  return useContext(ConversationsContext)
}
//this code is used to create new contacts 
export function ConversationsProvider({ id, children }) {
  const [conversations, setConversations] = useLocalStorage('conversations', []) //this is where you save an array of contacts
  const [selectedConversationIndex, setSelectedConversationIndex]=useState(0)
  const  {contacts} =useContacts() //access to our contacts  
  // add the new contact to contact list
  function createConversation(recipients) {
    setConversations(prevConversations => {
      return [...prevConversations , { recipients, messages: []}]
    })
  }

  //this function is to send a message from any sender
  function addMessageToConversation({recipients, text, sender})
  {
    //first we need to check if we already had a conversation with recipient
    setConversations( prevConversations => {
        let madeChange = false
        const newMessage = {sender, text}

        // if we find the same recipients in previous conversation we add new message to it's 
        //messages if not new conversation is the same
        const newConversations = prevConversations.map(conversation =>{
            if (arrayEquality(conversation.recipients, recipients))
            {
                madeChange = true
                return { //add the message to the conversation
                    ...conversation,
                    messages:[...conversation.messages, newMessage]    
                }                

            }
            return conversation
        })


        if (madeChange) { //we had messages sent before
            return newConversations
        } else { //we didn't have any messages before
            return [
                ...prevConversations,
                {recipients, messages:[newMessage]}
            ]
        }
    })
  }

  //this function sends a message from the current user
  function sendMessage(recipients, text) {
      addMessageToConversation({recipients, text, sender: id })
  }


  // we save our msgs like this 
  const formattedConversations = conversations.map( (conversation,index) => {
        const recipients = conversation.recipients.map( recipient => {
          const contact = contacts.find( contact => {
              return contact.id === recipient
          })
          const name =(contact && contact.name) || recipient    
          return {id: recipient, name}
      })

      
      const messages = conversation.messages.map(message => {
        const contact = contacts.find( contact => {
            return contact.id === message.sender
        })
        const name = (contact && contact.name) || message.sender 
        
        // check if I sent the message
        const fromMe = id === message.sender
        return { ...message, senderName: name, fromMe }
      })

      //we want to check if our contact is selected
      const selected = index === selectedConversationIndex
      return{...conversation, messages, recipients, selected}
  })



  const value = {
      conversations: formattedConversations, 
      createConversation,
      selectConversationIndex: setSelectedConversationIndex,
      selectedConversation: formattedConversations[selectedConversationIndex], //getting the selected conversation
      sendMessage
  }
  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  )
}

function arrayEquality( a, b) {
    if(a.length !== b.length) return false

    a.sort();
    b.sort()
    //check if a and b are equal
    return a.every((element,index) => {
        return element === b[index]
    })
}