import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import CreatorName from './CreatorName';
import { roomSelector, room_JOIN_ROOM } from 'caro-store/room';

class RoomItem extends PureComponent {

    onRoomItemClicked = () => {
        const { room } = this.props;

        if (!room) {
            return null;
        }

        this.props._joinRoom(room.id);
    }

    render() {
        const { room } = this.props;

        if (!room) {
            return null;
        }

        return (
            <tr className="room-item" onClick={ this.onRoomItemClicked }>
                <td>
                    <CreatorName userId={ room.creatorUserId } />
                </td>
                <td className="text-right">1/2</td>
            </tr>
        );
    }
}


const mapStateToProps = ({ room }, ownProps) => ({
    room: roomSelector(room, ownProps.roomId),
});

const mapDispatchToProps = (dispatch) => ({
    _joinRoom: (roomId) => {
        return dispatch(room_JOIN_ROOM(roomId));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomItem);
