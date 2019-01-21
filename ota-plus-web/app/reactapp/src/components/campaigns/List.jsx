/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';

import ListItem from './ListItem';
import { contains } from '../../utils/Helpers';
import InfiniteScroll from '../../utils/InfiniteScroll';

@inject('stores')
@observer
class List extends Component {
  static propTypes = {
    stores: PropTypes.object,
    status: PropTypes.string.isRequired,
    expandedCampaigns: PropTypes.array.isRequired,
    focus: PropTypes.string,
    toggleCampaign: PropTypes.func,
    showCancelCampaignModal: PropTypes.func,
    showDependenciesModal: PropTypes.func,
  };

  componentDidMount() {
    const { focus } = this.props;
    this.highlightCampaign(focus);
  }

  componentWillReceiveProps(nextProps) {
    const { focus: prevFocus } = this.props;
    const { focus: nextFocus } = nextProps;

    if (prevFocus !== nextFocus) {
      this.highlightCampaign(nextFocus);
    }
  }

  scrollToElement = id => {
    const wrapperPosition = this.refs.list.getBoundingClientRect();
    const elementCoords = document.getElementById(`item-${id}`).getBoundingClientRect();
    const scrollTo = elementCoords.top - wrapperPosition.top + 35;
    const page = document.querySelector('.campaigns');
    setTimeout(() => {
      page.scrollTop = scrollTo;
    }, 1000);
  };

  highlightCampaign = id => {
    const { stores, toggleCampaign } = this.props;
    const { list } = this.refs;
    const { campaignsStore } = stores;

    if (list && id) {
      const name = _.filter(campaignsStore.campaigns, obj => obj.id === id);
      toggleCampaign(name[0].name);
      this.scrollToElement(id);
    }
  };

  render() {
    const { stores } = this.props;
    const { campaignsStore } = stores;
    const { campaigns } = campaignsStore;
    const { status, expandedCampaigns, showCancelCampaignModal, showDependenciesModal, toggleCampaign } = this.props;

    const campaignsAvailable = !!campaigns.length;

    return campaignsAvailable ? (
      <InfiniteScroll
        loadMore={() => {
          campaignsStore.loadMoreCampaigns(status);
        }}
        className='campaigns__list'
        id={`${status}-campaigns`}
        ref='list'
        hasMore={campaignsStore.hasMoreCampaigns}
        isLoading={campaignsStore.campaignsFetchAsync[status].isFetching}
        useWindow
        threshold={100}
      >
        {campaigns.map(campaign => {
          const isExpanded = contains(expandedCampaigns, campaign);
          const isCancelable = status === 'launched';
          return (
            <ListItem
              key={campaign.id}
              campaign={campaign}
              type={status}
              isExpanded={isExpanded}
              showCancelCampaignModal={showCancelCampaignModal}
              showDependenciesModal={showDependenciesModal}
              toggleCampaign={toggleCampaign}
              isCancelable={isCancelable}
            />
          );
        })}
      </InfiniteScroll>
    ) : (
      <div className='campaigns__list--empty'>{`Currently there are no ${status} campaigns.`}</div>
    );
  }
}

export default List;
