import React, { PureComponent } from 'react';
import { HashRouter, Route } from 'react-router-dom';

// Screens
import LoginScreen from 'caro-screens/LoginScreen/LoginScreen';
import RoomsScreen from 'caro-screens/RoomScreen/RoomScreen';
import MatchScreen from 'caro-screens/MatchScreen/MatchScreen';

export default class Router extends PureComponent {
    render() {
        return (
            <HashRouter>
                <div id="router">
                    <Route path="/" exact component={ LoginScreen } />
                    <Route path="/rooms" exact component={ RoomsScreen } />
                    <Route path="/match" exact component={ MatchScreen } />
                </div>
            </HashRouter>
        );
    }
}
