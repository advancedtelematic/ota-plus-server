import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SubHeader, SearchBar } from '../../partials';
import { FlatButton } from 'material-ui';

@observer
class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showCreateModal } = this.props;
        return (
            <SubHeader>
                <FlatButton
                    label="Add new key"
                    onClick={showCreateModal.bind(this, null)}
                    className="btn-main btn-small btn-add"
                />
            </SubHeader>
        );
    }
}

Header.propTypes = {
    showCreateModal: PropTypes.func.isRequired
}

export default Header;