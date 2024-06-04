import React from 'react';
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import MentionSearch from "./MentionSearch";

const Mention = (props) => {
    const { isSearching, setIsSearching } = props;
    const handleSelectedResult = (result) => {
        console.log(result);
        props.onResultSelect(result);
    };

    return (
        <div className={"mention-container"}>
            <Dialog open={isSearching} onClose={() => setIsSearching(false)}>
                <div>
                    <DialogTitle>Search</DialogTitle>
                    <DialogContent>
                        <MentionSearch onResultSelect={handleSelectedResult} />
                    </DialogContent>
                </div>
            </Dialog>
        </div>
    );
};

export default Mention;