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
        const { showCreateModal, showFileUploaderModal } = this.props;
        return (
            <SubHeader>
                <FlatButton
                    label="Add new package"
                    onClick={showCreateModal.bind(this, null)}
                    className="btn-main btn-small btn-add"
                    id="add-new-package"
                />
            </SubHeader>
        );
    }
}

Header.propTypes = {
    showCreateModal: PropTypes.func.isRequired,
    showFileUploaderModal: PropTypes.func.isRequired,
}

export default Header;