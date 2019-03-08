import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { user_LOGIN } from 'caro-store/user';
import { showSpinner, hideSpinner } from 'caro-service/SpinnerService';
import { showError } from 'caro-service/AlertService';

import './LoginScreen.scss';


class LoginScreen extends PureComponent {

    componentWillMount() {
        if (this.props.token) {
            this.props.history.push('/rooms');
        }
    }

    componentDidMount() {
        document.title = 'Caro online';
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isLogging && this.props.isLogging) {
            showSpinner();
        }

        if (prevProps.isLogging && !this.props.isLogging) {
            hideSpinner();
        }

        if (!prevProps.loginError && this.props.loginError) {
            showError('Can not connect to server');
        }

        if (this.props.token) {
            this.props.history.push('/rooms');
        }
    }

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
                <h1 className="title">Caro online</h1>
                <h6>The world leader strategy game</h6>

                {/* Facebook login button */}
                <button className="loginBtn loginBtn--facebook" onClick={() => this.onLoginButtonPressed()}>
                    Login with Facebook
                </button>
            </div>
        );
    }
}


const mapStateToProps = ({ user }) => ({
    token: _.get(user, ['currentUser', 'token']),
    isLogging: user.isLogging,
    loginError: user.loginError,
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
