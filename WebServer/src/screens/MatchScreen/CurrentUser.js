import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import UserScore from './UserScore';
import './CurrentUser.scss';


class CurrentUser extends PureComponent {

    render() {
        const { currentUser, competitorUserId, isCurentUserTurn } = this.props;

        return (
            <div id="current-user">
                <img className="user-avatar" alt="avatar" src={ currentUser.avatar } />
                <p className="user-name text-bold">
                    { currentUser.username }

                    {/* Current turn status */}
                    {isCurentUserTurn ? (
                        <i className="fas fa-user-clock user-current-turn-icon"></i>
                    ) : null}
                </p>
                
                <UserScore userId={ currentUser.id } competitorUserId={ competitorUserId } />

                {/* Toolbox */}
                <div className="tool-box">
                    
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({ user, match }) => ({
    currentUser: user.currentUser,
    isCurentUserTurn: match.isCurentUserTurn,
});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUser);
