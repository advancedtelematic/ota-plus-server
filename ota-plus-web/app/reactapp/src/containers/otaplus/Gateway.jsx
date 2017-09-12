import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { GatewayBarchart } from '../../components/gateway';

@observer
class Gateway extends Component {
    constructor(props) {
        super(props);
    }
    render() {
		return (
			<GatewayBarchart />
        );
    }
}

export default Gateway;