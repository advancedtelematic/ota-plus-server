import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <span>Dashboard</span>
        );
    }
}

export default Dashboard;