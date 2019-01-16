/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import { FlexibleWidthXYPlot, XAxis, YAxis, VerticalGridLines, HorizontalRectSeries } from 'react-vis';
import ReactTooltip from 'react-tooltip';

@inject('stores')
@observer
class InstallationReportView extends Component {
  render() {
    const { campaignsStore } = this.props.stores;
    const { campaign } = campaignsStore;
    const failures = [
      {
        name: 'Failure 1',
        devices: 2,
        color: '#d0021b',
        description: {
          ecuID: 12345,
          ecuType: 'primary',
          hardwareID: 'abs',
          reason: 'Device broken',
        },
      },
      {
        name: 'Failure 2',
        devices: 3,
        color: '#d0021b',
        description: {
          ecuID: 45678,
          ecuType: 'primary',
          hardwareID: 'abs',
          reason: 'Device broken',
        },
      },
      {
        name: 'Failure 3',
        devices: 3,
        color: '#d0021b',
        description: {
          ecuID: 112233,
          ecuType: 'primary',
          hardwareID: 'exmample1',
          reason: 'Device broken',
        },
      },
      {
        name: 'Failure 4',
        devices: 3,
        color: '#d0021b',
        description: {
          ecuID: 111111,
          ecuType: 'primary',
          hardwareID: 'airbag_contoller',
          reason: 'Device broken',
        },
      },
      {
        name: 'Failure 5',
        devices: 16,
        color: '#d0021b',
        description: {
          ecuID: 444444,
          ecuType: 'primary',
          hardwareID: 'body_can_gateway',
          reason: 'Device broken',
        },
      },
    ];
    const { devices } = _.max(failures, _.property('devices'));
    const devicesCount = _.reduce(_.pluck(failures, 'devices'), (prev, next) => {
      return prev + next;
    });
    let xtickValues = [];
    for (let i = 0; i <= devices; i++) {
      if (i % 2 === 0) {
        xtickValues.push(i);
      }
    }
    let ytickValues = [];
    for (let i = 0; i < failures.length; i++) {
      ytickValues.push(i);
    }
    return (
      <div className='installation-report-view'>
        <div className='failure-data'>
          <div className='failure-data__devices'>Number of devices: {devicesCount}</div>
          <div className='failure-data__legend'>
            <span className='failure-data__color' />
            Devices
          </div>
        </div>
        <div className='failures'>
          <div className='failures__chart'>
            <FlexibleWidthXYPlot height={75 * failures.length} margin={{ left: 75, right: 150 }} yType='ordinal'>
              <VerticalGridLines />
              <XAxis tickTotal={devices} tickValues={xtickValues} tickFormat={v => (v < 10 && v !== 0 ? '0' + v : v)} />
              <YAxis orientation='left' tickTotal={failures.length} tickValues={ytickValues} tickFormat={v => failures[v].name} />
              {_.map(failures, (group, index) => {
                return (
                  <HorizontalRectSeries
                    key={group.name}
                    animation
                    data={[{ y0: index, y: index, x0: 0, x: group.devices }]}
                    color={group.color}
                    className='rect-series'
                    style={{ transform: 'translate(0px, -10px)' }}
                    onSeriesMouseOver={e => {
                      console.log(e);
                    }}
                    onValueMouseOver={e => {
                      console.log(e);
                    }}
                  />
                );
              })}
            </FlexibleWidthXYPlot>
          </div>
          <div className='failures__actions'>
            {_.map(failures, (group, index) => {
              return (
                <div key={group.name} className='failures__action-wrapper' style={{ height: 'calc(75px - ' + 50 / failures.length + 'px)' }}>
                  <div className={'failures__action-bg ' + (index % 2 !== 0 ? 'failures__action-bg--odd' : '')} />
                  <div className='failures__action-label' data-tip data-for={`label ${group.name}`} />
                  <div className='failures__action-tip' data-tip data-for={group.name} />

                  <div className='failures__action' data-tip data-for='extract-vins'>
                    <img src='/assets/img/icons/download.svg' alt='Icon' />
                  </div>
                  <div className='failures__action' data-tip data-for='relaunch-campaign'>
                    <img src='/assets/img/icons/relaunch.svg' alt='Icon' />
                  </div>
                  <ReactTooltip id={`label ${group.name}`}>
                    <div>Ecu id: {group.description.ecuID}</div>
                    <div>Ecu type: {group.description.ecuType}</div>
                    <div>Failure reason: {group.description.reason}</div>
                  </ReactTooltip>
                  <ReactTooltip id={group.name}>
                    <div>Ecu id: {group.description.ecuID}</div>
                    <div>Hardware id: {group.description.hardwareID}</div>
                    <div>Failure reason: {group.description.reason}</div>
                  </ReactTooltip>
                  <ReactTooltip id='extract-vins'>Extract VINs</ReactTooltip>
                  <ReactTooltip id='relaunch-campaign'>Relaunch campaign</ReactTooltip>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

InstallationReportView.propTypes = {
  stores: PropTypes.object,
};

export default InstallationReportView;
