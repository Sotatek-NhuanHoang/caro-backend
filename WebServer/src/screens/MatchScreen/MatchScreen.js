import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { showConfirmAlert } from 'caro-service/AlertService';
import { showSpinner, hideSpinner } from 'caro-service/SpinnerService';
import { roomSelector, room_OUT_ROOM } from 'caro-store/room';
import { match_READY_NEW_GAME, match_REMATCH } from 'caro-store/match';
import { showInfo } from 'caro-service/AlertService';
import CaroBoard from './CaroBoard';
import CompetitorUser from './CompetitorUser';
import CurrentUser from './CurrentUser';

import './MatchScreen.scss';


class MatchScreen extends PureComponent {

    componentWillMount() {
        if (!this.props.currentRoomId) {
            this.props.history.push('/rooms');
        }
    }

    componentDidMount() {
        document.title = 'Playing';
        window.addEventListener('popstate', this.onBackButtonPressed);
    }

    componentDidUpdate(prevProps) {
        const {
            history,
            winnerId,
            currentUser,
            currentUserReadyNewGame,
            competitorUserReadyNewGame,
            room,
            _playNewGame,
            _reMatch,
            _exitRoom,
        } = this.props;

        if (prevProps.room && !room) {
            history.push('/rooms');
            return;
        }

        if (!prevProps.winnerId && winnerId) {
            const didCurrentUserWin = (winnerId === currentUser.id);
            const title = didCurrentUserWin ? 'You win' : 'You lose';

            showConfirmAlert({
                title: title,
                message: 'Play new game?',
                cancelText: 'Exit room',
                onConfirm: () => {
                    _playNewGame();
                },
                onCancel: () => {
                    _exitRoom();
                }, // Out room
            });
        }

        if (!prevProps.currentUserReadyNewGame && currentUserReadyNewGame) {
            showSpinner();
        }

        if (prevProps.currentUserReadyNewGame && !currentUserReadyNewGame) {
            hideSpinner();
        }

        if (
            currentUserReadyNewGame &&
            competitorUserReadyNewGame &&
            (!prevProps.currentUserReadyNewGame || !prevProps.competitorUserReadyNewGame)
        ) {
            _reMatch();
            showInfo('Start new match');
        }
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.onBackButtonPressed);
    }

    onBackButtonPressed = () => {
        this.props._exitRoom();
    }
    
    onExitRoomButtonClicked = () => {
        this.props._exitRoom();
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
                    <CompetitorUser userId={ currentUser.id } competitorUserId={ competitorUserId } />
                    <CurrentUser competitorUserId={ competitorUserId } />

                    {/* Exit room button */}
                    <button className="exit-button" onClick={ this.onExitRoomButtonClicked }>
                        <i className="fas fa-sign-out-alt fa-lg text-dark"></i>
                    </button>
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({ room, user, match }) => ({
    currentRoomId: room.currentRoomId,
    room: roomSelector(room, room.currentRoomId),
    currentUser: user.currentUser,
    winnerId: match.winnerId,
    currentUserReadyNewGame: match.currentUserReadyNewGame,
    competitorUserReadyNewGame: match.competitorUserReadyNewGame,
});

const mapDispatchToProps = (dispatch) => ({
    _playNewGame: () => {
        return dispatch(match_READY_NEW_GAME());
    },
    _reMatch: () => {
        return dispatch(match_REMATCH());
    },
    _exitRoom: () => {
        return dispatch(room_OUT_ROOM());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen);
