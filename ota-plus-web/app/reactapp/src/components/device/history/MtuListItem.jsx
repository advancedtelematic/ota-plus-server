/** @format */

import React, { Component, PropTypes } from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'underscore';
import moment from 'moment';
import InstallationEvents from '../InstallationEvents';
import Loader from '../../../partials/Loader';

@inject('stores')
@observer
class MtuListItem extends Component {
  render() {
    const { item, events } = this.props;
    const { devicesStore } = this.props.stores;
    const { device } = devicesStore;
    const devicePrimaryEcu = device.directorAttributes.primary;
    const deviceSecondaryEcus = device.directorAttributes.secondary;
    let type = item.campaign ? 'campaign' : 'singleInstallation';

    return (
      <li className='overview-panel__item'>
        <div className='overview-panel__item-header'>
          {type === 'campaign' ? (
            <div>
              <div className='overview-panel__item-header--title'>
                <div>
                  <span id={'update-id-title-' + item.correlationId} className='overview-panel__item-header--title__label'>
                    Campaign:
                  </span>
                  <span id={'update-id-' + item.correlationId}>{item.campaign.name}</span>
                </div>
              </div>
              <div className='overview-panel__item-header--update'>
                <div className='overview-panel__item-header--update__name'>
                  <span id={'update-id-title-' + item.correlationId} className='overview-panel__item-header__label'>
                    Update&nbsp;name:
                  </span>
                  <span id={'update-id-' + item.correlationId}>{item.campaign.update.name}</span>
                </div>
                <div className='overview-panel__item-header--update__description'>
                  <span id={'update-id-title-' + item.correlationId} className={'overview-panel__item-header__label'}>
                    Update&nbsp;description:
                  </span>
                  <span id={'update-id-' + item.correlationId}>{item.campaign.update.description}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className='overview-panel__item-header--title'>
              <div>
                <span id={'update-id-title-' + item.correlationId} className='overview-panel__item-header--title__label'>
                  Single-device update
                </span>
              </div>
            </div>
          )}
          <div className='overview-panel__item-header__created'>
            <span id={'received-at-title-' + item.correlationId} className={'overview-panel__item-header__label'}>
              Received at:
            </span>
            <span id={'received-at-' + item.correlationId}>{moment(item.receivedAt).format('ddd MMM DD YYYY, h:mm A')}</span>
          </div>
        </div>

        <div className='overview-panel__operations'>
          {_.map(item.ecuReports, (ecuReport, ecuSerial) => {
            let hardwareId = null;
            if (devicePrimaryEcu.id === ecuSerial) {
              hardwareId = devicePrimaryEcu.hardwareId;
            }
            const serialFromSecondary = _.find(deviceSecondaryEcus, ecu => ecu.id === ecuSerial);
            if (serialFromSecondary) {
              hardwareId = serialFromSecondary.hardwareId;
            }

            return (
              <div className='overview-panel__operation' key={ecuSerial}>
                <div className='overview-panel__operation-info'>
                  <div className='overview-panel__operation-info-line'>
                    <div className='overview-panel__operation-info-block'>
                      <span id={'hardwareId-title-' + hardwareId} className='overview-panel__operation-info--label'>
                        ECU&nbsp;type:
                      </span>
                      <span id={'hardwareId-' + hardwareId}>{hardwareId}</span>
                    </div>
                    <div className='overview-panel__operation-info-block'>
                      <span id={'ecu-serial-title-' + item.correlationId} className='overview-panel__operation-info--label'>
                        ECU&nbsp;identifier:
                      </span>
                      <span id={'ecu-serial-' + item.correlationId}>{ecuSerial}</span>
                    </div>
                  </div>
                  <div className='overview-panel__operation-info-line'>
                    <div className='overview-panel__operation-info-block'>
                      <span id={'target-title-' + item.correlationId} className='overview-panel__operation-info--label'>
                        Target:
                      </span>
                      <span id={'target-' + item.correlationId}>{ecuReport.target.join()}</span>
                    </div>
                  </div>
                  {events.length ? (
                    devicesStore.eventsFetchAsync.isFetching ? (
                      <div className='wrapper-center'>
                        <Loader />
                      </div>
                    ) : (
                      <InstallationEvents events={events} />
                    )
                  ) : null}
                </div>
                <div className='overview-panel__operation-status'>
                  <div className={`overview-panel__status-code ${ecuReport.result.success ? 'overview-panel__status-code--success' : 'overview-panel__status-code--error'}`}>
                    <span>Result code</span>{' '}
                    <span className='overview-panel__status-code-value' id={'result-code-' + item.correlationId}>
                      {ecuReport.result.code}
                    </span>
                  </div>
                  <div className='overview-panel__status-text'>
                    <span id={'result-text-' + item.correlationId}>{ecuReport.result.description}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className='overview-panel__device-status'>
          <div className={`overview-panel__status-code ${item.result.success ? 'overview-panel__status-code--success' : 'overview-panel__status-code--error'}`}>
            <span>Result code</span>{' '}
            <span className='overview-panel__status-code-value' id={'result-code-' + item.correlationId}>
              {item.result.code}
            </span>
          </div>
          <div className='overview-panel__status-text'>
            <span id={'result-text-' + item.result.code}>{item.result.description}</span>
          </div>
        </div>
      </li>
    );
  }
}

MtuListItem.propTypes = {
  stores: PropTypes.object,
};

export default MtuListItem;
