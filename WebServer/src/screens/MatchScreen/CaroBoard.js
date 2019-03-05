import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import Config from 'caro-config';
import CaroBoardSquare from './CaroBoardSquare';

import './CaroBoard.scss';


class CaroBoard extends PureComponent {

    render() {
        return (
            <div id="caro-board">
                {/* Render row */}
                {_.map(new Array(Config.CARO_BOARD_ROW), (row, rowIndex) => (
                    <div className="caro-board-row" key={ rowIndex }>
                        {/* Render column */}
                        {_.map(new Array(Config.CARO_BOARD_COLUMN), (col, columnIndex) => (
                            <CaroBoardSquare key={ columnIndex } row={ rowIndex } column={ columnIndex } />
                        ))}
                    </div>
                ))}
            </div>
        );
    }
}


const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(CaroBoard);
