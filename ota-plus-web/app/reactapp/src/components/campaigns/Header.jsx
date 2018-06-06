import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';

@observer
class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <SubHeader>
                <a href="#" className="add-button grey-button" id="add-new-campaign">
                    <span>
                        +
                    </span>
                    <span>
                        Add campaign
                    </span>
                </a>
            </SubHeader>
        );
    }
}

export default Header;