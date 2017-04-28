import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SubHeader, SearchBar } from '../../partials';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';

@observer
class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { showCreateModal, packagesSort, changeSort, packagesFilter, changeFilter, changeType } = this.props;
        return (
            <SubHeader>
                <Form>
                    <SearchBar 
                        value={packagesFilter}
                        changeAction={changeFilter}
                        id="search-packages-input"
                    />
                </Form>
                <FlatButton
                    label="Add new package"
                    onClick={showCreateModal.bind(this, null)}
                    className="btn-main btn-small btn-add"
                    id="add-new-package"
                />
                <div className="sort-box">
                    {packagesSort == 'asc' ? 
                        <a href="#" onClick={changeSort.bind(this, 'desc')} id="link-sort-packages-desc">
                            <i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z
                        </a>
                    :
                        <a href="#" onClick={changeSort.bind(this, 'asc')} id="link-sort-packages-asc">
                            <i className="fa fa-long-arrow-down" aria-hidden="true"></i> Z &gt; A
                        </a>
                    }
                </div>
            </SubHeader>
        );
    }
}

Header.propTypes = {
    showCreateModal: PropTypes.func.isRequired,
    packagesSort: PropTypes.string,
    changeSort: PropTypes.func.isRequired,
    packagesFilter: PropTypes.string,
    changeFilter: PropTypes.func.isRequired,
    changeType: PropTypes.func.isRequired
}

export default Header;