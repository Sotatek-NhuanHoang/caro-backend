import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { scoreSelector } from 'caro-store/score';


class UserScore extends PureComponent {

    render() {
        const { score } = this.props;

        return (
            <div className="chip">
                Wins: { score }
            </div>
        );
    }
}


const mapStateToProps = ({ score }, ownProps) => ({
    score: scoreSelector(score, ownProps.userId, ownProps.competitorUserId),
});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(UserScore);
