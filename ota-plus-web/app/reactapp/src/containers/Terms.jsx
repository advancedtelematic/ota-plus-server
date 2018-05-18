import React, {Component} from 'react';
import {observable} from "mobx"
import {observer} from 'mobx-react';
import { Link } from 'react-router';
import {Modal} from '../partials';
import _ from 'underscore';
import * as contracts from '../../../assets/contracts/';

@observer
export default class Terms extends Component {
    @observable termsAccepted = false;
    @observable showModal = false;

    toggleModal(e) {
        e.preventDefault();
        this.showModal = !this.showModal;
    }
    render() {
        const {setTermsAccepted, userStore} = this.props;
        let terms = _.find(userStore.contracts, (obj) => contracts.default[obj.contract]);
        !terms ? terms = {contract: contracts.defaultName}: terms;
        const htmlDoc = terms && terms.contract  ? {__html: contracts.default[terms.contract]} : null;
        const contractModalContent = (
            <div className="modal-wrapper">
                <div className="overflow" dangerouslySetInnerHTML={htmlDoc}>
                </div>
                <div className="body-actions" style={{display:'flex', justifyContent: 'space-between'}}>
                    <button className="back btn-primary" id="modal-back-button" onClick={this.toggleModal.bind(this)}>Back</button>
                    <button className="btn-primary" id="modal-accept-button" onClick={() => setTermsAccepted(terms.contract)}>
                        I agree
                    </button>
                </div>
            </div>
        );
        return (
            <div className="terms">
                <div className="wrapper-center wrapper-responsive">
                    <div className="logo logo--terms">
                        <img src="/assets/img/HERE_pos.png" alt="HERE"/>
                    </div>
                    <div className="title title--terms">
                        This is a 90 days trial for
                        internal evaluation purposes only
                    </div>
                    <div className="checkbox-wrapper">
                        <button className={`btn-checkbox ${this.termsAccepted ? 'checked': ''}`} onClick={() => this.termsAccepted = !this.termsAccepted} id={"terms-checkbox" + (this.termsAccepted ? '-checked' : '')}>
                            <i className="fa fa-check" aria-hidden="true"/>
                        </button>
                        <p>
                            I agree to HERE Location Platform Services Online
                            <a id="service-terms-link" target="_blank" onClick={this.toggleModal.bind(this)} href="#"> terms and conditions </a>
                            and <a target="_blank" id="privacy-policy-link" href="https://legal.here.com/en-gb/privacy" >privacy policy.</a>
                        </p>
                    </div>
                    <div className="steps">
                        <button className="back btn-primary" id="terms-btn-back"><a href="/login">Back</a></button>
                        {this.termsAccepted ?
                            <button className="next btn-primary" id="terms-btn-continue" onClick={() => {setTermsAccepted(terms && terms.contract)}}>Continue</button> :
                            <button className="next btn-primary" id="terms-btn-continue_disabled" disabled>Continue</button>
                        }
                    </div>
                </div>
                <Modal
                    content={contractModalContent}
                    shown={this.showModal}
                />
            </div>
        )
    }
}
