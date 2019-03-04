import React, { Component } from 'react';
import Router from './Router';

// Reset css
import 'normalize.css';

// Spectre css framework
import 'spectre.css/dist/spectre.min.css';
import 'spectre.css/dist/spectre-exp.min.css';
import 'spectre.css/dist/spectre-icons.min.css';

// Caro style
import 'caro-styles/index.scss';


class App extends Component {
    render() {
        return (
            <Router />
        );
    }
}


export default App;
