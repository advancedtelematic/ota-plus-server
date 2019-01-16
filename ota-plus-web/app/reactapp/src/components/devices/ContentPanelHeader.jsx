/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import { SubHeader, SearchBar } from '../../partials';
import { Form } from 'formsy-react';
import { FlatButton } from 'material-ui';

@inject('stores')
@observer
class ContentPanelHeader extends Component {
  render() {
    const { devicesFilter, changeFilter, addNewWizard } = this.props;
    const { groupsStore } = this.props.stores;
    const { selectedGroup } = groupsStore;
    return (
      <SubHeader>
        {selectedGroup.id && selectedGroup.id !== 'ungrouped' ? (
          <div className='add-group-campaign'>
            <a
              href='#'
              className='add-button bordered light'
              onClick={e => {
                e.preventDefault();
                addNewWizard('groups');
              }}
            >
              Create campaign
            </a>
          </div>
        ) : null}
        <Form>
          <SearchBar value={devicesFilter} changeAction={changeFilter} id='search-devices-input' />
        </Form>
      </SubHeader>
    );
  }
}

ContentPanelHeader.propTypes = {
  stores: PropTypes.object,
  devicesFilter: PropTypes.string,
  changeFilter: PropTypes.func.isRequired,
};

export default ContentPanelHeader;
