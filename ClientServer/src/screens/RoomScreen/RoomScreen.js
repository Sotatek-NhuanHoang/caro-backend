import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import RoomItem from './RoomItem';

import './RoomScreen.scss';


class RoomScreen extends PureComponent {

    render() {
        return (
            <div id="room-screen">
                <div className="container grid-sm">
                    <div className="room-status-container">
                        {/* New room button */}
                        <button className="add-button">New room</button>

                        {/* Total room status */}
                        <span>Total room: 123</span>
                    </div>

                    {/* List rooms */}
                    <table className="table table-hover">
                        <tbody>
                            {_.map(new Array(100), () => (
                                <RoomItem />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}


const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomScreen);
