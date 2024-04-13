import React, {useState} from 'react';
import {SaveButton} from '../../shared/buttons/Buttons';
import './AddCelebrity.css';
import Header from '../../shared/header/Header';
import FormInput from '../../shared/form-input/FormInput';
import axios from "axios";
import withAuth from "../../hoc/withAuth";

const AddCelebrity = () => {

    const [celebrityName, setCelebrityName] = useState('');
    const [celebrityBio, setCelebrityBio] = useState('');

    const handleSaveCelebrity = async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page
        try {
            const response = await axios.post('http://localhost:3333/api/celebrity/addCelebrity', {
                name: celebrityName,
                biography: celebrityBio,
            }, {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("res")
            console.log(response.data)
            setCelebrityName('');
            setCelebrityBio('');
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    }

    return (
        <div>
            <Header/>
            <h1 className="add-celebrity-title">Add Celebrity</h1>
            <form onSubmit={handleSaveCelebrity} className={"add-celebrity-container"}>
                <FormInput type="text" value={celebrityName} onChange={(e) => setCelebrityName(e.target.value)}
                           placeholder="Name"/>
                <FormInput type="text" value={celebrityBio} onChange={(e) => setCelebrityBio(e.target.value)}
                           placeholder="Biography"/>
                <SaveButton type="submit" className="btn btn-save">Save</SaveButton>
            </form>
        </div>
    );
};

const ProtectedAddCelebrity = withAuth(AddCelebrity);
export default ProtectedAddCelebrity;