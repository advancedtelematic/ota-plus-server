/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Form } from 'formsy-antd';
import { SubHeader, SearchBar } from '../../partials';

@inject('stores')
@observer
class ContentPanelHeader extends Component {
  static propTypes = {
    stores: PropTypes.object,
    devicesFilter: PropTypes.string,
    changeFilter: PropTypes.func.isRequired,
    addNewWizard: PropTypes.func,
  };

  render() {
    const { stores, devicesFilter, changeFilter, addNewWizard } = this.props;
    const { groupsStore } = stores;
    const { selectedGroup } = groupsStore;
    return (
      <SubHeader>
        {selectedGroup.id &&
        selectedGroup.id !== 'ungrouped' && (
          <div className="add-group-campaign">
            <a
              className="add-button bordered light"
              onClick={e => {
                e.preventDefault();
                addNewWizard('groups');
              }}
            >
              {'Create campaign'}
            </a>
          </div>
        )}
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

export default ContentPanelHeader;
