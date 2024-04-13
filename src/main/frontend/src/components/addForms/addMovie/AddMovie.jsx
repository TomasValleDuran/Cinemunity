import React, {useState} from 'react';
import {SaveButton, AddActorButton} from '../../shared/buttons/Buttons';
import './AddMovie.css';
import Header from '../../shared/header/Header';
import FormInput from '../../shared/form-input/FormInput';
import axios from "axios";
import withAuth from "../../hoc/withAuth";

const AddMovie = () => {

    const [showName, setShowName] = useState('');
    const [showDescription, setShowDescription] = useState('');
    const [showDirector, setShowDirector] = useState('');
    const [showType, setShowType] = useState('Movie'); // Default search type
    const [actorName, setActorName] = useState(''); // New state for actor input
    const [actorList, setActorList] = useState([]);
    const [seasons, setSeasons] = useState('');

    const handleSaveMovie = async () => {
        try {
            const response = await axios.post('http://localhost:3333/api/show/addShow', {
                title: showName,
                description: showDescription,
                director: showDirector,
                show_type: showType,
                actors: actorList,
                seasons: seasons
            },{
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("res")
            console.log(response.data)
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    }

    const handleSelect = (event) => {
        setShowType(event.target.value);
    };

    const handleAddActor = () => { // New function to add actor to list
        if (actorName === '') {
            console.log('Input is empty. Please enter an actor name.');
            return;
        }
        setActorList([...actorList, actorName]);
        setActorName('');
    };

    const handleRemoveActor = (indexToRemove) => {
        setActorList(actorList.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="home-container">
            <Header/>
            <h2>Add new Show:</h2>
            <div className="content-container">
                <div className="form-container">
                    <div className="form-group">
                        <select value={showType} onChange={handleSelect} className="form-control">
                            <option value="Movie">Movie</option>
                            <option value="TVShow">TV Show</option>
                        </select>
                        {showType === 'TVShow' && (
                            <FormInput
                                type="number"
                                value={seasons}
                                onChange={(e) => setSeasons(e.target.value)}
                                placeholder="Seasons"
                            />
                        )}
                    </div>
                    <FormInput type="text" value={showName} onChange={(e) => setShowName(e.target.value)} placeholder="Title"/>
                    <FormInput type="text" value={showDescription} onChange={(e) => setShowDescription(e.target.value)}
                               placeholder="Description"/>
                    <FormInput type="text" value={showDirector} onChange={(e) => setShowDirector(e.target.value)}
                               placeholder="Director"/>
                    <FormInput
                        type="text"
                        value={actorName}
                        onChange={(e) => setActorName(e.target.value)}
                        placeholder="Actor Name"
                        addon={<AddActorButton onClick={handleAddActor}>Add Actor</AddActorButton>}
                    />
                    <SaveButton onClick={handleSaveMovie} className="btn btn-save">Save</SaveButton>
                </div>
                <div className="actor-list-container">
                    <h3>Added Actors:</h3>
                    <ul className="actor-list">
                        {actorList.map((actor, index) => (
                            <li key={index}>
                                {actor}
                                <span className="delete-actor" onClick={() => handleRemoveActor(index)}>&times;</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );

};

const ProtectedAddMovie = withAuth(AddMovie);
export default ProtectedAddMovie;