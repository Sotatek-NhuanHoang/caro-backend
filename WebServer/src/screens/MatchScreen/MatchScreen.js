import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { showConfirmAlert } from 'caro-service/AlertService';
import { showSpinner, hideSpinner } from 'caro-service/SpinnerService';
import { roomSelector, room_OUT_ROOM, competitorUserIdSelector } from 'caro-store/room';
import { match_READY_NEW_GAME, match_REMATCH, match_SUBSCRIBE } from 'caro-store/match';
import { score_SUBSCRIBE, score_UNSUBSCRIBE } from 'caro-store/score';
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

        if (this.props.competitorUserId) {
            this.props._subscribeScore();
        }

        this.props._subscribeMatch();
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
            creatorUserReadyNewGame,
            competitorUserReadyNewGame,
            competitorUserId,
            room,
            _playNewGame,
            _reMatch,
            _exitRoom,
        } = this.props;

        if (prevProps.room && !room) {
            history.push('/rooms');
            return;
        }

        if (!prevProps.competitorUserId && competitorUserId) {
            this.props._subscribeScore();
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

        if (!prevProps.creatorUserReadyNewGame && creatorUserReadyNewGame) {
            showSpinner();
        }

        if (prevProps.creatorUserReadyNewGame && !creatorUserReadyNewGame) {
            hideSpinner();
        }

        if (
            creatorUserReadyNewGame &&
            competitorUserReadyNewGame &&
            (!prevProps.creatorUserReadyNewGame || !prevProps.competitorUserReadyNewGame)
        ) {
            _reMatch();
            showInfo('Start new match');
        }
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.onBackButtonPressed);
        this.props._unsubscribeScore();
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
    competitorUserId: competitorUserIdSelector(room, user),
    room: roomSelector(room, room.currentRoomId),
    currentUser: user.currentUser,
    winnerId: match.winnerId,
    creatorUserReadyNewGame: match.creatorUserReadyNewGame,
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
    _subscribeScore: () => {
        dispatch(score_SUBSCRIBE());
    },
    _unsubscribeScore: () => {
        dispatch(score_UNSUBSCRIBE());
    },
    _subscribeMatch: () => {
        dispatch(match_SUBSCRIBE());
    },
    _unsubscribeMatch: () => {
        dispatch(score_UNSUBSCRIBE());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen);
