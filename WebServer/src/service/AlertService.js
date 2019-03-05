import Noty from 'noty';


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
