/** @format */

import React, { Component, PropTypes } from 'react';
import { Modal } from '../../partials';

class Tooltip extends Component {
  render() {
    const { shown, hide } = this.props;
    const content = (
      <span>
        <div className='text-center'>
          With HERE OTA Connect, you can <strong>blacklist</strong> problem packages, ensuring they <br />
          won't get installed on any of your devices. <br />
          <br />
          On the <strong>Impact analysis tab</strong>, you can view which of your devices already <br />
          have the blacklisted version of the package installed, letting you <br />
          proactively troubleshoot and update those devices to a fixed version, <br />
          or roll them back to an older version.
          <br />
          <br />
          <img src='/assets/img/impact_tooltip.jpg' alt='' />
        </div>
        <div className='body-actions'>
          <button className='btn-primary' onClick={hide} id='impact-analysis-got-it﻿'>
            Got it
          </button>
        </div>
      </span>
    );

    return (
      <Modal
        title={
          <div className='heading'>
            <div className='internal'>Blacklist</div>
          </div>
        }
        content={content}
        shown={shown}
      />
    );
  }
}

export default Tooltip;
