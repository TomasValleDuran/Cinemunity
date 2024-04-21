import React from 'react';
import './FormInput.css';

export const FormInput = ({ type, value, onChange, placeholder, addon }) => {
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

export const SendFormButton = ({ children, onClick, ...props }) => {
    return (
        <button className="btn-send-form" onClick={onClick} {...props}>
            {children}
        </button>
    );
};
