import React, { Component, PropTypes } from 'react';
import { observer } from 'mobx-react';
import { SubHeader, SearchBar } from '../../partials';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';

@observer
class ContentPanelHeader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { devicesFilter, changeFilter, addNewWizard, activeGroup } = this.props;
        return (
            <SubHeader>
                {activeGroup.id && activeGroup.id !== 'ungrouped' ?
                    <div className="add-group-campaign">
                        <a href="#" className="add-button bordered light" onClick={(e) => { e.preventDefault(); addNewWizard('groups') }}>
                            Create campaign
                        </a>
                    </div>
                :
                    null
                }
                <Form>
                    <SearchBar 
                        value={devicesFilter}
                        changeAction={changeFilter}
                        id="search-devices-input"
                    />
                </Form>                
            </SubHeader>
        );
    }
}

ContentPanelHeader.propTypes = {
    devicesFilter: PropTypes.string,
    changeFilter: PropTypes.func.isRequired
}

export default ContentPanelHeader;