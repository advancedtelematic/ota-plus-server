import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';

@observer
class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { addNewWizard } = this.props;
        return (
            <SubHeader>
                <a href="#" className="add-button" id="add-new-campaign" onClick={addNewWizard.bind(this, null)}>
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

Header.propTypes = {
    addNewWizard: PropTypes.func.isRequired,
}

export default Header;