import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { roomSelector } from 'caro-store/room';
import CaroBoard from './CaroBoard';
import CompetitorUser from './CompetitorUser';
import CurrentUser from './CurrentUser';

import './MatchScreen.scss';


class MatchScreen extends PureComponent {

    render() {
        const { room, currentUser } = this.props;

        if (!room) {
            return null;
        }

        const competitorUserId = room.creatorUserId === currentUser.id ? room.competitorUserId : room.creatorUserId;


        return (
            <div id="match-screen">
                <CaroBoard />

                {/* Users info */}
                <div className="user-container">
                    <CompetitorUser userId={ competitorUserId } />
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


const mapStateToProps = ({ room, user }) => ({
    room: roomSelector(room, room.currentRoomId),
    currentUser: user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen);
