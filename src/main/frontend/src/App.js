import './App.css';
import React from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom'; // Importa BrowserRouter como Router
import SignIn from "./components/auth/signIn/SignIn";
import SignUp from "./components/auth/signUp/SignUp";
import Home from "./components/home/Home";
import User from "./components/User/User";
import AddMovie from "./components/addForms/addMovie/AddMovie";
import AddCelebrity from "./components/addForms/addCelebrity/AddCelebrity";

function App() {
    const navigate = useNavigate();
    return (
        <Routes>
            <Route path="/" element={<SignIn/>}/>
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path="/user/:username" element={<User/>}/>
            <Route path="/addMovie" element={<AddMovie/>}/>
            <Route path="/addCelebrity" element={<AddCelebrity/>}/>
        </Routes>
    )
}

export default App;