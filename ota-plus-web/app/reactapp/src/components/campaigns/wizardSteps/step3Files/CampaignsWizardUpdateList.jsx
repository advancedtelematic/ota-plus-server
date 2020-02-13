/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';
import { contains } from '../../../../utils/Helpers';

import { SelectableListItem } from '../../../../partials/lists';
import InfiniteScroll from '../../../../utils/InfiniteScroll';
import { DATA_TYPE } from '../../../../constants';

@inject('stores')
@observer
class CampaignsWizardUpdateList extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    selectedUpdate: PropTypes.arrayOf(PropTypes.shape({})),
    toggleSelection: PropTypes.func.isRequired,
    showUpdateDetails: PropTypes.func.isRequired,
  };

  onChangeSelected = (update, e) => {
    if (e) e.preventDefault();
    const { toggleSelection } = this.props;
    toggleSelection(update);
  };

  render() {
    const { stores, selectedUpdate, showUpdateDetails } = this.props;
    const { updatesStore } = stores;
    const updatesAvailable = !!Object.keys(updatesStore.preparedUpdatesWizard).length;

    return (
      <div className="row update-container" id="update-container">
        <div className="col-xs-12">
          <div className="ios-list">
            {updatesAvailable ? (
              <InfiniteScroll
                className="wrapper-infinite-scroll"
                hasMore={updatesStore.hasMoreWizardUpdates}
                isLoading={updatesStore.updatesWizardFetchAsync.isFetching}
                useWindow={false}
                loadMore={() => {
                  updatesStore.loadMoreWizardUpdates();
                }}
                threshold={1}
              >
                {_.map(updatesStore.preparedUpdatesWizard, (updates, firstLetter) => (
                  <div key={firstLetter}>
                    <div className="header">{firstLetter}</div>
                    {_.map(updates, (update, index) => {
                      const selected = contains(selectedUpdate, update, DATA_TYPE.UPDATE);
                      return (
                        <SelectableListItem
                          key={index}
                          item={update}
                          selected={selected}
                          onChange={this.onChangeSelected}
                          showDetails={showUpdateDetails}
                          showIcon
                          sourceType={update.source.sourceType}
                        />
                      );
                    })}
                  </div>
                ))}
              </InfiniteScroll>
            ) : (
              <div className="error">
                <p>
                  {'No updates found. Create some updates first.'}
                </p>
                <p>
                  {'If you’re working with a customized version of OTA Connect, contact your administrator.'}
                  {'They might need to map your updates to your devices first.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CampaignsWizardUpdateList;
