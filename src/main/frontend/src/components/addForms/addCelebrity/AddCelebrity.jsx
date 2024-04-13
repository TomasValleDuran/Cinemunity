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

    const handleSaveCelebrity = async () => {
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
        }
        catch (error) {
            console.error('Error al enviar solicitud:', error);
        }
    }

    return (
        <div>
            <div className="home-container">
                <Header/>
                <p>Aquí agregas celebridades:</p>
                <FormInput type="text" value={celebrityName} onChange={(e) => setCelebrityName(e.target.value)}
                           placeholder="Name"/>
                <FormInput type="text" value={celebrityBio} onChange={(e) => setCelebrityBio(e.target.value)}
                           placeholder="Biography"/>
            </div>
            <SaveButton onClick={handleSaveCelebrity} className="btn btn-save">Save</SaveButton>
        </div>
    );
};

const ProtectedAddCelebrity = withAuth(AddCelebrity);
export default ProtectedAddCelebrity;