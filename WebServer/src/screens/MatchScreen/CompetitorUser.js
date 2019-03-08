import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';

import { otherUserSelector } from 'caro-store/user';
import { showInfo } from 'caro-service/AlertService';
import UserScore from './UserScore';

import './CompetitorUser.scss';


class CompetitorUser extends PureComponent {

    componentDidUpdate(prevProps) {
        if (!prevProps.competitorUser && this.props.competitorUser) {
            showInfo(`${this.props.competitorUser.username} has joined the room`);
        }

        if (prevProps.competitorUser && !this.props.competitorUser) {
            showInfo(`${prevProps.competitorUser.username} has lefted the room`);
        }
    }

    render() {
        const { competitorUser, userId, isCurentUserTurn } = this.props;

        return (
            <div id="current-user">
                {competitorUser ? (
                    <Fragment>
                        <img className="user-avatar" alt="avatar" src={ competitorUser.avatar } />
                        <p className="user-name text-bold">
                            { competitorUser.username }

                            {/* Competitor turn status */}
                            {!isCurentUserTurn ? (
                                <i className="fas fa-user-clock user-current-turn-icon"></i>
                            ) : null}
                        </p>
                        
                        <UserScore userId={ competitorUser.id } competitorUserId={ userId } />

                        {/* Toolbox */}
                        <div className="tool-box">
                            
                        </div>
                    </Fragment>
                ) : (
                    <p>Waiting user...</p>
                )}
            </div>
        );
    }
}


const mapStateToProps = ({ user, match }, ownProps) => ({
    competitorUser: otherUserSelector(user, ownProps.competitorUserId),
    isCurentUserTurn: match.isCurentUserTurn,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CompetitorUser);
