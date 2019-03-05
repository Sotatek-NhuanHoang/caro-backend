import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { otherUserSelector } from 'caro-store/user';


class CreatorName extends PureComponent {

    render() {
        const { user } = this.props;

        if (!user) {
            return null;
        }

        return (
            <span>
                { user.username }
            </span>
        );
    }
}


const mapStateToProps = ({ user }, ownProps) => ({
    user: otherUserSelector(user, ownProps.userId),
});


export default connect(mapStateToProps)(CreatorName);
