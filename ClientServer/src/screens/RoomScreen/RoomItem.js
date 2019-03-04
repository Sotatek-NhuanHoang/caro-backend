import React, { PureComponent } from 'react';
import { connect } from 'react-redux';


class RoomItem extends PureComponent {

    render() {
        return (
            <tr className="room-item">
                <td>Nhuan</td>
                <td class="text-right">1/2</td>
            </tr>
        );
    }
}


const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomItem);
