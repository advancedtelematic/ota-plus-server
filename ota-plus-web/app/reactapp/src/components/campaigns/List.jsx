/** @format */

import React, { PropTypes, Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import moment from 'moment';
import _ from 'underscore';
import { Loader } from '../../partials';
import ListItem from './ListItem';
import { _contains } from '../../utils/Collection';
import { VelocityTransitionGroup } from 'velocity-react';
import Statistics from './Statistics';
import InfiniteScroll from '../../utils/InfiniteScroll';

@inject('stores')
@observer
export default class List extends Component {
  static propTypes = {
    status: PropTypes.string.isRequired,
    expandedCampaigns: PropTypes.object.isRequired,
    focus: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.scrollToElement = this.scrollToElement.bind(this);
  }

  componentDidMount() {
    const { focus } = this.props;
    this.highlightCampaign(focus);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const { focus: prevFocus } = this.props;
    const { focus: nextFocus } = nextProps;

    if (prevFocus !== nextFocus) {
      this.highlightCampaign(nextFocus);
    }
  }

  scrollToElement(id) {
    const wrapperPosition = this.refs.list.getBoundingClientRect();
    const elementCoords = document.getElementById('item-' + id).getBoundingClientRect();
    let scrollTo = elementCoords.top - wrapperPosition.top + 35;
    let page = document.querySelector('.campaigns');
    setTimeout(() => {
      page.scrollTop = scrollTo;
    }, 1000);
  }

  highlightCampaign(id) {
    const { campaignsStore } = this.props.stores;
    if (this.refs.list && id) {
      const name = _.filter(campaignsStore.campaigns, obj => {
        return obj.id === id;
      });
      this.props.toggleCampaign(name[0].name);
      this.scrollToElement(id);
    }
  }

  render() {
    const { campaignsStore } = this.props.stores;
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
        useWindow={true}
        threshold={100}
      >
        {campaigns.map(campaign => {
          const isExpanded = _contains(expandedCampaigns, campaign);
          const isCancelable = status === 'launched';
          return (
            <span key={campaign.id}>
              <ListItem
                campaign={campaign}
                type={status}
                isExpanded={isExpanded}
                showCancelCampaignModal={showCancelCampaignModal}
                showDependenciesModal={showDependenciesModal}
                toggleCampaign={toggleCampaign}
              />
              <VelocityTransitionGroup
                enter={{
                  animation: 'slideDown',
                }}
                leave={{
                  animation: 'slideUp',
                }}
              >
                {isExpanded && <Statistics showCancelCampaignModal={showCancelCampaignModal} showDependenciesModal={showDependenciesModal} campaignId={campaign.id} hideCancel={!isCancelable} />}
              </VelocityTransitionGroup>
            </span>
          );
        })}
      </InfiniteScroll>
    ) : (
      <div className='campaigns__list--empty'>{`Currently there are no ${status} campaigns.`}</div>
    );
  }
}
