/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { UpdateCreateModal, UpdateHeader, UpdateList } from '../components/updates';
import { Loader } from '../partials';

@inject('stores')
@observer
class Updates extends Component {
  @observable createModalShown = false;
  @observable updateDetailsShown = false;
  @observable selectedUpdate = null;

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

  render() {
    const { updatesStore } = this.props.stores;
    return (
      <span ref='component'>
        {updatesStore.updatesFetchAsync.isFetching ? (
          <div className='wrapper-center'>
            <Loader />
          </div>
        ) : updatesStore.updatesInitialTotalCount ? (
          <span>
            <UpdateHeader showCreateModal={this.showCreateModal} />
            <UpdateList showUpdateDetails={this.showUpdateDetails} />
          </span>
        ) : (
          <div className='wrapper-center'>
            <div className='page-intro'>
              <div>
                <img src='/assets/img/icons/white/packages.svg' alt='Icon' />
              </div>
              <div>{"You haven't created any updates yet."}</div>
              <div>
                <a href='#' className='add-button light' id='add-new-update' onClick={this.showCreateModal}>
                  <span>{'+'}</span>
                  <span>{'Create new update'}</span>
                </a>
              </div>
            </div>
          </div>
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
