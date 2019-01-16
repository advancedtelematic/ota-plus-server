/** @format */

import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router';
import { Modal } from '../partials';
import _ from 'underscore';
import moment from 'moment';
import * as contracts from '../../../assets/contracts/';

@inject('stores')
@observer
export default class Terms extends Component {
  @observable termsAccepted = false;
  @observable showModal = false;

  toggleModal(e) {
    e.preventDefault();
    this.showModal = !this.showModal;
  }
  goBack(e) {
    e.preventDefault();
    window.history.go(-1);
  }
  render() {
    const { goBack, checked } = this.props;
    const { userStore } = this.props.stores;
    let terms = _.find(userStore.contracts, obj => contracts.default[obj.contract]);
    let agreedDate = terms && terms.accepted;
    !terms ? (terms = { contract: contracts.defaultName }) : terms;
    const htmlDoc = terms && terms.contract ? { __html: contracts.default[terms.contract] } : null;
    const contractModalContent = (
      <div className='modal-wrapper'>
        <div className='overflow' dangerouslySetInnerHTML={htmlDoc} />
        <div className='body-actions' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className='back btn-primary' id='modal-back-button' onClick={this.toggleModal.bind(this)}>
            Back
          </button>
          <button className='btn-primary' id='modal-accept-button' onClick={() => userStore.acceptContract(terms.contract)}>
            I agree
          </button>
        </div>
      </div>
    );
    return (
      <div className='terms'>
        <div className='wrapper-center wrapper-responsive'>
          <div className='logo logo--terms'>
            <img src='/assets/img/HERE_pos.png' alt='HERE' />
          </div>
          <div className='title title--terms'>This is a 90-day trial, for evaluation purposes only</div>
          <p className='subtitle--terms'>
            The proprietary software that you upload to HERE OTA Connect SaaS will be used by HERE only for the purposes of allowing you to test the service internally during the Trial Period.
          </p>
          <div className='checkbox-wrapper'>
            <button
              className={`btn-checkbox ${this.termsAccepted || checked ? 'checked' : ''}`}
              onClick={() => {
                !checked ? (this.termsAccepted = !this.termsAccepted) : null;
              }}
              id={'terms-checkbox' + (this.termsAccepted ? '-checked' : '')}
            >
              <i className='fa fa-check' aria-hidden='true' />
            </button>
            <p>
              I agree to HERE Location Platform Services Online
              <a id='service-terms-link' target='_blank' href='https://developer.here.com/terms-and-conditions'>
                {' '}
                terms and conditions{' '}
              </a>
              and{' '}
              <a target='_blank' id='privacy-policy-link' href='https://legal.here.com/en-gb/privacy'>
                privacy policy
              </a>
              <div className='agreed--terms'>{checked ? ` (AGREED ON ${moment(agreedDate).format('MMM Do YYYY')})` : '.'}</div>
            </p>
          </div>
          <div className='steps'>
            <a
              href='/login'
              className='back btn-primary'
              id='terms-btn-back'
              onClick={e => {
                goBack ? this.goBack(e) : null;
              }}
            >
              Back
            </a>
            {this.termsAccepted ? (
              <button
                className='next btn-primary'
                id='terms-btn-continue'
                onClick={() => {
                  userStore.acceptContract(terms && terms.contract);
                }}
              >
                Continue
              </button>
            ) : (
              <button className='next btn-primary' id='terms-btn-continue_disabled' disabled>
                Continue
              </button>
            )}
          </div>
        </div>
        <Modal content={contractModalContent} shown={this.showModal} />
      </div>
    );
  }
}
