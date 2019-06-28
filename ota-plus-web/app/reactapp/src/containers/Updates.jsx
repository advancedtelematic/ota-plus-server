/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Pagination } from 'antd';

import { UpdateCreateModal, UpdateHeader, UpdateList } from '../components/updates';
import { Loader } from '../partials';

import { UPDATES_LIMIT_PER_PAGE } from '../config';

const PAGE_NUMBER_DEFAULT = 1;

@inject('stores')
@observer
class Updates extends Component {
  @observable
  createModalShown = false;

  @observable
  updateDetailsShown = false;

  @observable
  selectedUpdate = null;

  constructor(props) {
    super(props);
    this.state = { pageNumber: PAGE_NUMBER_DEFAULT };
  }

  showCreateModal = e => {
    if (e) e.preventDefault();
    this.createModalShown = true;
  };

  hideCreateModal = e => {
    if (e) e.preventDefault();
    this.createModalShown = false;
  };

  showUpdateDetails = (update, e) => {
    if (e) e.preventDefault();
    this.updateDetailsShown = true;
    this.selectedUpdate = update;
  };

  hideUpdateDetails = e => {
    if (e) e.preventDefault();
    this.updateDetailsShown = false;
  };

  onPageChange = (page, pageSize) => {
    this.setState({ pageNumber: page });
    const { stores } = this.props;
    const { updatesStore } = stores;
    updatesStore.fetchUpdates('updatesFetchAsync', (page - 1) * pageSize);
  };

  showTotalTemplate = (total, range) => (total > 0 ? `${range[0]}-${range[1]} of ${total}` : '');

  filterChangeCallback = (filter, event) => {
    if (event) {
      event.preventDefault();
    }
    this.setState({ pageNumber: PAGE_NUMBER_DEFAULT });
    const { stores } = this.props;
    const { updatesStore } = stores;
    updatesStore.filterUpdates(filter);
  };

  render() {
    const { pageNumber } = this.state;
    const { updatesStore } = this.props.stores;
    const { isFetching } = updatesStore.updatesFetchAsync;
    return (
      <span ref='component'>
        {isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : (updatesStore.updatesTotalCount || updatesStore.updateFilter.length) ? (
          <span>
            <UpdateHeader filterChangeCallback={this.filterChangeCallback} showCreateModal={this.showCreateModal} />
            <UpdateList showUpdateDetails={this.showUpdateDetails} />
            <div className='ant-pagination__wrapper clearfix'>
              <Pagination
                current={pageNumber}
                defaultPageSize={UPDATES_LIMIT_PER_PAGE}
                onChange={this.onPageChange}
                total={updatesStore.updatesTotalCount}
                showTotal={this.showTotalTemplate}
              />
            </div>
          </span>
        ) : (
          <span>
            <UpdateHeader filterChangeCallback={this.filterChangeCallback} showCreateModal={this.showCreateModal} />
            <div className='wrapper-center'>
              <div className='page-intro'>
                <img src='/assets/img/icons/white/packages.svg' alt='Icon' />
                <div>{"You haven't created any updates yet."}</div>
                <div>
                  <a href='#' className='add-button light' id='add-new-update' onClick={this.showCreateModal}>
                    <span>{'Create Update'}</span>
                  </a>
                </div>
              </div>
            </div>
          </span>
        )}
        {this.createModalShown ? <UpdateCreateModal shown={this.createModalShown} hide={this.hideCreateModal} /> : null}
        {this.updateDetailsShown ? <UpdateCreateModal shown={this.updateDetailsShown} hide={this.hideUpdateDetails} showDetails={this.selectedUpdate} /> : null}
      </span>
    );
  }
}

Updates.propTypes = {
  stores: PropTypes.object,
};

export default Updates;
