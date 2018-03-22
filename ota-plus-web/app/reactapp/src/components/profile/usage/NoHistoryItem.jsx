import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class NoHistoryItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { date } = this.props;
        return (
            <li className="flex-row">
                <div className="flex-column-main">
                    {date.format('MMM YYYY')}
                </div>
                <div className="flex-column">
                    No history
                </div>
            </li>
        );
    }
}

NoHistoryItem.propTypes = {
    date: PropTypes.object.isRequired,
};

export default NoHistoryItem;