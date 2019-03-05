import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';

import { otherUserSelector } from 'caro-store/user';

import './CompetitorUser.scss';


class CompetitorUser extends PureComponent {

    render() {
        const { user } = this.props;

        return (
            <div id="current-user">
                {user ? (
                    <Fragment>
                        <img className="user-avatar" alt="avatar" src={ user.avatar } />
                        <p className="user-name text-bold">{ user.username }</p>
                        
                        <div className="chip">
                            Wins: 12
                        </div>

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


const mapStateToProps = ({ user }, ownProps) => ({
    user: otherUserSelector(user, ownProps.userId),
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CompetitorUser);
