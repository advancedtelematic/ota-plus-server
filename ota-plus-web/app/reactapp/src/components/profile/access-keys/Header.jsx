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
        const { showCreateModal, devicesFilter, changeFilter, provisioningSort, changeSort} = this.props;
        return (
            <SubHeader>
                <Form>
                    <SearchBar 
                        value={devicesFilter}
                        changeAction={changeFilter}
                        id="search-devices-input"
                    />
                </Form>
                <div className="sort-box">
                    {provisioningSort == 'asc' ? 
                        <a href="#" onClick={changeSort.bind(this, 'desc')} id="link-sort-access-keys-desc">
                            <i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z
                        </a>
                    :
                        <a href="#" onClick={changeSort.bind(this, 'asc')} id="link-sort-access-keys-asc">
                            <i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A
                        </a>
                    }
                </div>
                <FlatButton
                    label="Add new key"
                    onClick={showCreateModal.bind(this)}
                    className="btn-main btn-small btn-add"
                    id="add-new-key"
                />
            </SubHeader>
        );
    }
}

Header.propTypes = {
    showCreateModal: PropTypes.func.isRequired
}

export default Header;