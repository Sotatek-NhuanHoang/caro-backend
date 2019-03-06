import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { BeatLoader } from 'react-spinners';

import { room_GET_ROOMS, sortedRoomIdsSelector, room_NEW_ROOM } from 'caro-store/room';
import RoomItem from './RoomItem';
import { showSpinner, hideSpinner } from 'caro-service/SpinnerService';

import './RoomScreen.scss';


class RoomScreen extends PureComponent {

    componentDidMount() {
        this.props._getRooms(true);
        document.addEventListener('scroll', this.trackScrolling);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.creatingRoom && this.props.creatingRoom) {
            showSpinner();
        }

        if (prevProps.creatingRoom && !this.props.creatingRoom) {
            hideSpinner();
        }

        if (!prevProps.currentRoomId && this.props.currentRoomId) {
            this.props.history.push('match');
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
    totalRooms: room.total,
    roomIds: sortedRoomIdsSelector(room, user),
    isGettingRooms: room.isGettingRooms,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen);
