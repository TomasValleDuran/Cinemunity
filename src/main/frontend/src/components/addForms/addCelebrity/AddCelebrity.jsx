import React, {useState} from 'react';
import './AddCelebrity.css';
import Header from '../../shared/header/Header';
import {FormInput, SendFormButton} from '../../shared/form-input/FormInput';
import axios from "axios";
import withAuth from "../../hoc/withAuth";

const AddCelebrity = () => {

    const [celebrityName, setCelebrityName] = useState('');
    const [celebrityBio, setCelebrityBio] = useState('');

    const [errorMessage, setErrorMessage] = useState("");

    const handleSaveCelebrity = async (event) => {
        event.preventDefault(); // Prevent the form from refreshing the page
        try {
            const response = await axios.post('http://localhost:3333/api/celebrity/addCelebrity', {
                name: celebrityName,
                biography: celebrityBio,
            },{
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            console.log("res")
            console.log(response.data)
            setCelebrityName('');
            setCelebrityBio('');
            setErrorMessage('');
        }
        catch (error) {
            console.error(error.response.data, error);
            setErrorMessage(error.response.data);
        }
    }

    return (
        <div>
            <Header/>
            <h2 className="add-celebrity-title">Add Celebrity</h2>
            <div className="form-container">
                <FormInput type="text" value={celebrityName} onChange={(e) => setCelebrityName(e.target.value)}
                           placeholder="Name"/>
                <FormInput type="text" value={celebrityBio} onChange={(e) => setCelebrityBio(e.target.value)}
                           placeholder="Biography"/>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <SendFormButton onClick={handleSaveCelebrity}>Save</SendFormButton>
            </div>
        </div>
    );
};

const ProtectedAddCelebrity = withAuth(AddCelebrity);
export default ProtectedAddCelebrity;