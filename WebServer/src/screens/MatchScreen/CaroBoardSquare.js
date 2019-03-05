import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import './CaroBoardSquare.scss';


class CaroBoardSquare extends PureComponent {

    render() {
        return (
            <div id="caro-board-square">
                
            </div>
        );
    }
}


const mapStateToProps = () => ({

});

const mapDispatchToProps = (dispatch) => ({
 
});

export default connect(mapStateToProps, mapDispatchToProps)(CaroBoardSquare);
