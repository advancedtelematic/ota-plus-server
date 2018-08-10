import React, { Component, PropTypes } from 'react';
import { SubHeader, SearchBar } from '../../partials';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';
import { FormInput, FormSelect } from '../../partials';
import SmartFilters from './SmartFilters';

class ContentPanelSubheader extends Component {
    render() {
        return (
            <SubHeader className="subheader--filters">
                <SmartFilters
                	className="filters--dark"
                	layout={[1, 1, 5]}
                	devicesView={true}
                    setFilter={() => {}}
                />
            </SubHeader>
        );
    }
}

export default ContentPanelSubheader;