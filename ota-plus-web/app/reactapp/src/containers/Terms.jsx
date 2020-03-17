/** @format */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import moment from 'moment';
import { withTranslation } from 'react-i18next';

import { Button, Checkbox } from 'antd';
import { OTAModal } from '../partials';
import * as contracts from '../../contracts';
import { URL_PRIVACY, URL_TERMS_AND_CONDITIONS } from '../constants/urlConstants';
import { SERVICE_TERMS_AGREED_DATE_FORMAT } from '../constants/datesTimesConstants';
import { HERE_ICON } from '../config';

@inject('stores')
@observer
class Terms extends Component {
  @observable termsAccepted = false;

  @observable showModal = false;

  static propTypes = {
    stores: PropTypes.shape({}),
    checked: PropTypes.bool,
    history: PropTypes.shape({}),
    t: PropTypes.func.isRequired
  };

  toggleModal = (e) => {
    e.preventDefault();
    this.showModal = !this.showModal;
  };

  render() {
    const { stores, checked, history, t } = this.props;
    const { userStore } = stores;
    let terms = _.find(userStore.contracts, obj => contracts.default[obj.contract]);
    const agreedDate = terms && terms.accepted;
    const agreedDateFormatted = moment(agreedDate).format(SERVICE_TERMS_AGREED_DATE_FORMAT);

    terms = terms || { contract: contracts.defaultName };
    const htmlDoc = terms && terms.contract ? { __html: contracts.default[terms.contract] } : null;
    const contractModalContent = (
      <div className="modal-wrapper">
        <div className="overflow" dangerouslySetInnerHTML={htmlDoc} />
        <div className="body-actions" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            htmlType="button"
            type="primary"
            className="back"
            id="modal-back-button"
            onClick={this.toggleModal}
          >
            {'Back'}
          </Button>
          <Button
            htmlType="button"
            type="primary"
            id="modal-accept-button"
            onClick={() => userStore.acceptContract(terms.contract)}
          >
            {'I agree'}
          </Button>
        </div>
      </div>
    );
    const isTermsAccepted = userStore.isTermsAccepted();
    return (
      <div className={`terms ${isTermsAccepted ? '' : 'fill-screen'}`}>
        <div className="wrapper wrapper-center wrapper-responsive">
          <div className="logo logo--terms">
            <img src={HERE_ICON} alt="HERE" />
          </div>
          <div className="title title--terms">This is a 90-day trial, for evaluation purposes only</div>
          <p className="subtitle--terms">
            The proprietary software that you upload to HERE OTA Connect SaaS will be used by HERE only
             for the purposes of allowing you to test the service internally during the Trial Period.
          </p>
          <div className="checkbox-wrapper">
            {!terms.accepted && (
              <Checkbox
                checked={this.termsAccepted}
                onChange={() => { this.termsAccepted = !this.termsAccepted; }}
              />
            )}
            <div>
              I agree to HERE Location Platform Services Online
              <a
                id="service-terms-link"
                rel="noopener noreferrer"
                target="_blank"
                href={URL_TERMS_AND_CONDITIONS}
              >
                {' '}
                terms and conditions
                {' '}
              </a>
              and
              {' '}
              <a
                rel="noopener noreferrer"
                target="_blank"
                id="privacy-policy-link"
                href={URL_PRIVACY}
              >
                privacy policy
              </a>
              <div className="agreed--terms">
                {checked ? t('terms.agreed-on', { date: agreedDateFormatted }) : '.'}
              </div>
            </div>
          </div>
          {!terms.accepted && (
            <div className="steps">
              <a href="/login" className="back btn-primary" id="terms-btn-back">
                Back
              </a>
              {this.termsAccepted ? (
                <Button
                  htmlType="button"
                  className="next btn-primary"
                  id="terms-btn-continue"
                  onClick={() => {
                    userStore.acceptContract(terms && terms.contract)
                      .then((success) => {
                        if (success) {
                          history.push('/');
                        }
                      });
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  htmlType="button"
                  type="primary"
                  className="next"
                  id="terms-btn-continue_disabled"
                  disabled
                >
                  Continue
                </Button>
              )}
            </div>
          )}
        </div>
        <OTAModal content={contractModalContent} visible={this.showModal} />
      </div>
    );
  }
}

export default withTranslation()(withRouter(Terms));
