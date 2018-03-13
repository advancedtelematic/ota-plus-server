import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SubHeader, SearchBar } from '../../../partials';
import { FlatButton } from 'material-ui';
import { Form } from 'formsy-react';

@observer
class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showCreateModal, provisioningFilter, changeFilter} = this.props;
        return (
            <SubHeader>
                <Form>
                    <SearchBar 
                        value={provisioningFilter}
                        changeAction={changeFilter}
                        id="search-devices-input"
                        additionalClassName={'white'}
                    />
                </Form>
                <a href="#" className="add-button grey-button" id="add-new-key" onClick={showCreateModal.bind(this)} >
                    <span>
                        +
                    </span>
                    <span>
                        Add new key
                    </span>
                </a>
            </SubHeader>
        );
    }
}

Header.propTypes = {
    showCreateModal: PropTypes.func.isRequired
}

export default Header;