import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { SubHeader } from '../../partials';

@observer
class Header extends Component {

    constructor(props) {
        super(props);
    }
    render() {
        const { showCreateModal, showFileUploaderModal, toggleSWRepo, switchValue, alphaPlusEnabled } = this.props;
        return (
            <SubHeader>
                <div className="col-md-6">
                    {alphaPlusEnabled ?
                        <span style={{color: '#fff'}}>Advanced software repository
                            <div className={`switch ${switchValue ? 'switchOn' : ''}`} id="sw-repo-switch" onClick={toggleSWRepo}>
                                <div className="switch-status">
                                </div>
                            </div>
                        </span>
                    :
                        ''
                    }
                </div>
                <a href="#" className="add-button grey-button" id="add-new-package" onClick={showCreateModal.bind(this, null)}>
                    <span>
                        +
                    </span>
                    <span>
                        Add package
                    </span>
                </a>
            </SubHeader>
        );
    }
}

Header.propTypes = {
    showCreateModal: PropTypes.func.isRequired,
    showFileUploaderModal: PropTypes.func.isRequired,
}

export default Header;