import React, { PureComponent } from 'react';

import './LoginScreen.scss';


export default class LoginScreen extends PureComponent {

    onLoginButtonPressed() {
        const FB = window.FB;
        FB.login(() => {
            FB.getLoginStatus((response) => {
                console.log(response);
            });
        });
    }

    render() {
        return (
            <div id="login-screen">
                <h1>Caro online</h1>

                {/* Facebook login button */}
                <button className="loginBtn loginBtn--facebook" onClick={() => this.onLoginButtonPressed()}>
                    Login with Facebook
                </button>
            </div>
        );
    }
}
