/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { VelocityTransitionGroup } from 'velocity-react';
import { Checkbox, Tag } from 'antd';
import { withTranslation } from 'react-i18next';

import { GROUP_GROUP_TYPE_STATIC } from '../../../../constants/groupConstants';
import { ALPHA_TAG, FEATURES } from '../../../../config';
import { SLIDE_ANIMATION_TYPE } from '../../../../constants';

@inject('stores')
@observer
class GroupsListItem extends Component {
  @observable automaticCampaign = false;

  static propTypes = {
    stores: PropTypes.shape({}),
    group: PropTypes.shape({}).isRequired,
    setWizardData: PropTypes.func.isRequired,
    isChosen: PropTypes.bool.isRequired,
    t: PropTypes.func.isRequired
  };

  toggleAutomaticCampaign = () => {
    this.automaticCampaign = !this.automaticCampaign;
  };

  render() {
    const { stores, group, setWizardData, isChosen, t } = this.props;
    const { groupName, groupType, id: groupId } = group;
    const { groupsStore, featuresStore } = stores;
    const { features } = featuresStore;
    const countDevices = groupsStore.getGroupDevicesCount(group);

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
            className="element-box group"
            onClick={() => {
              setWizardData(groupId);
            }}
          >
            <div className={`icon icon--${groupType === GROUP_GROUP_TYPE_STATIC ? 'default' : 'smart'}`} />
            <div className="desc">
              <div className="title">{groupName}</div>
              <div className="subtitle">
                {t('devices.device_count', { count: countDevices })}
              </div>
            </div>
          </div>
          {features.includes(FEATURES.AUTO_CAMPAIGN) && groupType === 'dynamic' && (
            <div className="automatic-campaign" onClick={this.toggleAutomaticCampaign}>
              <div>
                <span>
                  {'automatic campaign'}
                  <Tag color="#00B6B2" className="alpha-tag">{ALPHA_TAG}</Tag>
                </span>
                <div className={`switch${this.automaticCampaign ? ' switchOn' : ''}`} />
              </div>
            </div>
          )}
        </div>
        <VelocityTransitionGroup
          enter={{ animation: SLIDE_ANIMATION_TYPE.DOWN }}
          leave={{ animation: SLIDE_ANIMATION_TYPE.UP }}
        >
          {this.automaticCampaign
            && (
              <div className="automatic-campaign-tip">
                {t('campaigns.wizard.automatically_publish_devices')}
              </div>
            )
          }
        </VelocityTransitionGroup>
      </div>
    );
  }
}

export default withTranslation()(GroupsListItem);
