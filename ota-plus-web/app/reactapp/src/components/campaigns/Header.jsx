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
        const { showCreateModal, campaignsSort, changeSort, campaignsFilter, changeFilter } = this.props;
        return (
            <SubHeader>
                <Form>
                    <SearchBar 
                        value={campaignsFilter}
                        changeAction={changeFilter}
                    />
                </Form>
                <FlatButton
                    label="Add new campaign"
                    onClick={showCreateModal}
                    className="btn-main btn-small btn-add"
                />
                <div className="sort-box">
                    {campaignsSort == 'asc' ? 
                        <a href="#" onClick={changeSort.bind(this, 'desc')} id="link-sort-campaigns-desc">
                            <i className="fa fa-long-arrow-up" aria-hidden="true"></i> A &gt; Z
                        </a>
                    :
                        <a href="#" onClick={changeSort.bind(this, 'asc')} id="link-sort-campaigns-asc">
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
    campaignsSort: PropTypes.string,
    changeSort: PropTypes.func.isRequired,
    campaignsFilter: PropTypes.string,
    changeFilter: PropTypes.func.isRequired
}

export default Header;