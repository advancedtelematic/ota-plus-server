/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { withTranslation } from 'react-i18next';
import { LatestCreatedCampaigns, LastDevices, LastSoftware } from '../components/dashboard';
import { Dropdown } from '../partials';
import { SoftwareCreateModal } from '../components/software';
import { setAnalyticsView } from '../helpers/analyticsHelper';
import { ANALYTICS_VIEW_OLD_DASHBOARD } from '../constants/analyticsViews';

@observer
class Dashboard extends Component {
  @observable packagesCreateModalShown = false;

  @observable deviceSubmenuShown = false;

  @observable packageSubmenuShown = false;

  @observable campaignSubmenuShown = false;

  static propTypes = {
    addNewWizard: PropTypes.func,
    t: PropTypes.func.isRequired
  };

  componentDidMount() {
    setAnalyticsView(ANALYTICS_VIEW_OLD_DASHBOARD);
  }

  showSoftwareCreateModal = (e) => {
    if (e) e.preventDefault();
    this.packagesCreateModalShown = true;
  };

  hideSoftwareCreateModal = (e) => {
    if (e) e.preventDefault();
    this.packagesCreateModalShown = false;
  };

  showDeviceSubmenu = (e) => {
    if (e) e.preventDefault();
    this.deviceSubmenuShown = true;
  };

  hideDeviceSubmenu = (e) => {
    if (e) e.preventDefault();
    this.deviceSubmenuShown = false;
  };

  showPackageSubmenu = (e) => {
    if (e) e.preventDefault();
    this.packageSubmenuShown = true;
  };

  hidePackageSubmenu = (e) => {
    if (e) e.preventDefault();
    this.packageSubmenuShown = false;
  };

  showCampaignSubmenu = (e) => {
    if (e) e.preventDefault();
    this.campaignSubmenuShown = true;
  };

  hideCampaignSubmenu = (e) => {
    if (e) e.preventDefault();
    this.campaignSubmenuShown = false;
  };

  render() {
    const { addNewWizard, t } = this.props;
    return (
      <div className="dashboard">
        <div className="dashboard__box">
          <div className="dashboard__list dashboard__list--devices">
            <div className="dashboard__heading">
              <div className="dashboard__heading-col">{t('dashboard.devices.last_created')}</div>
              <div className="dashboard__heading-col">{t('dashboard.devices.last_updated')}</div>
              <div className="dashboard__heading-col">{t('dashboard.devices.status')}</div>
              <div className="dots" id="devices-menu" onClick={this.showDeviceSubmenu}>
                {/* ToDo: better refactor to use plain CSS' instead */}
                <span />
                <span />
                <span />
                {this.deviceSubmenuShown && (
                  <Dropdown hideSubmenu={this.hideDeviceSubmenu}>
                    <li className="device-dropdown-item">
                      <a
                        className="device-dropdown-item"
                        href="https://docs.ota.here.com/quickstarts/start-intro.html"
                        rel="noopener noreferrer"
                        target="_blank"
                        onClick={e => e.stopPropagation()}
                      >
                        {t('dashboard.devices.add')}
                      </a>
                    </li>
                    <li className="device-dropdown-item">
                      <NavLink to="/devices">{t('dashboard.devices.view_all')}</NavLink>
                    </li>
                  </Dropdown>
                )}
              </div>
            </div>
            <div className="dashboard__body">
              <LastDevices />
            </div>
          </div>
          <div className="dashboard__list dashboard__list--software">
            <div className="dashboard__heading">
              <div className="dashboard__heading-col">{t('dashboard.software.last_added')}</div>
              <div className="dashboard__heading-col">{t('dashboard.software.version')}</div>
              <div className="dashboard__heading-col">{t('dashboard.software.created_at')}</div>
              <div className="dots" id="software-menu" onClick={this.showPackageSubmenu}>
                {/* ToDo: better refactor to use plain CSS' instead */}
                <span />
                <span />
                <span />
                {this.packageSubmenuShown && (
                  <Dropdown hideSubmenu={this.hidePackageSubmenu}>
                    <li className="package-dropdown-item">
                      <a onClick={this.showSoftwareCreateModal}>
                        {t('dashboard.software.add')}
                      </a>
                    </li>
                    <li className="package-dropdown-item">
                      <NavLink to="/software-repository">{t('dashboard.software.view_all')}</NavLink>
                    </li>
                  </Dropdown>
                )}
              </div>
            </div>
            <div className="dashboard__body">
              <LastSoftware showSoftwareCreateModal={this.showSoftwareCreateModal} />
            </div>
          </div>
          <div className="dashboard__list dashboard__list--campaigns">
            <div className="dashboard__heading">
              <div className="dashboard__heading-col">{t('dashboard.campaigns.last_created')}</div>
              <div className="dashboard__heading-col">{t('dashboard.campaigns.finished')}</div>
              <div className="dashboard__heading-col">{t('dashboard.campaigns.failure_rate')}</div>
              <div className="dots" id="campaigns-menu" onClick={this.showCampaignSubmenu}>
                {/* ToDo: better refactor to use plain CSS' instead */}
                <span />
                <span />
                <span />

                {this.campaignSubmenuShown && (
                  <Dropdown hideSubmenu={this.hideCampaignSubmenu}>
                    <li className="campaign-dropdown-item">
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          addNewWizard();
                        }}
                      >
                        {t('dashboard.campaigns.create')}
                      </a>
                    </li>
                    <li className="campaign-dropdown-item">
                      <NavLink to="/campaigns">{t('dashboard.campaigns.view_all')}</NavLink>
                    </li>
                  </Dropdown>
                )}
              </div>
            </div>
            <div className="dashboard__body">
              <LatestCreatedCampaigns addNewWizard={addNewWizard} />
            </div>
          </div>
        </div>
        {this.packagesCreateModalShown && (
          <SoftwareCreateModal
            shown={this.packagesCreateModalShown}
            hide={this.hideSoftwareCreateModal}
          />
        )}
      </div>
    );
  }
}

export default withTranslation()(Dashboard);
