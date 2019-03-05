import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { BeatLoader } from 'react-spinners';

import { room_GET_ROOMS, sortedRoomIdsSelector } from 'caro-store/room';
import RoomItem from './RoomItem';

import './RoomScreen.scss';


class RoomScreen extends PureComponent {

    componentDidMount() {
        this.props._getRooms(true);
        document.addEventListener('scroll', this.trackScrolling);
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


    render() {
        const { roomIds, isGettingRooms } = this.props;

        return (
            <div id="room-screen">
                <div id="room-screen-container" className="container grid-sm">
                    <div className="room-status-container">
                        {/* New room button */}
                        <button className="add-button">New room</button>

                        {/* Total room status */}
                        <span>Total rooms: 123</span>
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


const mapStateToProps = ({ room }) => ({
    roomIds: sortedRoomIdsSelector(room),
    isGettingRooms: room.isGettingRooms,
});

const mapDispatchToProps = (dispatch) => ({
    _getRooms: (shouldRefresh) => {
        return dispatch(room_GET_ROOMS(shouldRefresh));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen);
