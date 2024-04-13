import React from 'react';
import './Buttons.css';

// Botón genérico
export const Button = ({ className, children, onClick, ...props }) => {
    return (
        <button className={`button ${className}`} onClick={onClick} {...props}>
            {children}
        </button>
    );
};

// Botón para guardar
export const SaveButton = ({ children, onClick, ...props }) => {
    return (
        <Button className="button-save" onClick={onClick} {...props}>
            {children}
        </Button>
    );
};

// Botón para agregar actor
export const AddActorButton = ({ children, onClick, ...props }) => {
    return (
        <Button className="btn-addActor" onClick={onClick} {...props}>
            {children}
        </Button>
    );
};

export const SearchButton = ({ children, onClick, ...props }) => {
    return (
        <Button className="btn-search" onClick={onClick} {...props}>
            {children}
        </Button>
    );
};

export const ProfileNameButton = ({ children, onClick, ...props }) => {
    return (
        <Button className="btn-profileName" onClick={onClick} {...props}>
            {children}
        </Button>
    );
};

export const LogoutButton = ({ children, onClick, ...props }) => {
    return (
        <Button className="btn-logout" onClick={onClick} {...props}>
            {children}
        </Button>
    );
};