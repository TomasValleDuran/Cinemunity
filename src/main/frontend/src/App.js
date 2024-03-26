  import './App.css';
  import React, { useState } from 'react';
  import axios from 'axios'


   function App() {

      const [user, setUser] = useState('');

      const [password, setPassword] = useState('');

      const [email, setEmail] = useState('');

      const handleChange = (event) => {
          setUser(event.target.value);
      };

      const handleChange1 = (event) => {
          setPassword(event.target.value);
      };

      const handleChange2 = (event) => {
          setEmail(event.target.value);
      };

      async function send() {
          try {
              const response = await axios.post('/signup.do', {
                  email: email,
                  username: user,
                  password: password
              });
              console.log(response);
          } catch (error) {
              console.log(error);
          }
      }

      return (
          <div className="App">
              <header className="App-header">
                  <p>
                      Welcome to cinemunity
                  </p>
                  <form>
                      <label>
                          Username
                      </label>
                  </form>
                  <form>
                      <input type="text" value={user} onChange={handleChange}/>
                  </form>
                  <form>
                      <label>
                          password
                      </label>
                  </form>
                  <form>
                      <input type="text" value={password} onChange={handleChange1}/>
                  </form>
                  <form>
                      <label>
                          Email
                      </label>
                  </form>
                  <form>
                      <input type="text" value={email} onChange={handleChange2}/>
                  </form>
                  <button onClick={send}>send</button>
              </header>
          </div>
      );
  }

export default App;
