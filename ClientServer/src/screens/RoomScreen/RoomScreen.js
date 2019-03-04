import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import './RoomScreen.scss';


class RoomScreen extends PureComponent {

    render() {
        return (
            <div id="room-screen">
                room screenas dfasdf
            </div>
        );
    }
}


const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen);
