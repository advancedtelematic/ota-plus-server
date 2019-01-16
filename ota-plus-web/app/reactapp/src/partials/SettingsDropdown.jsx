/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Avatar } from 'antd';
import { Dropdown, Button } from 'antd';
import onClickOutside from 'react-onclickoutside';
import $ from 'jquery';
import { LinkWrapper } from '../utils';
import NavigationProfile from './NavigationProfile';

@observer
class SettingsDropdown extends Component {
  static propTypes = {
    uiCredentialsDownload: PropTypes.bool,
  };

  render() {
    const { uiCredentialsDownload } = this.props;
    return (
      <Dropdown id='profile-dropdown' rootCloseEvent='mousedown'>
        <LinkWrapper bsRole='toggle'>
          {window.atsGarageTheme ? (
            <Avatar src='/assets/img/device_step_two.png' className='icon-profile' id='icon-profile-min' />
          ) : (
            <Avatar src='/assets/img/icons/Settings_Icon_small.svg' className='icon-profile' id='icon-profile-min' />
          )}
          &nbsp;
          <div className='dots nav-dots' id='settings-menu'>
            <span />
            <span />
            <span />
          </div>
        </LinkWrapper>
        <NavigationProfile bsRole='menu' settings uiCredentialsDownload={uiCredentialsDownload} />
      </Dropdown>
    );
  }
}

SettingsDropdown.propTypes = {};

export default onClickOutside(SettingsDropdown, {
  handleClickOutside: e => () => {
    if ($('#menu-login .dropdown').hasClass('open')) document.getElementById('profile-dropdown').click();
  },
});
