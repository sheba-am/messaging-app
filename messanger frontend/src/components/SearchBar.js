import { Button, ListGroup } from 'react-bootstrap'

import React, { useState } from "react";
import {search} from 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios'
//import "./SearchBar.css";
//import SearchIcon from "@material-ui/icons/Search";
//import CloseIcon from "@material-ui/icons/Close";
const config = {
  headers: {
      'Content-type': 'application/json',
  }
}
const SendFriendRequest= (username, myId) => {
  myId = JSON.parse(localStorage.getItem('user'))['username']
  console.log('send friend req '+ username)
  // QueryDict: {'from': ['Maddie'], 'to': ['Dolores']}
  const result = axios.post(
    'http://127.0.0.1:8000/api/users/friendRequest',
    {'from': myId, 'to': username}
    , config
  ).then((response) => response)
  .then((response) => {
    console.log(response)
    if(response.data === "You are blocked by this user"){
      window.alert(response.data)
    }
  })
}



const blockUser= (username) => {
  const myId = JSON.parse(localStorage.getItem('user'))['username']
  console.log('send friend req '+ username)
  // QueryDict: {'from': ['Maddie'], 'to': ['Dolores']}
  const result = axios.post(
    'http://127.0.0.1:8000/api/users/block',
    {'username': myId, 'block': username}
    , config
  ).then((response) => response)
  .then((response) => {
    localStorage.setItem("user", JSON.stringify(response.data))
    console.log(response.data)
  })
}

function SearchBar({ placeholder, data ,id}) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [users, setUsers] = useState([]);
  


  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);

    const result = axios.post(
      'http://127.0.0.1:8000/api/users/search',
      {"keyword":wordEntered}
      , config
    ).then((response) => response)
    .then((response) => {
      // console.log(response.data[0].username)
      setFilteredData(response.data)
    })
    console.log("users are:")
    console.log(filteredData)
    const newFilter = users.filter((value) => {
      console.log("value is:" + value.username)
      return value.username.toLowerCase()
    });

    if (searchWord === "") {
      setFilteredData([]);
    }
    // } else {
    //   setFilteredData(newFilter);
    // }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className="search">
      <div className="searchInputs">
        <input
          type="text"
          placeholder={placeholder}
          value={wordEntered}
          onChange={handleFilter}
        />

      </div>
      <div className="bi-search search-icon"></div>
      {filteredData.length != 0 && (
        <ListGroup className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
            
                <ListGroup.Item>
                  {value.username} 
                  <button type="button"  onClick={()=>SendFriendRequest(value.username, id)} className='btn btn-success send-friend-request'> 
                  +
                    </button>
                  <button type="button" onClick={()=>blockUser(value.username)} className='btn btn-danger  block-user'>
                    -
                  </button>
                </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </div>
  );
}

export default SearchBar;