// ConfirmationDialog.js
import React from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './ConfirmationDialog.css';

function ConfirmationDialog({ open, onClose, onConfirm, information, isAdmin }) {
    return (
        <Dialog open={open} onClose={onClose} className="dialog">
            <DialogTitle className="dialog-title">Confirm {information} Deletion</DialogTitle>
            <DialogContent className="dialog-content">
                Are you sure you want to delete your {information}? There is no recovery option.
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button onClick={onClose} color="primary" className="dialog-button">
                    Cancel
                </Button>
                <Button variant="contained" onClick={onConfirm} color="primary" className="redButton"
                        disabled={isAdmin && information==="Account"}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
