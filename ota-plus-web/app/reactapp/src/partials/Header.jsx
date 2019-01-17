/** @format */

import PropTypes from 'prop-types';
import React, { defaultProps, Component } from 'react';

import { Link } from 'react-router-dom';

const Header = ({ title, subtitle, backButtonShown, children, device }) => {
  return (
    <div className='page-header'>
      <div className='page-header__left'>
        {backButtonShown ? (
          <Link href='#' id='back-button' className='page-header__back' to='/devices'>
            <i className='fa fa-angle-left' />
          </Link>
        ) : null}
        <div className='page-header__icon'>{device ? <div className={'device-status device-status--' + device.deviceStatus} id={'status-' + device.deviceStatus} /> : ''}</div>
        <div className='page-header__text'>
          <div className='page-header__title'>{title}</div>
          {subtitle ? <div className='page-header__subtitle'>{subtitle}</div> : null}
        </div>
      </div>
      <div className='page-header__right'>{children}</div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.object]),
  subtitle: PropTypes.any,
  backButtonShown: PropTypes.bool,
  children: PropTypes.object,
};

Header.defaultProps = {
  backButtonShown: false,
};

export default Header;
