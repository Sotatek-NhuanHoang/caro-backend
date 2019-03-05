import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import CaroBoard from './CaroBoard';
import CurrentUser from './CurrentUser';

import './MatchScreen.scss';


class MatchScreen extends PureComponent {

    render() {
        return (
            <div id="match-screen">
                <CaroBoard />

                {/* Users info */}
                <div className="user-container">
                    <CurrentUser />
                    <CurrentUser />

                    {/* Exit room button */}
                    <button className="exit-button">
                        <i className="fas fa-sign-out-alt fa-lg text-dark"></i>
                    </button>
                </div>
            </div>
        );
    }
}


const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen);
