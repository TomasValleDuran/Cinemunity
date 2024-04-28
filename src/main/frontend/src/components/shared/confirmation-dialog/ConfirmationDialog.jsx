import React from 'react';
import {Button, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

function ConfirmationDialog({ open, onClose, onConfirm, information }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirm {information} Deletion</DialogTitle>
            <DialogContent>
                Are you sure you want to delete your {information}? There is no recovery option.
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={onConfirm} color="primary">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmationDialog;
