import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';

@observer
class SoftwareRepository extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <span>Container</span>
        );
    }
}

export default SoftwareRepository;