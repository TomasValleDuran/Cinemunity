  import './App.css';
  import React, { useState } from 'react';


function App() {

    const [user,setUser] = useState('');

    const [password,setPassword] = useState('');

    const [email,setEmail] = useState('');

    const handleChange = (event) => {
        setUser(event.target.value);
    };

    const handleChange1 = (event) => {
        setPassword(event.target.value);
    };

    const handleChange2 = (event) => {
        setEmail(event.target.value);
    };

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
            <input type="text" value={user} onChange={handleChange} />
          </form>
          <form>
              <label>
                  password
              </label>
          </form>
          <form>
              <input type="text" value={password} onChange={handleChange1} />
          </form>
          <form>
              <label>
                  Email
              </label>
          </form>
          <form>
              <input type="text" value={email} onChange={handleChange2} />
          </form>
      </header>
    </div>
  );
}

export default App;
