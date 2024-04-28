import './App.css';
import React from 'react';
import {Routes, Route } from 'react-router-dom'
import {ProtectedRoute} from "./components/hoc/ProtectedRoute";
import SignIn from "./components/auth/signIn/SignIn";
import SignUp from "./components/auth/signUp/SignUp";
import Home from "./components/home/Home";
import User from "./components/User/User";
import AddMovie from "./components/addForms/addMovie/AddMovie";
import AddCelebrity from "./components/addForms/addCelebrity/AddCelebrity";
import Show from "./components/Show/Show";
import Celebrity from "./components/Celebrity/Celebrity";
import NotAdmin from "./components/errors/notAdmin/notAdmin";
import SearchBar from "./components/shared/header/search-bar/SearchBar";

function App() {
    return (
        <div className="App">
                <Routes>
                    <Route path="/test" element={<SearchBar/>}/>

                    <Route path="/" element={<SignIn/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/user/:username" element={<User/>}/>

                    <Route path="/addShow" element={
                        <ProtectedRoute>
                            <AddMovie/>
                        </ProtectedRoute>
                    }/>

                    <Route path="/addCelebrity" element={
                        <ProtectedRoute>
                            <AddCelebrity/>
                        </ProtectedRoute>
                    }/>

                    <Route path="/show/:title" element={<Show/>}/>
                    <Route path="/celebrity/:celebrityName" element={<Celebrity/>}/>

                    <Route path="/error" element={<NotAdmin/>}/>
                </Routes>
        </div>
    );
}

export default App;