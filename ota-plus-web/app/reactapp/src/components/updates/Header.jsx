/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button } from 'antd';
import { Form } from 'formsy-antd';

import { SearchBar, SubHeader } from '../../partials';

@inject('stores')
@observer
class Header extends Component {
  static propTypes = {
    filterChangeCallback: PropTypes.func.isRequired,
    showCreateModal: PropTypes.func.isRequired,
    stores: PropTypes.shape({
      updatesStore: PropTypes.shape({})
    }),
  };

  static defaultProps = {
    stores: { updatesStore: {} }
  };

  render() {
    const { filterChangeCallback, showCreateModal, stores } = this.props;
    const { updatesStore } = stores;
    return (
      <>
        {updatesStore.updatesTotalCount > 0 && (
          <div>
            <div className="tab-navigation">
              <div className="tab-navigation__buttons">
                <Form className="tab-navigation__form-search-updates-filter">
                  <SearchBar
                    value={updatesStore.updateFilter}
                    changeAction={filterChangeCallback}
                    id="search-updates-input"
                  />
                </Form>
                <Button
                  htmlType="button"
                  className="ant-btn ant-btn-outlined"
                  id="add-new-update"
                  onClick={() => {
                    showCreateModal(null);
                  }}
                >
                  {'Create update'}
                </Button>
              </div>
            </div>
            <SubHeader className="update-subheader">
              <div className="update-subheader__item">Title</div>
              <div className="update-subheader__item description">Internal description</div>
            </SubHeader>
          </div>
        )}
      </>
    );
  }
}

export default Header;
