import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';

import { SquareType } from 'caro-config';
import { squareSelector, winningSquareSelector, match_STROKE } from 'caro-store/match';
import oImage from 'caro-assets/images/o.png';
import xImage from 'caro-assets/images/x.png';

import './CaroBoardSquare.scss';


class CaroBoardSquare extends PureComponent {

    stroke = () => {
        const { row, column } = this.props;
        this.props._stroke(row, column);
    }

    renderXO = () => {
        const { squareType } = this.props;

        if (!squareType) {
            return null;
        }

        return (
            <Fragment>
                {squareType === SquareType.O ? (
                    <img className="caro-board-image" alt="o" src={ oImage } />
                ) : (
                    <img className="caro-board-image" alt="x" src={ xImage } />
                )}
            </Fragment>
        );
    }

    renderWinningOverlay() {
        const { isWinningSquare } = this.props;

        if (!isWinningSquare) {
            return;
        }

        return (
            <div className="caro-board-square-winning"></div>
        );
    }

    render() {
        return (
            <div id="caro-board-square" onClick={ this.stroke }>
                { this.renderXO() }
                { this.renderWinningOverlay() }
            </div>
        );
    }
}


const mapStateToProps = ({ match }, ownProps) => ({
    squareType: squareSelector(match, ownProps.row, ownProps.column),
    isWinningSquare: winningSquareSelector(match, ownProps.row, ownProps.column),
});

const mapDispatchToProps = (dispatch) => ({
    _stroke: (row, column) => {
        return dispatch(match_STROKE(row, column));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CaroBoardSquare);
