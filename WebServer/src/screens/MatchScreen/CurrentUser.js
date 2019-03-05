import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import './CurrentUser.scss';


class CurrentUser extends PureComponent {

    render() {
        const { currentUser } = this.props;

        return (
            <div id="current-user">
                <img className="user-avatar" alt="avatar" src={ currentUser.avatar } />
                <p className="user-name text-bold">{ currentUser.username }</p>
                
                <div className="chip">
                    Wins: 12
                </div>

                {/* Toolbox */}
                <div className="tool-box">
                    
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({ user }) => ({
    currentUser: user.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUser);
