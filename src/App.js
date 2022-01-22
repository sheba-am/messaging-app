import React, { Component } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Main from './components/MainComponent'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/LoginComponent' ;
import useLocalStorage from "./hooks/useLocalStorage";
// class App extends Component {
//   state = {
//     isLoggedIn: true,
//     messages: [],
//     value: '',
//     name: '',
//     room: 'vacad',
//   }

//   client = new W3CWebSocket('ws://django-chat-app.herokuapp.com/ws/chat/' + this.state.room + '/');
//   componentDidMount() {
//     this.client.onopen = () => {
//     console.log('WebSocket Client Connected');
//       }
//     }

//   render() {
//     return (


//           <div className="App">
//             <Main />
//           </div>
 

//     )
//   }
// }
function App() {
  const[id,setId] =useLocalStorage('id'); //pass the id value to stay with us
    
    return (

        id ? <Main id={id} /> :<Login onIdSubmit={setId} />

    )
}
export default App;
