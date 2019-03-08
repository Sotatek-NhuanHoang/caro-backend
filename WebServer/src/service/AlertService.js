import Noty from 'noty';
import { confirmAlert } from 'react-confirm-alert';


const alertOptions = {
    theme: 'sunset',
    timeout: 1000,
    layout: 'bottomCenter',
    progressBar: false,
};

export const showError = (msg) => {
    new Noty({
        type: 'alert',
        text: msg,
        ...alertOptions
    }).show();
};

export const showInfo = (msg) => {
    new Noty({
        type: 'info',
        text: msg,
        ...alertOptions
    }).show();
};

export const showConfirmAlert = ({ title, message, confirmText = 'Yes', onConfirm, cancelText = 'No', onCancel}) => {
    confirmAlert({
        title: title,
        message: message,
        buttons: [
            {
                label: confirmText,
                onClick: onConfirm
            },
            {
                label: cancelText,
                onClick: onCancel
            }
        ],
    });
};
