import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import CreatorName from './CreatorName';
import { roomSelector } from 'caro-store/room';

class RoomItem extends PureComponent {

    render() {
        const { room } = this.props;

        if (!room) {
            return null;
        }

        return (
            <tr className="room-item">
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
 
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomItem);
