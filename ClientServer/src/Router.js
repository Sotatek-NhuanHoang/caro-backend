import React, { PureComponent } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

// Screens
import LoginScreen from 'caro-screens/LoginScreen/LoginScreen';


export default class Router extends PureComponent {
    render() {
        return (
            <BrowserRouter>
                <div id="router">
                    <Route path="/" exact component={ LoginScreen } />
                </div>
            </BrowserRouter>
        );
    }
}
