import './App.css';
import React from 'react';
import {Route, Routes} from 'react-router-dom'; // Importa BrowserRouter como Router
import SignIn from "./components/auth/signIn/SignIn";
import SignUp from "./components/auth/signUp/SignUp";
import Home from "./components/home/Home";
import User from "./components/User/User";
import AddMovie from "./components/addForms/addMovie/AddMovie";
import AddCelebrity from "./components/addForms/addCelebrity/AddCelebrity";
import Show from "./components/Show/Show";

function App() {
    return (
        <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/user/:username" element={<User/>}/>
            <Route path="/addMovie" element={<AddMovie/>}/>
            <Route path="/addCelebrity" element={<AddCelebrity/>}/>
            <Route path="/show/:title" element={<Show/>}/>
        </Routes>
    )
}

export default App;