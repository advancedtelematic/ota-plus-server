/** @format */

import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { observable } from 'mobx';
import { VelocityTransitionGroup } from 'velocity-react';

import { Checkbox } from 'antd';

const fakeOLP = {
  groupName: 'VINs Dynamic Config Campaign UPD66371823-Overheat',
  layerID: 'lchu201808010911',
  link: 'https://platform.here.com/data/hrn:here:data:::chu2018080109505/lchu201808010911',
};

@inject('stores')
@observer
class OLPGroupsListItem extends Component {
  @observable automaticCampaign = false;

  toggleAutomaticCampaign = () => {
    this.automaticCampaign = !this.automaticCampaign;
  };

  render() {
    return (
      <span>
        <div className='ios-list' ref='list'>
          <div className='fake-header'>V</div>
          <div className='header' />
          <div className='item'>
            <Checkbox />
            <div className='element-box olpgroup'>
              <div className='desc'>
                <div className='title'>{fakeOLP.groupName}</div>
                <div className='subtitle'>
                  <span className='layer'>Layer</span>
                  <span className='versioned'>Versioned</span>
                  <span>Layer ID: {fakeOLP.layerID}</span>
                  <span>
                    <a href={fakeOLP.link} rel='noopener noreferrer' target='_blank'>
                      <div className='link-icon' />
                    </a>
                  </span>
                </div>
              </div>
              <div className='automatic-campaign' onClick={this.toggleAutomaticCampaign}>
                <div>
                  automatic campaign
                  <div className={`switch${this.automaticCampaign ? ' switchOn' : ''}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <VelocityTransitionGroup enter={{ animation: 'slideDown' }} leave={{ animation: 'slideUp' }}>
          {this.automaticCampaign && <div className='automatic-campaign-tip'>{'Automatically publish to new matching devices'}</div>}
        </VelocityTransitionGroup>
      </span>
    );
  }
}

export default OLPGroupsListItem;
