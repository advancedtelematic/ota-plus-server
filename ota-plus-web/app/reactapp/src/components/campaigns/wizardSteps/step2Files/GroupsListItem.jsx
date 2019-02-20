/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { VelocityTransitionGroup } from 'velocity-react';

import { Checkbox, Tag } from 'antd';

@inject('stores')
@observer
class GroupsListItem extends Component {
  @observable automaticCampaign = false;

  static propTypes = {
    stores: PropTypes.object,
    group: PropTypes.object.isRequired,
    setWizardData: PropTypes.func.isRequired,
    isChosen: PropTypes.bool.isRequired,
  };

  toggleAutomaticCampaign = () => {
    this.automaticCampaign = !this.automaticCampaign;
  };

  render() {
    const { stores, group, setWizardData, isChosen } = this.props;
    const { groupName, groupType, id: groupId } = group;
    const { groupsStore, featuresStore } = stores;
    const { alphaPlusEnabled } = featuresStore;
    const countDevices = groupsStore._getGroupDevices(group).length;

    return (
      <div>
        <div className={`item${isChosen ? ' selected' : ''}`} id={`checkbox-group-${groupId}`}>
          <Checkbox
            checked={isChosen}
            onChange={() => {
              setWizardData(groupId);
            }}
          />
          <div
            className='element-box group'
            onClick={() => {
              setWizardData(groupId);
            }}
          >
            <div className={`icon icon--${groupType === 'static' ? 'default' : 'smart'}`} />
            <div className='desc'>
              <div className='title'>{groupName}</div>
              <div className='subtitle'>{`${countDevices} device(s)`}</div>
            </div>
          </div>
          {alphaPlusEnabled && groupType === 'dynamic' && (
            <div className='automatic-campaign' onClick={this.toggleAutomaticCampaign}>
              <div>
                <span>{'automatic campaign'}
                  <Tag color='#48dad0' className='alpha-tag'>ALPHA</Tag>
                </span>
                <div className={`switch${this.automaticCampaign ? ' switchOn' : ''}`} />
              </div>
            </div>
          )}
        </div>
        <VelocityTransitionGroup enter={{ animation: 'slideDown' }} leave={{ animation: 'slideUp' }}>
          {this.automaticCampaign && <div className='automatic-campaign-tip'>{'Automatically publish to new matching devices'}</div>}
        </VelocityTransitionGroup>
      </div>
    );
  }
}

export default GroupsListItem;
