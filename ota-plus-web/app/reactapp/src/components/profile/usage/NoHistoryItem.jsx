import React, { Component, PropTypes } from 'react';
import moment from 'moment';

class NoHistoryItem extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { date } = this.props;
        const dateFormatted = date.format('MMM YYYY');
        return (
            <li className="flex-row" id={"no-history-" + dateFormatted}>
                <div className="flex-column-main">
                    {dateFormatted}
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