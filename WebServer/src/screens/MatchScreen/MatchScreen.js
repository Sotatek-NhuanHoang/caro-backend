import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { showConfirmAlert } from 'caro-service/AlertService';
import { roomSelector } from 'caro-store/room';
import CaroBoard from './CaroBoard';
import CompetitorUser from './CompetitorUser';
import CurrentUser from './CurrentUser';

import './MatchScreen.scss';


class MatchScreen extends PureComponent {

    componentWillMount() {
        if (!this.props.room) {
            this.props.history.push('/rooms');
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.winnerId && this.props.winnerId) {
            const didCurrentUserWin = (this.props.winnerId === this.props.currentUser.id);
            const title = didCurrentUserWin ? 'You win' : 'You lose';

            showConfirmAlert({
                title: title,
                message: 'Play new game?',
                cancelText: 'Exit room',
                onConfirm: () => {},
                onCancel: () => {},
            });
        }
    }


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


const mapStateToProps = ({ room, user, match }) => ({
    room: roomSelector(room, room.currentRoomId),
    currentUser: user.currentUser,
    winnerId: match.winnerId,
});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen);
