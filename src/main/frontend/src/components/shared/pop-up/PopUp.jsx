import React from 'react';

const PopUp = ({ onConfirm, onCancel }) => {
    return (
        <div className="popup-container">
            <div className="popup-content">
                <h2>¿Estás seguro de que quieres borrar esta review?</h2>
                <button onClick={onConfirm}>Sí</button>
                <button onClick={onCancel}>No</button>
            </div>
        </div>
    );
};

export default PopUp;