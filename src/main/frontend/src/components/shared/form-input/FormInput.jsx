import React from 'react';
import './FormInput.css';

const FormInput = ({ type, value, onChange, placeholder }) => {
    return (
        <div className="form-input">
            <input type={type} value={value} onChange={onChange} placeholder={placeholder} />
        </div>
    );
};

export default FormInput;