/** @format */

import React, { Component, PropTypes } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Modal } from '../../partials';
import { Form } from 'formsy-react';
import { FormsyText, FormsySelect } from 'formsy-material-ui/lib';
import { FlatButton, MenuItem } from 'material-ui';
import serialize from 'form-serialize';
import _ from 'underscore';

const packageManagers = {
  dev: 'Debian',
  rpm: 'RPM',
  ostree: 'OSTree',
  off: 'Off',
};

@observer
class CredentialsTooltip extends Component {
  @observable submitButtonDisabled = true;
  @observable selectedPackageManager = 'ostree';

  constructor(props) {
    super(props);
    this.selectPackageManager = this.selectPackageManager.bind(this);
  }
  enableButton() {
    this.submitButtonDisabled = false;
  }
  disableButton() {
    this.submitButtonDisabled = true;
  }
  selectPackageManager(e) {
    this.selectedPackageManager = e.target.innerHTML.toLowerCase();
  }
  submitForm() {
    let data = serialize(document.querySelector('#device-credentials-form'), { hash: true });
    let link = '/api/v1/device_client/' + this.props.deviceId + '/toml?package_manager=' + this.selectedPackageManager + '&polling_sec=' + data.pollingInterval;
    window.open(link, '_blank');
    this.props.hide();
  }
  render() {
    const { shown, hide, className } = this.props;
    const selectPackageManager = this.selectPackageManager;
    const form = (
      <Form onValid={this.enableButton.bind(this)} onInvalid={this.disableButton.bind(this)} onValidSubmit={this.submitForm.bind(this)} id='device-credentials-form'>
        <div className='row'>
          <div className='col-xs-6'>
            <FormsySelect name='packageManager' value='ostree' floatingLabelText='Package manager' className='input-wrapper' required>
              {_.map(packageManagers, (value, name) => {
                return <MenuItem value={name} primaryText={value} key={name} onTouchTap={selectPackageManager} />;
              })}
            </FormsySelect>
          </div>
          <div className='col-xs-6'>
            <FormsyText
              name='pollingInterval'
              value='60'
              floatingLabelText='Polling interval (s)'
              className='input-wrapper'
              validations={{
                isNumeric: true,
                minValue: function(values, value) {
                  return value >= 10;
                },
              }}
              validationErrors={{
                isNumeric: 'Please provide a number.',
                minValue: 'Polling interval should be at least 10.',
              }}
              updateImmediately
              required
            />
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='body-actions'>
              <a href='#' onClick={hide} className='link-cancel'>
                Cancel
              </a>
              <FlatButton label='Download' type='submit' className='btn-main' disabled={this.submitButtonDisabled} />
            </div>
          </div>
        </div>
      </Form>
    );
    return <Modal title='Download the unique credentials for this device' content={form} shown={shown} className={className} />;
  }
}

CredentialsTooltip.propTypes = {
  shown: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired,
};

export default CredentialsTooltip;
