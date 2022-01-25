import React, { useRef, useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { v4 as uuidV4 } from 'uuid'
import axios from 'axios'
export default function Login({ onIdSubmit }) {
  const idRefName = useRef()
  const idRefPass = useRef()
  const username = useRef()
  const password = useRef()
  const firstName = useRef()
  const email = useRef()
  const [error, setError] = useState("")
  function handleSubmit(e) {
    e.preventDefault() //prevent from refreshing
    console.log(idRefName.current.value)
    console.log(idRefPass.current.value)
    const config = {
      headers: {
          'Content-type': 'application/json',
      }
    }
    const result = axios.post(
      'http://127.0.0.1:8000/api/login',
      {"username":idRefName.current.value, "password":idRefPass.current.value}
      , config
    ).then((response) => response)
    .then((response) => {
      console.log( response)
      if (response.data == "username and password don't match"){
        console.log('yes')
        localStorage.removeItem('whatsapp-clone-id')
        setError(response.data)
      }else{
        onIdSubmit(response.data.username)
        localStorage.setItem("user", JSON.stringify(response.data))
      }
      
    })
    
  }

  function handleRegister(e) {
    e.preventDefault()
    const config = {
      headers: {
          'Content-type': 'application/json',
      }
    }
    const result = axios.post(
      'http://127.0.0.1:8000/api/users/register',
      {"username":username.current.value, "password":password.current.value, "email":email.current.value, "name":firstName.current.value}
      , config
    ).then((response) => response)
    .then((response) => {
      // console.log("username is:" + response.data.username)
      if (response.data == "username already registered"){
        console.log('yes')
        localStorage.removeItem('whatsapp-clone-id')
        setError(response.data)
      }else{
        onIdSubmit(response.data.username)
        localStorage.setItem("user", JSON.stringify(response.data))
      }
    })
  }

  return (
    <Container className="align-items-center d-flex" style={{ height: '100vh' }}>
      <Form onSubmit={handleSubmit} className="w-100 shadow p-3 mb-5 bg-white rounded">
        <Form.Group >
          {error==="username and password don't match" && 
            <Alert variant='danger'>{error}</Alert>
          }
          <Form.Label>Username:</Form.Label>
          <Form.Control type="text" ref={idRefName} required />
          <Form.Label>Password:</Form.Label>
          <Form.Control type="text" ref={idRefPass} required />
        </Form.Group>   
        <Button type="submit" className="mr-2">Login</Button>
        {/* <Button onClick={createNewId} variant="secondary">Create A New Id</Button> */}
        {/* we create new random id */}
      </Form>
      <Form onSubmit={handleRegister} className="w-100 shadow p-3 mb-5 bg-white rounded">
        <Form.Group >
          {error==="username already registered" && 
            <Alert variant='danger'>{error}</Alert>
          }
          <Form.Label>Username:</Form.Label>
          <Form.Control type="text" ref={username} required />
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" ref={password} required />
          <Form.Label>Name:</Form.Label>
          <Form.Control type="text" ref={firstName} required />
          <Form.Label>Email:</Form.Label>
          <Form.Control type="email" ref={email} required />
        </Form.Group>   
        <Button type="submit" className="mr-2">Sign up</Button>
        {/* <Button onClick={createNewId} variant="secondary">Create A New Id</Button> */}
        {/* we create new random id */}
      </Form>
    </Container>
  )
}