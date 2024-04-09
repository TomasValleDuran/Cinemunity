import React from 'react';
import './FormInput.css';

const FormInput = ({ type, value, onChange, placeholder, addon }) => {
    return (
        <div className="form-input-group">
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="form-input"
            />
            {addon}
        </div>
    );
};

export default FormInput;