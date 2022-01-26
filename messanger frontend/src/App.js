import React, { Component ,useContext, createContext} from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Main from './components/MainComponent'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/LoginComponent' ;
import useLocalStorage from "./hooks/useLocalStorage";
import { ContactsProvider } from "./contexts/ContactsProvider";
import { ConversationsProvider} from './contexts/ConversationsProvider';
import {useLocalState} from './components/hooks'


export const SelectContext =React.createContext('notyet');

function App() {
  // export function useSelecting() {
  //   return useContext(SelectContext)
  // }
  const[id,setId] =useLocalStorage('id'); //pass the id value to stay with us
  const[selecting,setSelecting] = useLocalState('selectConv')


//we want our main app to have access to our contacts and conversations
  const main = (
    <SelectContext.Provider value={[selecting,setSelecting]}>
      <ContactsProvider>
        <ConversationsProvider id={id}>
          <Main id={id} />
        </ConversationsProvider>
      </ContactsProvider>
    </SelectContext.Provider>

  )

    return (

        id ? main :<Login onIdSubmit={setId} />

    )
}
export default App;
