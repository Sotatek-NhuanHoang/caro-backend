import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { user_LOGIN } from 'caro-store/user';

import './LoginScreen.scss';


class LoginScreen extends PureComponent {

    onLoginButtonPressed() {
        const FB = window.FB;
        FB.login(() => {
            FB.getLoginStatus((response) => {
                if (response.status !== 'connected') {
                    return;
                }

                const { authResponse } = response;
                const { accessToken, userID: facebookId } = authResponse;

                this.props._login(accessToken, facebookId);
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


const mapStateToProps = ({ user }) => ({

});

const mapDispatchToProps = (dispatch) => ({
    _login: (accessToken, facebookId) => {
        return dispatch(user_LOGIN({
            accessToken: accessToken,
            facebookId: facebookId,
        }));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
