import React from 'react';
import ReactDOM from 'react-dom';
import { PacmanLoader } from 'react-spinners';

const spinnerId = 'caro-spinner';


export const showSpinner = () => {
    if (document.getElementById(spinnerId)) {
        return;
    }

    const overlayElement = document.createElement('div');
    overlayElement.id = spinnerId;
    document.body.appendChild(overlayElement);

    ReactDOM.render(
        <div className="caro-spinner-container">
            <PacmanLoader color="#95a5a6" size={ 25 } />
        </div>,
        document.getElementById(spinnerId)
    );
};


export const hideSpinner = () => {
    document.getElementById(spinnerId).remove();
};
