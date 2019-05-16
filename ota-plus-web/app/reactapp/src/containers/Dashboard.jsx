/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Button } from 'antd';
import { LatestCreatedCampaigns, LastDevices, LastSoftware } from '../components/dashboard';
import { Dropdown } from '../partials';
import { SoftwareCreateModal } from '../components/software';

@observer
class Dashboard extends Component {
  @observable packagesCreateModalShown = false;
  @observable deviceSubmenuShown = false;
  @observable packageSubmenuShown = false;
  @observable campaignSubmenuShown = false;

  static propTypes = {
    addNewWizard: PropTypes.func,
  };

  showSoftwareCreateModal = e => {
    if (e) e.preventDefault();
    this.packagesCreateModalShown = true;
  };

  hideSoftwareCreateModal = e => {
    if (e) e.preventDefault();
    this.packagesCreateModalShown = false;
  };

  showDeviceSubmenu = e => {
    if (e) e.preventDefault();
    this.deviceSubmenuShown = true;
  };

  hideDeviceSubmenu = e => {
    if (e) e.preventDefault();
    this.deviceSubmenuShown = false;
  };

  showPackageSubmenu = e => {
    if (e) e.preventDefault();
    this.packageSubmenuShown = true;
  };

  hidePackageSubmenu = e => {
    if (e) e.preventDefault();
    this.packageSubmenuShown = false;
  };

  showCampaignSubmenu = e => {
    if (e) e.preventDefault();
    this.campaignSubmenuShown = true;
  };

  hideCampaignSubmenu = e => {
    if (e) e.preventDefault();
    this.campaignSubmenuShown = false;
  };

  render() {
    const { addNewWizard } = this.props;
    return (
      <div className='dashboard'>
        <div className='dashboard__box'>
          <div className='dashboard__list dashboard__list--devices'>
            <div className='dashboard__heading'>
              <div className='dashboard__heading-col'>{'Last created devices'}</div>
              <div className='dashboard__heading-col'>{'Seen online'}</div>
              <div className='dashboard__heading-col'>{'Status'}</div>
              <div className='dots' id='devices-menu' onClick={this.showDeviceSubmenu}>
                {/* ToDo: better refactor to use plain CSS' instead */}
                <span />
                <span />
                <span />
                {this.deviceSubmenuShown && (
                  <Dropdown hideSubmenu={this.hideDeviceSubmenu}>
                    <li className='device-dropdown-item'>
                      <a className='device-dropdown-item' href='https://docs.ota.here.com/quickstarts/start-intro.html' rel='noopener noreferrer' target='_blank' onClick={e => e.stopPropagation()}>
                        {'Add device'}
                      </a>
                    </li>
                    <li className='device-dropdown-item'>
                      <NavLink to='/devices'>{'View all'}</NavLink>
                    </li>
                  </Dropdown>
                )}
              </div>
            </div>
            <div className='dashboard__body'>
              <LastDevices />
            </div>
          </div>
          <div className='dashboard__list dashboard__list--software'>
            <div className='dashboard__heading'>
              <div className='dashboard__heading-col'>{'Last added software'}</div>
              <div className='dashboard__heading-col'>{'Version'}</div>
              <div className='dashboard__heading-col'>{'Created at'}</div>
              <div className='dots' id='software-menu' onClick={this.showPackageSubmenu}>
                {/* ToDo: better refactor to use plain CSS' instead */}
                <span />
                <span />
                <span />
                {this.packageSubmenuShown && (
                  <Dropdown hideSubmenu={this.hidePackageSubmenu}>
                    <li className='package-dropdown-item'>
                      <a className='ant-btn ant-btn-plain package-dropdown-item' onClick={this.showSoftwareCreateModal}>
                        {'Add software'}
                      </a>
                    </li>
                    <li className='package-dropdown-item'>
                      <NavLink to='/software-repository'>{'View all'}</NavLink>
                    </li>
                  </Dropdown>
                )}
              </div>
            </div>
            <div className='dashboard__body'>
              <LastSoftware showSoftwareCreateModal={this.showSoftwareCreateModal} />
            </div>
          </div>
          <div className='dashboard__list dashboard__list--campaigns'>
            <div className='dashboard__heading'>
              <div className='dashboard__heading-col'>{'Last created campaigns'}</div>
              <div className='dashboard__heading-col'>{'Finished'}</div>
              <div className='dashboard__heading-col'>{'Failure rate'}</div>
              <div className='dots' id='campaigns-menu' onClick={this.showCampaignSubmenu}>
                {/* ToDo: better refactor to use plain CSS' instead */}
                <span />
                <span />
                <span />

                {this.campaignSubmenuShown && (
                  <Dropdown hideSubmenu={this.hideCampaignSubmenu}>
                    <li className='campaign-dropdown-item'>
                      <a
                        className='ant-btn ant-btn-plain campaign-dropdown-item'
                        onClick={e => {
                          e.preventDefault();
                          addNewWizard();
                        }}
                      >
                        {'Create Campaign'}
                      </a>
                    </li>
                    <li className='campaign-dropdown-item'>
                      <NavLink to='/campaigns'>{'View all'}</NavLink>
                    </li>
                  </Dropdown>
                )}
              </div>
            </div>
            <div className='dashboard__body'>
              <LatestCreatedCampaigns addNewWizard={addNewWizard} />
            </div>
          </div>
        </div>
        {this.packagesCreateModalShown && <SoftwareCreateModal shown={this.packagesCreateModalShown} hide={this.hideSoftwareCreateModal} />}
      </div>
    );
  }
}

export default Dashboard;
