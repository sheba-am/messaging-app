
   
import React, { useState } from "react";
import {search} from 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios'
//import "./SearchBar.css";
//import SearchIcon from "@material-ui/icons/Search";
//import CloseIcon from "@material-ui/icons/Close";

function SearchBar({ placeholder, data }) {
  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [users, setUsers] = useState([]);
  
  const config = {
    headers: {
        'Content-type': 'application/json',
    }
  }
  const getResults = async () => {
    
    
  }
  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);

    const result = axios.post(
      'http://127.0.0.1:8000/api/users/search',
      {"keyword":wordEntered}
      , config
    ).then((response) => response)
    .then((response) => {
      console.log(response.data[0].username)
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
        <div className="dataResult">
          {filteredData.slice(0, 15).map((value, key) => {
            return (
              <a className="dataItem" href={value.link} target="_blank">
                <p>{value.username} </p>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchBar;