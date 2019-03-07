import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { BeatLoader } from 'react-spinners';

import ServerError from 'caro-shared-resource/ServerError';
import { room_GET_ROOMS, sortedRoomIdsSelector, room_NEW_ROOM } from 'caro-store/room';
import { user_LOGOUT, user_SOCKET_AUTHENTICATE } from 'caro-store/user';
import RoomItem from './RoomItem';
import { showSpinner, hideSpinner } from 'caro-service/SpinnerService';

import './RoomScreen.scss';


class RoomScreen extends PureComponent {

    componentWillMount() {
        if (!this.props.token) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        document.title = 'Room';
        document.addEventListener('scroll', this.trackScrolling);

        if (!this.props.isSocketAuthenticated) {
            this.props._socketAuthenticate();
        } else {
            this.props._getRooms(true);
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isSocketAuthenticated && this.props.isSocketAuthenticated) {
            this.props._getRooms(true);
        }

        if (!prevProps.isSocketAuthenticating && this.props.isSocketAuthenticating) {
            showSpinner();
        }

        if (prevProps.isSocketAuthenticating && !this.props.isSocketAuthenticating) {
            hideSpinner();
            if (!this.props.isSocketAuthenticated) {
                this.props._logout();
                this.props.history.push('/');
            }
        }

        if (!prevProps.creatingRoom && this.props.creatingRoom) {
            showSpinner();
        }

        if (prevProps.creatingRoom && !this.props.creatingRoom) {
            hideSpinner();
        }

        if (!prevProps.currentRoomId && this.props.currentRoomId) {
            this.props.history.push('/match');
        }

        if (!prevProps.getRoomsError && this.props.getRoomsError) {
            if (this.props.getRoomsError === ServerError.UNAUTHENTICATED) {
                this.props._logout();
                this.props.history.push('/');
                return;
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    trackScrolling = () => {
        const wrappedElement = document.getElementById('room-screen-container');

        if (this.isBottom(wrappedElement)) {
            this.props._getRooms();
        }
    };

    onNewRoomButtonClicked = () => {
        this.props._createRoom();
    }

    onLogoutButtonClicked = () => {
        this.props._logout();
        this.props.history.push('/');
    }


    render() {
        const { roomIds, isGettingRooms } = this.props;

        return (
            <div id="room-screen">
                <div id="room-screen-container" className="container grid-sm">
                    <div className="room-status-container">
                        {/* New room button */}
                        <button className="add-button" onClick={ this.onNewRoomButtonClicked }>New room</button>

                        {/* Total room status */}
                        {/* <span>Total rooms: { totalRooms }</span> */}

                        {/* Logout button */}
                        <button className="btn btn-link" onClick={ this.onLogoutButtonClicked }>Logout</button>
                    </div>

                    {/* List rooms */}
                    <table className="table table-hover">
                        <tbody>
                            {_.map(roomIds, (roomId) => (
                                <RoomItem key={ roomId } roomId={ roomId } />
                            ))}
                        </tbody>
                    </table>

                    <div className="spinner">
                        <BeatLoader size={ 8 } color="#95a5a6" loading={ isGettingRooms } />
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({ room, user }) => ({
    token: _.get(user, ['currentUser', 'token']),
    isSocketAuthenticated: user.isSocketAuthenticated,
    isSocketAuthenticating: user.isSocketAuthenticating,

    totalRooms: room.total,
    roomIds: sortedRoomIdsSelector(room, user),

    isGettingRooms: room.isGettingRooms,
    getRoomsError: room.getRoomsError,

    creatingRoom: room.creatingRoom,


    currentRoomId: room.currentRoomId,
});

const mapDispatchToProps = (dispatch) => ({
    _getRooms: (shouldRefresh) => {
        return dispatch(room_GET_ROOMS(shouldRefresh));
    },
    _createRoom: () => {
        return dispatch(room_NEW_ROOM());
    },
    _socketAuthenticate: () => {
        return dispatch(user_SOCKET_AUTHENTICATE());
    },
    _logout: () => {
        return dispatch(user_LOGOUT());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen);
