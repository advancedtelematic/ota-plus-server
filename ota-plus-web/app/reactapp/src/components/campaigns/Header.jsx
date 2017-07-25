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
        const { addNewWizard, campaignsSort, changeSort, campaignsFilter, changeFilter } = this.props;
        return (
            <SubHeader>
                <FlatButton
                    label="Add new campaign"
                    onClick={addNewWizard.bind(this, null)}
                    className="btn-main btn-small btn-add"
                    id="add-new-campaign"
                />
            </SubHeader>
        );
    }
}

Header.propTypes = {
    addNewWizard: PropTypes.func.isRequired,
    campaignsSort: PropTypes.string,
    changeSort: PropTypes.func.isRequired,
    campaignsFilter: PropTypes.string,
    changeFilter: PropTypes.func.isRequired
}

export default Header;