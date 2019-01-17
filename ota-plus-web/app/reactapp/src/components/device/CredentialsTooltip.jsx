/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Formsy from 'formsy-react';
import { Select } from 'formsy-antd';
import { Button } from 'antd';
import serialize from 'form-serialize';
import _ from 'lodash';
import { OTAModal } from '../../partials';

const { Option } = Select;

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

  static propTypes = {
    deviceId: PropTypes.string.isRequired,
    shown: PropTypes.bool.isRequired,
    hide: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
  };

  selectPackageManager = type => {
    this.selectedPackageManager = type;
  };

  enableButton = () => {
    this.submitButtonDisabled = false;
  };

  disableButton = () => {
    this.submitButtonDisabled = true;
  };

  submit() {
    const { deviceId, hide } = this.props;
    const data = serialize(document.querySelector('#device-credentials-form'), { hash: true });
    /* toDo: api request instead */
    const link = `/api/v1/device_client/${deviceId}/toml?package_manager=${this.selectedPackageManager}&polling_sec=${data.pollingInterval}`;
    /* toDo: api request instead */
    window.open(link, '_blank');
    hide();
  }

  render() {
    const { shown, hide, className } = this.props;
    const form = (
      <Formsy onValid={this.enableButton} onInvalid={this.disableButton} onValidSubmit={this.submit} id='device-credentials-form'>
        <div className='row'>
          <div className='col-xs-6'>
            <Select
              name='packageManager'
              value='ostree'
              floatingLabelText='Package manager'
              className='input-wrapper'
              onChange={type => {
                this.selectPackageManager(type);
              }}
              required
            >
              {_.map(packageManagers, (packageType, title) => (
                <Option key={packageType} title={title} value={packageType} />
              ))}
            </Select>
          </div>
          <div className='col-xs-6'>
            {/*<FormsyText*/}
            {/*name="pollingInterval"*/}
            {/*value="60"*/}
            {/*floatingLabelText="Polling interval (s)"*/}
            {/*className="input-wrapper"*/}
            {/*validations={{*/}
            {/*isNumeric: true,*/}
            {/*minValue: function(values, value) {*/}
            {/*return value >= 10;*/}
            {/*}*/}
            {/*}}*/}
            {/*validationErrors={{*/}
            {/*isNumeric: "Please provide a number.",*/}
            {/*minValue: "Polling interval should be at least 10."*/}
            {/*}}*/}
            {/**/}
            {/*updateImmediately*/}
            {/*required*/}
            {/*/>*/}
          </div>
        </div>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='body-actions'>
              <Button htmlType='submit' onClick={hide} className='link-cancel'>
                {'Cancel'}
              </Button>
              <Button htmlType='submit' className='btn-main' disabled={this.submitButtonDisabled}>
                {'Download'}
              </Button>
            </div>
          </div>
        </div>
      </Formsy>
    );
    return <OTAModal title='Download the unique credentials for this device' content={form} visible={shown} className={className} />;
  }
}

export default CredentialsTooltip;
