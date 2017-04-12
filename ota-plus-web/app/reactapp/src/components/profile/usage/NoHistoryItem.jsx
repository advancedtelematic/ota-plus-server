import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class NoHistoryItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { level, date } = this.props;
        const className = 'item level' + level;
        return (
            <div className={className}>
                <div className="panel panel-grey">
                    <div className="panel-heading">
                        {date.format('MMM YYYY')}
                    </div>
                    <div className="panel-body">
                        <div className="wrapper-center inner">
                            No history
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

NoHistoryItem.propTypes = {
    date: PropTypes.object.isRequired,
    level: PropTypes.number.isRequired,
};

export default NoHistoryItem;