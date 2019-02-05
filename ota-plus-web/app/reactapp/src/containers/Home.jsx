/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { ActiveCampaigns, LastDevices, LastPackages } from '../components/home';
import { Dropdown } from '../partials';
import { PackagesCreateModal } from '../components/packages';

@observer
class Home extends Component {
  @observable packagesCreateModalShown = false;
  @observable deviceSubmenuShown = false;
  @observable packageSubmenuShown = false;
  @observable campaignSubmenuShown = false;

  static propTypes = {
    addNewWizard: PropTypes.func,
  };

  showPackagesCreateModal = e => {
    if (e) e.preventDefault();
    this.packagesCreateModalShown = true;
  };

  hidePackagesCreateModal = e => {
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
      <div className='home'>
        <div className='home__box home__box--left'>
          <div className='home__tutorial'>
            <div className='home__heading'>
              <div className='home__heading-col'>{'Welcome'}</div>
            </div>
            <div className='home__body home__body--left'>
              <div className='home__tutorial-top'>
                <div className='home__tutorial-title'>{'Welcome to HERE OTA Connect!'}</div>
                <div className='home__tutorial-subtitle'>{'HERE OTA Connect lets you manage updates on your embedded devices from the cloud.'}</div>
              </div>
              <div className='home__tutorial-overview'>
                <div className='home__tutorial-wrapper'>
                  <div className='home__tutorial-title home__tutorial-title--small'>How it works</div>
                  <div className='home__tutorial-steps'>
                    <div className='home__tutorial-step'>
                      <div className='home__tutorial-step-name'>{'Step 1'}</div>
                      <img className='home__tutorial-step-image' src='/assets/img/onboarding_step_one.svg' alt='onboarding-step-1' />
                      <div className='home__tutorial-step-title'>{'Integrate our open source client'}</div>
                      <div className='home__tutorial-step-desc'>{"Add a Yocto layer to an existing project, or follow a quickstart guide if you're new to Yocto/OpenEmbedded."}</div>
                    </div>

                    <div className='home__tutorial-step'>
                      <div className='home__tutorial-step-name'>{'Step 2'}</div>
                      <img className='home__tutorial-step-image' src='/assets/img/onboarding_step_two.svg' alt='onboarding-step-2' />
                      <div className='home__tutorial-step-title'>{'Manage your devices'}</div>
                      <div className='home__tutorial-step-desc'>{'Auto-update test bench devices with every new build, define target groups, and manage full filesystem revisions with ease.'}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='home__tutorial-start'>
                <div className='home__tutorial-wrapper'>
                  <div className='home__tutorial-title home__tutorial-title--small'>{'Getting started'}</div>

                  <div className='home__tutorial-steps'>
                    <div className='home__tutorial-step'>
                      <div className='home__tutorial-step-name'>{'Start fresh'}</div>
                      <img className='home__tutorial-start-image' src='/assets/img/icons/black/start_fresh.svg' alt='fresh-start' />
                      <div className='home__tutorial-step-title'>{'Try out a quickstart project'}</div>
                      <div className='home__tutorial-step-desc'>{"New to Yocto? We'll take you through a starter project step by step."}</div>
                      <div className='home__tutorial-step-link'>
                        <a href='https://docs.ota.here.com/quickstarts/raspberry-pi.html' className='add-button' rel='noopener noreferrer' target='_blank' id='user-new-yocto-docs'>
                          {'Quickstart guide'}
                        </a>
                      </div>
                    </div>

                    <div className='home__tutorial-step'>
                      <div className='home__tutorial-step-name'>{'Integrate'}</div>
                      <img className='home__tutorial-start-image' src='/assets/img/icons/black/integrate.svg' alt='integration' />
                      <div className='home__tutorial-step-title'>{'Integrate with existing project'}</div>
                      <div className='home__tutorial-step-desc'>{'Add the meta-updater layer into your existing Yocto project and OTA-enable your devices.'}</div>
                      <div className='home__tutorial-step-link'>
                        <a
                          href='https://docs.ota.here.com/quickstarts/adding-ats-garage-updating-to-an-existing-yocto-project.html'
                          id='user-existing-yocto-docs'
                          className='add-button'
                          rel='noopener noreferrer'
                          target='_blank'
                        >
                          {'Integration guide'}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='home__box home__box--right'>
          <div className='home__list home__list--devices'>
            <div className='home__heading'>
              <div className='home__heading-col'>{'Last created devices'}</div>
              <div className='home__heading-col'>{'Seen online'}</div>
              <div className='home__heading-col'>{'Status'}</div>
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
            <div className='home__body home__body--right'>
              <LastDevices />
            </div>
          </div>
          <div className='home__list home__list--packages'>
            <div className='home__heading'>
              <div className='home__heading-col'>{'Last added packages'}</div>
              <div className='home__heading-col'>{'Version'}</div>
              <div className='home__heading-col'>{'Created at'}</div>
              <div className='dots' id='packages-menu' onClick={this.showPackageSubmenu}>
                {/* ToDo: better refactor to use plain CSS' instead */}
                <span />
                <span />
                <span />
                {this.packageSubmenuShown && (
                  <Dropdown hideSubmenu={this.hidePackageSubmenu}>
                    <li className='package-dropdown-item'>
                      <a className='package-dropdown-item' onClick={this.showPackagesCreateModal}>
                        {'Add package'}
                      </a>
                    </li>
                    <li className='package-dropdown-item'>
                      <NavLink to='/packages'>{'View all'}</NavLink>
                    </li>
                  </Dropdown>
                )}
              </div>
            </div>
            <div className='home__body home__body--right'>
              <LastPackages showPackagesCreateModal={this.showPackagesCreateModal} />
            </div>
          </div>
          <div className='home__list home__list--campaigns'>
            <div className='home__heading'>
              <div className='home__heading-col'>{'Active campaigns'}</div>
              <div className='home__heading-col'>{'Finished'}</div>
              <div className='home__heading-col'>{'Failure rate'}</div>
              <div className='dots' id='campaigns-menu' onClick={this.showCampaignSubmenu}>
                {/* ToDo: better refactor to use plain CSS' instead */}
                <span />
                <span />
                <span />

                {this.campaignSubmenuShown && (
                  <Dropdown hideSubmenu={this.hideCampaignSubmenu}>
                    <li className='campaign-dropdown-item'>
                      <a
                        className='campaign-dropdown-item'
                        onClick={e => {
                          e.preventDefault();
                          addNewWizard();
                        }}
                      >
                        {'Add campaign'}
                      </a>
                    </li>
                    <li className='campaign-dropdown-item'>
                      <NavLink to='/campaigns'>{'View all'}</NavLink>
                    </li>
                  </Dropdown>
                )}
              </div>
            </div>
            {/*<div className='home__body home__body--right'>
              <ActiveCampaigns addNewWizard={addNewWizard} />
            </div>*/}
          </div>
        </div>
        {this.packagesCreateModalShown && <PackagesCreateModal shown={this.packagesCreateModalShown} hide={this.hidePackagesCreateModal} />}
      </div>
    );
  }
}

export default Home;
