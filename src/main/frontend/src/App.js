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
import ModifyUser from "./components/modify-forms/modify-user-info/ModifyUser";
import ModifyPassword from "./components/modify-forms/modify-user-password/ModifyPassword";
import Wishlist from "./components/Wishlist/Wishlist";

function App() {
    return (
        <div className="App">
                <Routes>
                    <Route path="/test" element={<SearchBar/>}/>

                    <Route path="/" element={<SignIn/>}/>
                    <Route path="/signin" element={<SignIn/>}/>
                    <Route path="/signup" element={<SignUp/>}/>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/user/:userId" element={<User/>}/>
                    <Route path="/user/modifyUser" element={<ModifyUser/>}/>
                    <Route path="/user/modifyPassword" element={<ModifyPassword/>}/>
                    <Route path="/user/:username/wishlist" element={<Wishlist/>}/>

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

                    <Route path="/show/:showId" element={<Show/>}/>
                    <Route path="/celebrity/:celebrityId" element={<Celebrity/>}/>

                    <Route path="/error" element={<NotAdmin/>}/>
                </Routes>
        </div>
    );
}

export default App;