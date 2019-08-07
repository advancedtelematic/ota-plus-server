/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { withTranslation } from 'react-i18next';

import GroupsListItem from './GroupsListItem';
import { InfiniteScroll } from '../../../../utils';

@inject('stores')
@observer
class GroupsList extends Component {
  static propTypes = {
    stores: PropTypes.shape({}),
    chosenGroups: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    setWizardData: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  render() {
    const { stores, chosenGroups, setWizardData, t } = this.props;
    const { groupsStore } = stores;
    const wizardGroupsAvailable = Object.keys(groupsStore.preparedWizardGroups).length;
    return (
      <div className="ios-list" ref={this.listRef}>
        {wizardGroupsAvailable ? (
          <InfiniteScroll
            className="wrapper-infinite-scroll"
            hasMore={groupsStore.hasMoreWizardGroups}
            isLoading={groupsStore.groupsWizardFetchAsync.isFetching}
            useWindow={false}
            loadMore={() => {
              groupsStore.loadMoreWizardGroups();
            }}
          >
            {_.map(groupsStore.preparedWizardGroups, (groups, letter) => (
              <div key={letter}>
                <div className="header">{letter}</div>
                {_.map(groups, (group, index) => {
                  const isChosen = !!_.find(chosenGroups, { id: group.id });
                  return <GroupsListItem key={index} group={group} setWizardData={setWizardData} isChosen={isChosen} />;
                })}
              </div>
            ))}
          </InfiniteScroll>
        ) : (
          <div className="wrapper-center">{t('campaigns.wizard.no_groups_found')}</div>
        )}
      </div>
    );
  }
}

export default withTranslation()(GroupsList);
